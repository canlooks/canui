import {Dispatch, ReactElement, ReactNode, Ref, SetStateAction, createContext, memo, useContext, useDeferredValue, useEffect, useMemo, useState, ComponentProps} from 'react'
import {useControlled, useLoading, useKeyboard, CallbackInfo, joinNodes, clsx, mergeComponentProps, isNoValue} from '../../utils'
import {Input, InputProps} from '../input'
import {InputBase, InputBaseProps} from '../inputBase'
import {Popper, PopperProps, PopperRef} from '../popper'
import {Tag} from '../tag'
import {classes, cascadePopperStyle, style} from './cascade.style'
import {CascadePanel} from './cascadePanel'
import {SearchResult} from './searchResult'
import {OptionType, SelectionContextProps} from '../selectionContext'
import {MenuOptionType, OptionsBaseSharedProps} from '../optionsBase'
import {Id, SelectableMultipleProps, SelectableSingleProps} from '../../types'
import {useSelection} from '../selectionContext'
import {Icon} from '../icon'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass'
import {faCaretDown} from '@fortawesome/free-solid-svg-icons/faCaretDown'

export interface CascadeBaseProps<O extends MenuOptionType<V>, V extends Id = Id> extends Omit<OptionsBaseSharedProps<O>, 'filterPredicate'>,
    Omit<InputBaseProps<'input'>, 'children' | 'defaultValue' | 'value' | 'onChange'> {
    /** cascade内部由<input />实现 */
    inputProps?: ComponentProps<'input'>

    defaultOpen?: boolean
    open?: boolean
    onOpenChange?(open: boolean): void
    /** @attention 注意loadOptions返回的必须是从根节点开始的完整树型数据，并非数据片段 */
    loadOptions?(searchValue?: string, parent?: O): O[] | Promise<O[]>
    searchable?: boolean
    defaultSearchValue?: string
    searchValue?: string
    onSearchChange?(searchValue: string): void
    searchInputProps?: InputProps

    childrenKey?: keyof O

    popperProps?: PopperProps
    popperRef?: Ref<PopperRef>

    integration?: SelectionContextProps<O, V>['integration']
}

export interface CascadeSingleProps<O extends MenuOptionType<V>, V extends Id = Id> extends CascadeBaseProps<O, V>, SelectableSingleProps<V[]> {
    renderBackfill?(value: V[]): ReactNode
}

export interface CascadeMultipleProps<O extends MenuOptionType<V>, V extends Id = Id> extends CascadeBaseProps<O, V>, SelectableMultipleProps<V[]> {
    renderBackfill?(value: V[][]): ReactNode
}

export type CascadeProps<O extends MenuOptionType<V>, V extends Id = Id> = CascadeSingleProps<O, V> | CascadeMultipleProps<O, V>

type CascadeContext<O extends MenuOptionType<V>, V extends Id = Id> = {
    innerLoading: boolean
    loadingOption: V | undefined
    multiple: boolean
    showCheckbox: boolean
    /** 默认为"value" */
    primaryKey: keyof O
    labelKey: keyof O
    childrenKey: keyof O
    pathifiedValue: undefined | V[] | V[][]
    selectionStatus: Map<V, 1 | 2>
    optionsMap: Map<V, O>
    openedPanels: V[]
    onOptionClick(opt: O, index: number): void
    onCheckboxClick(opt: O, index: number): void
    verticalIndex: number
    setVerticalIndex: Dispatch<SetStateAction<number>>
    horizontalIndex: number
}

const CascadeContext = createContext({} as CascadeContext<any>)

export function useCascadeContext<O extends MenuOptionType<V>, V extends Id = Id>() {
    return useContext(CascadeContext) as CascadeContext<O, V>
}

