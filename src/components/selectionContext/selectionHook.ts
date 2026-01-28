import {isSelected, isUnset, toArray, useControlled, useDerivedState, useSync} from '../../utils'
import {Dispatch, SetStateAction, useCallback, useMemo, useRef} from 'react'
import {ISelectionContext, OptionType, SelectionContextProps, useSelectionContext} from './selectionContext'
import {Id, SelectableProps} from '../../types'

export function useSelection<O extends OptionType<V>, V extends Id = Id>({...props}: SelectionContextProps<O, V>): ISelectionContext<O, V> {
    props.primaryKey ??= 'id'
    props.childrenKey ??= 'children'
    props.relation ??= 'dependent'
    props.integration ??= 'shallowest'
    props.multiple ??= false
    props.disabled ??= false

    let [innerValue, setInnerValue] = useControlled<any>(props.defaultValue, props.value, props.onChange)

    let [innerOptions, setInnerOptions] = useDerivedState(props.options)

    /**
     * ----------------------------------------------------------------
     * 若嵌套在另个一SelectionContext内，取最外层数据
     */

    const context = useSelectionContext<O, V>()

    if (context.inSelection) {
        innerValue.current = context.value!
        setInnerValue = context.setValue!
        innerOptions.current = context.options!
    }

    const optionsMap = useMemo(() => {
        if (context.inSelection) {
            return context.optionsMap!
        }
        const map = new Map<V, O>()
        const fn = (arr?: O[], parentId?: V) => {
            // 有时arr可能不为数组，需要判断，如DataGrid组件的row.children
            Array.isArray(arr) && arr.forEach((item, i) => {
                item._parentId = parentId
                item._isLast = i === arr.length - 1
                const id = item[props.primaryKey!]
                !isUnset(id) && map.set(id, item)
                fn(item[props.childrenKey!], id)
            })
        }
        fn(innerOptions.current)
        return map
    }, [innerOptions.current, props.primaryKey, props.childrenKey, context.optionsMap])

    const syncOptionsMap = useSync(optionsMap)

    const syncProps = useSync(props)

    const calSelectionStatus = (selectedSet = new Set<V | undefined>(toArray(innerValue.current))) => {
        const {multiple, relation, primaryKey, childrenKey} = syncProps.current
        const map = new Map<V, 1 | 2>()
        for (const k of selectedSet) {
            !isUnset(k) && map.set(k, 2)
        }
        if (multiple && relation === 'dependent') {
            const fn = (arr?: O[], parentSelected?: boolean) => {
                // 双倍计数，便于处理半选状态
                let doubleSelectedCount = 0
                // 有时arr可能不为数组，需要判断，如DataGrid组件的row.children
                Array.isArray(arr) && arr.forEach(item => {
                    const id = item[primaryKey!]
                    if (isUnset(id)) {
                        return
                    }
                    // 父节点选中则认为当前节点也选中
                    let currentSelected = parentSelected || selectedSet.has(id)
                    const children: any = item[childrenKey!]
                    const doubleSelectedChildren = fn(children, currentSelected)
                    // 若子节点全部选中，当前节点状态也为选中
                    currentSelected ||= doubleSelectedChildren > 0 && doubleSelectedChildren === (children.length || 0) * 2
                    if (currentSelected) {
                        // 选中，计数加2
                        map.set(id, 2)
                        doubleSelectedCount += 2
                    } else if (doubleSelectedChildren > 0) {
                        // 半选中，计数加1
                        map.set(id, 1)
                        doubleSelectedCount++
                    }
                })
                return doubleSelectedCount
            }
            fn(innerOptions.current)
        }
        return map
    }

    const preCalSelectionStatus = useRef<Map<V, 1 | 2>>(void 0)

    const selectionStatus = useMemo(() => {
        if (context.inSelection) {
            return context.selectionStatus!
        }
        // 调用toggleSelected()方法后可能会预先计算selectionStatus
        const ret = preCalSelectionStatus.current || calSelectionStatus()
        preCalSelectionStatus.current = void 0
        return ret
    }, [innerValue.current, optionsMap, props.multiple, props.relation, context.selectionStatus])

    const syncSelectionStatus = useSync(selectionStatus)

    const toggleSelected = useCallback((value: V) => {
        if (context.inSelection) {
            context.toggleSelected!(value)
            return
        }
        if (syncProps.current.disabled) {
            return
        }

        const {onToggle, multiple, relation, integration, primaryKey, childrenKey, clearable} = syncProps.current
        const selectionStatus = syncSelectionStatus.current
        const currentSelected = selectionStatus.get(value) === 2
        onToggle?.(!currentSelected, value, syncOptionsMap.current.get(value))

        if (!multiple) {
            if (!currentSelected) {
                setInnerValue(value)
            } else if (clearable) {
                // 单选模式必须指定clearable才能清空选择
                setInnerValue(void 0)
            }
            return
        }
        // multiple
        if (relation === 'standalone') {
            setInnerValue((o?: V | V[]) => {
                const arr = toArray(o) || []
                return currentSelected
                    ? arr.filter(v => v !== value)
                    : [...arr, value]
            })
            return
        }
        // relation === 'dependent'
        // 按照deepest方式计算出已选项
        const deepestSelectedSet = new Set<V>(toArray(innerValue.current))
        loopOptions((id, children, parentModifiedTo) => {
            // 父节点已修改，子节点同步修改
            const modifyTo = typeof parentModifiedTo === 'boolean' ? parentModifiedTo
                // 当前为目标节点，直接修改
                : id === value ? !currentSelected
                    : void 0
            if (children) {
                // 有children，优先向下递归，并从已选中删除
                deepestSelectedSet.delete(id)
            } else if (modifyTo === false) {
                deepestSelectedSet.delete(id)
            } else {
                modifyTo === true || selectionStatus.get(id) === 2
                    ? deepestSelectedSet.add(id)
                    : deepestSelectedSet.delete(id)
            }
            return modifyTo
        })
        // 根据integration模式拆分得到最终值
        if (integration !== 'deepest') {
            const newStatus = preCalSelectionStatus.current = calSelectionStatus(deepestSelectedSet)
            if (integration === 'shallowest') {
                loopOptions((id, _, parentSelected) => {
                    const selected = newStatus.get(id) === 2
                    !parentSelected && selected
                        // 父节点未选中，子节点选中，表示该子节点为最上层选中节点，满足shallowest
                        ? deepestSelectedSet.add(id)
                        : deepestSelectedSet.delete(id)
                    return parentSelected || selected
                })
            } else {
                // integration === 'all'
                for (const [id, status] of newStatus) {
                    status === 2
                        ? deepestSelectedSet.add(id)
                        : deepestSelectedSet.delete(id)
                }
            }
        }

        setInnerValue([...deepestSelectedSet])

        /**
         * 通用的递归方法
         * @param callback
         * @param arr
         * @param payload
         */
        function loopOptions<T>(callback: (id: V, children: O[] | null, payload?: T) => T, arr: O[] | undefined = innerOptions.current, payload?: T) {
            arr?.forEach(item => {
                const id = item[primaryKey!]
                if (isUnset(id)) {
                    return
                }
                let children: O[] | null = item[childrenKey!]
                children = Array.isArray(children) && children.length ? children : null
                const ret = callback(id, children, payload)
                children && loopOptions(callback, children, ret)
            })
        }
    }, [context.inSelection])

    return {
        inSelection: true,
        multiple: props.multiple!,
        disabled: props.disabled!,
        value: innerValue.current,
        setValue: setInnerValue,
        options: innerOptions.current,
        setOptions: setInnerOptions,
        optionsMap,
        selectionStatus,
        toggleSelected
    }
}

export type UseFlatSelectionParams<V extends Id = Id> = Omit<SelectableProps<V>, 'multiple'> & {
    multiple?: boolean
    disabled?: boolean
    clearable?: boolean
}

export function useFlatSelection<V extends Id = Id>(params: UseFlatSelectionParams<V>): [V, (value: V) => void, Dispatch<SetStateAction<V>>] {
    const [innerValue, setInnerValue] = useControlled<any>(params.defaultValue, params.value, params.onChange)

    const sync = useSync(params)

    return [
        innerValue.current,
        useCallback(value => {
            if (sync.current.disabled) {
                return
            }
            const currentSelected = isSelected(value, innerValue.current)
            if (sync.current.multiple) {
                setInnerValue((o?: V[]) => {
                    o = toArray(o) || []
                    return currentSelected
                        ? o.filter(v => v !== value)
                        : [...o, value]
                })
            } else {
                // single
                if (!currentSelected) {
                    setInnerValue(value)
                } else if (sync.current.clearable) {
                    // 单选模式必须指定clearable才能清空选择
                    setInnerValue(void 0)
                }
            }
        }, []),
        setInnerValue
    ]
}