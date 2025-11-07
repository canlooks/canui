import {Id, Obj, SelectableProps} from '../../types'
import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo} from 'react'
import {useSelection} from './selectionHook'

export interface OptionType<V extends Id = Id> extends Obj {
    children?: OptionType<V>[]
    /** @private */
    _parentId?: V
    /** @private */
    _isLast?: boolean
}

export type SelectionContextBaseProps<O extends OptionType<V>, V extends Id = Id> = {
    options?: O[]
    primaryKey?: keyof O
    /** 默认为`children` */
    childrenKey?: keyof O
    /**
     * 节点之间的关系
     * @enum {'dependent'} 会自动判断子父节点的选中关系。
     * @enum {'standalone'} 所有节点相互独立。
     * 默认为`dependent`
     */
    relation?: 'dependent' | 'standalone'
    /**
     * 选中值的整合方式，relation为'dependent'时生效
     * @enum {'shallowest'} 尽可能向上归集。
     * @enum {'deepest'} 尽可能向下展开。
     * @enum {'all'} 所有选中的值。
     * 默认为`"shallowest"`
     */
    integration?: 'shallowest' | 'deepest' | 'all'
    /** 单选模式必须指定clearable才能清空选择 */
    clearable?: boolean
    disabled?: boolean
    onToggle?(checked: boolean, value: V, option?: O): void
    children?: ReactNode
}

export type ISelectionContext<O extends OptionType<V>, V extends Id = Id> = {
    inSelection: true
    multiple: boolean
    disabled: boolean
    value?: V | V[]
    setValue: Dispatch<SetStateAction<undefined | V | V[]>>
    options?: O[]
    setOptions: Dispatch<SetStateAction<undefined | O[]>>
    optionsMap: Map<V, O>
    selectionStatus: Map<V, 1 | 2>
    toggleSelected(value: V, option?: O): void
    onToggle?(checked: boolean, value: V, option?: O): void
}

const SelectionContextProvider = createContext({} as ISelectionContext<any, any>)

export function useSelectionContext<O extends OptionType<V>, V extends Id = Id>(): ISelectionContext<O, V> {
    return useContext(SelectionContextProvider)
}

export type SelectionContextProps<O extends OptionType<V>, V extends Id = Id> = SelectionContextBaseProps<O, V> & SelectableProps<V>

export function SelectionContext<O extends OptionType<V>, V extends Id = Id>(props: SelectionContextProps<O, V>) {
    const selection = useSelection(props)

    return (
        <SelectionContextProvider value={
            useMemo(() => selection, [props.disabled, selection.selectionStatus])
        }>
            {props.children}
        </SelectionContextProvider>
    )
}