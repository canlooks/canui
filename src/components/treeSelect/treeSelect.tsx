import {Children, isValidElement, memo, ReactElement, ReactNode, useMemo} from 'react'
import {NodeType, Tree, TreeBaseProps, TreeNode} from '../tree'
import {Id} from '../../types'
import {SelectBase, SelectBaseMultipleProps, SelectBaseOwnProps, SelectBaseProps, SelectBaseSingleProps} from '../selectBase'
import {InputBaseProps} from '../inputBase'
import {useSelection} from '../selectionContext'
import {Placeholder} from '../placeholder'

export interface TreeSelectOwnProps<N extends NodeType<V>, V extends Id = Id> extends SelectBaseOwnProps, Omit<TreeBaseProps<N, V>, 'prefix'> {
    options?: N[]
    inputBaseProps?: InputBaseProps<'input'>
    variant?: InputBaseProps<'input'>['variant']
    size?: InputBaseProps<'input'>['size']
    shape?: InputBaseProps<'input'>['shape']
    color?: InputBaseProps<'input'>['color']
    prefix?: InputBaseProps<'input'>['prefix']
    suffix?: InputBaseProps<'input'>['suffix']
    onClear?: InputBaseProps<'input'>['onClear']
}

export interface TreeSelectSingleProps<N extends NodeType<V>, V extends Id = Id> extends TreeSelectOwnProps<N, V>, SelectBaseSingleProps<V> {
}

export interface TreeSelectMultipleProps<N extends NodeType<V>, V extends Id = Id> extends TreeSelectOwnProps<N, V>, SelectBaseMultipleProps<V> {
}

export type TreeSelectProps<N extends NodeType<V>, V extends Id = Id> = TreeSelectSingleProps<N, V> | TreeSelectMultipleProps<N, V>

export const TreeSelect = memo(({
    inputProps,
    popperProps,
    popperRef,

    defaultOpen = false,
    open,
    onOpenChange,

    sizeAdaptable = true,

    searchable,
    defaultSearchValue = '',
    searchValue,
    onSearchChange,
    searchInputProps,

    options,
    nodes,
    children,

    // 从SelectableProps继承
    multiple = false,
    defaultValue,
    value,
    onChange,
    renderBackfill,

    // 以下属性转发至<InputBase/>
    inputBaseProps,
    variant = 'outlined',
    size = 'medium',
    shape = 'square',
    color = 'primary',
    prefix,
    suffix,
    placeholder = '请选择',
    disabled,
    readOnly,
    autoFocus,
    clearable = multiple,
    onClear,
    loading = false,

    ...treeProps
}: TreeSelectProps<any>) => {
    treeProps.labelKey ??= 'label'
    treeProps.primaryKey ??= 'value'
    treeProps.childrenKey ??= 'children'

    const actualOptions = useMemo(() => {
        if (options) {
            return options
        }
        if (nodes) {
            return nodes
        }
        const fn = (arr?: ReactNode[]): any[] | undefined => {
            return arr?.map(node => {
                if (isValidElement(node)) {
                    const {props} = node as any
                    return {
                        ...props,
                        children: fn(Children.toArray(props.children))
                    }
                }
                return node
            })
        }
        return fn(Children.toArray(children))
    }, [options, nodes, children])

    const {
        value: innerValue,
        setValue: setInnerValue,
        toggleSelected,
        optionsMap
    } = useSelection<any, any>({
        options: actualOptions,
        primaryKey: treeProps.primaryKey,
        childrenKey: treeProps.childrenKey,
        clearable: multiple,
        multiple,
        defaultValue,
        value,
        onChange
    })

    const clearHandler = () => {
        onClear?.()
        setInnerValue(multiple ? [] : void 0)
    }

    return (
        <SelectBase
            {...{
                inputProps,
                popperProps,
                popperRef,

                defaultOpen,
                open,
                onOpenChange,

                placeholder,
                sizeAdaptable,
                disabled,
                readOnly,

                searchable,
                defaultSearchValue,
                searchValue,
                onSearchChange,
                searchInputProps,

                multiple,
                renderBackfill
            } as SelectBaseProps}
            _internalProps={{
                inputBaseProps: {
                    ...inputBaseProps,
                    variant,
                    size,
                    shape,
                    color,
                    prefix,
                    suffix,
                    disabled,
                    readOnly,
                    autoFocus,
                    clearable,
                },
                labelKey: treeProps.labelKey,
                optionsMap,
                innerValue,
                onToggleSelected: toggleSelected,
                onClear: clearHandler,
                renderPopperContent: (searchValue, toggleSelected) => {
                    return actualOptions?.length
                        ? <Tree
                            {...treeProps}
                            nodes={actualOptions}
                            searchable={false}
                            searchValue={searchValue}
                            value={innerValue}
                            onToggle={(checked, value) => toggleSelected(value)}

                            multiple={multiple}
                            disabled={disabled}
                            readOnly={readOnly}
                        />
                        : <Placeholder/>
                }
            }}
        />
    )
}) as any as {
    <N extends NodeType<V>, V extends Id = Id>(props: TreeSelectProps<N, V>): ReactElement
    Option: typeof TreeNode
    Node: typeof TreeNode
}

TreeSelect.Option = TreeSelect.Node = TreeNode