export const Cascade = memo(<O extends OptionType<V>, V extends Id = Id>({
    inputProps,

    defaultOpen = false,
    open,
    onOpenChange,
    children,
    loadOptions,

    multiple = false,
    showCheckbox = !!multiple,
    defaultValue,
    value,
    onChange,
    renderBackfill,
    searchable,
    defaultSearchValue = '',
    searchValue,
    onSearchChange,
    searchInputProps,
    popperProps,
    popperRef,
    clearable = !!multiple,

    integration = 'deepest',

    // 共享属性，从OptionsBaseSharedProps继承
    loading,
    options,
    labelKey = 'label',
    primaryKey = 'value',
    childrenKey = 'children',
    searchTokenKey = 'searchToken',
    ...props
}: CascadeProps<O, V>) => {
    /**
     * --------------------------------------------------------------------
     * 搜索
     */

    const [innerSearchValue, setInnerSearchValue] = useControlled(defaultSearchValue, searchValue, onSearchChange)
    const deferredSearchValue = useDeferredValue(innerSearchValue.current.trim())

    useEffect(() => {
        loadOptions && searchable && deferredSearchValue && innerLoadOptions()
    }, [deferredSearchValue])

    /**
     * --------------------------------------------------------------------
     * 打开的弹框与面板
     */

    const [innerOpen, setInnerOpen] = useControlled(defaultOpen, open, onOpenChange)

    const onOpenChangeEnd = (open: boolean) => {
        // 关闭动画结束后清空搜索框
        searchable && !open && setInnerSearchValue('')
    }

    const [openedPanels, setOpenedPanels] = useState<V[]>([])

    const toggleOpenedPanels = (value: V, index: number) => {
        setOpenedPanels(o => {
            const newOpened = o.slice(0, index)
            newOpened.push(value)
            return newOpened
        })
    }

    /**
     * --------------------------------------------------------------------
     * 选项与请求
     */

    const [loadingOption, setLoadingOption] = useState<V>()

    const [innerOptions, setInnerOptions] = useState<O[]>()

    const [innerLoading, innerLoadOptions] = useLoading(async (searchValue?: string, parent?: O) => {
        setLoadingOption(parent?.[primaryKey])
        setInnerOptions(
            await loadOptions!(searchValue, parent)
        )
    }, loading)

    useEffect(() => {
        if (loadOptions && !searchable && !innerOpen.current && !isNoValue(innerValue)) {
            // 第一次渲染就有value，需要请求数据
            innerLoadOptions(innerSearchValue.current)
        }
    }, [])

    useEffect(() => {
        // 打开下拉框时请求数据
        loadOptions && innerOpen.current && innerLoadOptions(innerSearchValue.current)
    }, [innerOpen.current])

    const actualOptions = innerOptions || options

    /**
     * --------------------------------------------------------------------
     * 控制选中状态
     */

    const [pathifiedValue, setPathifiedValue] = useControlled<undefined | V[] | V[][]>(defaultValue || [], value, onChange as any)

    // 路径转单一键
    const toStandardValue = (path?: V[] | V[][]) => {
        if (!path) {
            return
        }
        if (multiple) {
            return (path as V[][]).map(path => path[path.length - 1])
        }
        return (path as V[])[path!.length - 1]
    }

    // 单一键转路径
    const toPathifiedValue = (value?: V | V[]) => {
        if (!value) {
            return
        }
        const findParent = (v: V, path: V[] = []) => {
            const node = optionsMap!.get(v)
            if (node) {
                path.unshift(v)
                node._parentId && findParent(node._parentId, path)
            }
            return path
        }
        return multiple ? (value as V[]).map(v => findParent(v)) : findParent(value as V)
    }

    const {
        value: innerValue,
        setValue: setInnerValue,
        toggleSelected,
        selectionStatus,
        optionsMap
    } = useSelection<O, V>({
        options: actualOptions,
        multiple,
        value: toStandardValue(pathifiedValue.current) as any,
        onChange(value?: V | V[]) {
            setPathifiedValue(toPathifiedValue(value))
        },
        primaryKey,
        childrenKey,
        clearable,
        integration
    })

    const onClear = () => {
        setInnerValue!([])
        setOpenedPanels([])
    }

    const onOptionClick = async (option: O, index: number) => {
        const optVal = option[primaryKey]
        const opened = openedPanels[index] === optVal
        if (!opened) {
            loadOptions && await innerLoadOptions(innerSearchValue.current, option)
            toggleOpenedPanels(optVal, index)
        }
        if (!multiple || opened) {
            toggleSelected!(optVal)
        }
    }

    const onCheckboxClick = (option: O, index: number) => {
        toggleSelected!(option[primaryKey])
        onOptionClick(option, index)
    }

    /**
     * --------------------------------------------------------------------
     * 键盘控制
     */

    const getChildren = (index: number): O[] | undefined => {
        const targetNode = optionsMap!.get(openedPanels[index])
        return targetNode ? targetNode[childrenKey] : actualOptions
    }

    const horizontalCount = () => {
        const lastOpenedChildren = getChildren(openedPanels.length - 1)
        return lastOpenedChildren?.length ? openedPanels.length + 1 : openedPanels.length
    }

    const {verticalIndex, horizontalIndex, setVerticalIndex, setHorizontalIndex} = useKeyboard({
        disabled: !!deferredSearchValue,
        allowHorizontal: true,
        horizontalCount,
        allowVertical: true,
        verticalCount(hi) {
            const arr = getChildren(hi - 1)
            return arr?.length || 0
        },
        open: innerOpen.current,
        setOpen: setInnerOpen,
        onEnter(info) {
            keyboardPressHandler(info)
        },
        onKeyDown(info, e) {
            if (e.key === 'ArrowRight' && info.horizontalIndex === info.horizontalCount - 1) {
                // 在最后一个面板按右箭头，相当于按回车
                e.preventDefault()
                keyboardPressHandler(info)
            }
        }
    })

    const keyboardPressHandler = ({verticalIndex, horizontalIndex}: CallbackInfo) => {
        const option = getChildren(horizontalIndex - 1)?.[verticalIndex]
        if (option) {
            onOptionClick(option, horizontalIndex)
        }
    }

    useMemo(() => {
        setHorizontalIndex(Math.max(horizontalCount() - 1, 0))
    }, [openedPanels])

    /**
     * --------------------------------------------------------------------
     * 渲染部分
     */

    const renderBackfillFn = () => {
        if (renderBackfill) {
            return renderBackfill(pathifiedValue.current as any)
        }
        if (multiple) {
            return (pathifiedValue.current as V[][])?.map(path =>
                <Tag
                    key={path[path.length - 1] as any}
                    closable
                    onClose={() => toggleSelected!(path[path.length - 1])}
                >
                    {joinNodes(path, v => optionsMap!.get(v)?.[labelKey] ?? v.toString())}
                </Tag>
            )
        } else {
            return (
                <div className={classes.backfillWrap}>
                    {joinNodes(pathifiedValue.current as V[], v => optionsMap!.get(v)?.[labelKey] ?? v.toString())}
                </div>
            )
        }
    }

    return (
        <Popper
            {...mergeComponentProps<PopperProps>(
                {
                    css: cascadePopperStyle,
                    open: innerOpen.current,
                    placement: 'bottomLeft',
                    trigger: ['click', 'enter'],
                    disabled: props.disabled,
                    content: (
                        <div>
                            {searchable &&
                                <Input
                                    prefix={<Icon icon={faMagnifyingGlass}/>}
                                    placeholder="搜索"
                                    value={innerSearchValue.current}
                                    {...searchInputProps}
                                    className={clsx(classes.searchInput, searchInputProps?.className)}
                                    onChange={e => {
                                        searchInputProps?.onChange?.(e)
                                        setInnerSearchValue(e.target.value)
                                    }}
                                />
                            }
                            {deferredSearchValue
                                ? <SearchResult<O>
                                    primaryKey={primaryKey}
                                    labelKey={labelKey}
                                    childrenKey={childrenKey}
                                    searchTokenKey={searchTokenKey}
                                    options={actualOptions}
                                    searchValue={deferredSearchValue}
                                    onSelect={toggleSelected}
                                    selectionStatus={selectionStatus!}
                                />
                                : <div className={classes.panelContainer}>
                                    <CascadeContext value={{
                                        innerLoading: innerLoading.current, loadingOption, multiple, showCheckbox,
                                        primaryKey, labelKey, childrenKey, pathifiedValue: pathifiedValue.current,
                                        selectionStatus, optionsMap,
                                        openedPanels, onOptionClick, onCheckboxClick,
                                        verticalIndex: verticalIndex.current, setVerticalIndex, horizontalIndex: horizontalIndex.current
                                    } as any}>
                                        <CascadePanel options={actualOptions}/>
                                    </CascadeContext>
                                </div>
                            }
                        </div>
                    )
                },
                popperProps,
                {
                    popperRef,
                    onOpenChange: setInnerOpen,
                    onOpenChangeEnd
                }
            )}
        >
            <InputBase<'input'>
                {...mergeComponentProps<InputBaseProps<'input'>>(
                    props,
                    {
                        css: style,
                        className: classes.root,
                        onClear,
                        clearable,
                        value: pathifiedValue.current as any,
                        loading: innerLoading.current
                    }
                )}
                data-focused={innerOpen.current}
            >
                {inputBaseProps =>
                    <div className={classes.contentWrap}>
                        {!pathifiedValue.current?.length
                            ? <div className={classes.placeholder}>{props.placeholder}</div>
                            : <div className={classes.backfill}>
                                {renderBackfillFn()}
                            </div>
                        }
                        <input
                            {...mergeComponentProps<'input'>(inputBaseProps, inputProps)}
                            data-hidden="true"
                        />
                        <div className={classes.arrow} data-open={innerOpen.current}>
                            <Icon icon={faCaretDown}/>
                        </div>
                    </div>
                }
            </InputBase>
        </Popper>
    )
}) as <O extends MenuOptionType<V>, V extends Id = Id>(props: CascadeProps<O, V>) => ReactElement