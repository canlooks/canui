import {Children, isValidElement, memo, ReactElement, ReactNode, useMemo} from 'react'
import {NodeType, Tree, TreeNode, TreeProps, TreeSharedProps} from '../tree'
import {Id} from '../../types'
import {SelectBase, SelectBaseMultipleProps, SelectBaseOwnProps, SelectBaseSingleProps} from '../selectBase'
import {useSelection} from '../selectionContext'
import {Placeholder} from '../placeholder'

export interface TreeSelectOwnProps<N extends NodeType<V>, V extends Id = Id> extends SelectBaseOwnProps, TreeSharedProps<N, V> {
    options?: N[]
    treeProps?: TreeProps<N, V>
}

export interface TreeSelectSingleProps<N extends NodeType<V>, V extends Id = Id> extends TreeSelectOwnProps<N, V>, SelectBaseSingleProps<V> {
}

export interface TreeSelectMultipleProps<N extends NodeType<V>, V extends Id = Id> extends TreeSelectOwnProps<N, V>, SelectBaseMultipleProps<V> {
}

export type TreeSelectProps<N extends NodeType<V>, V extends Id = Id> = TreeSelectSingleProps<N, V> | TreeSelectMultipleProps<N, V>

export const TreeSelect = memo(({
    options,
    children,
    treeProps,
    // 从TreeSharedProps继承
    nodes,
    labelKey = 'label',
    searchTokenKey,
    showLine,
    indent,
    renderExpandIcon,
    showCheckbox,
    readOnly, // 同时转发至<InputBase/>, <SelectBase/>
    clickLabelToExpand,
    defaultExpanded,
    expanded,
    onExpandedChange,
    sortable,
    showDragHandle,
    onSort,

    primaryKey = 'value',
    childrenKey = 'children',
    relation = 'dependent',
    integration = 'shallowest',
    clearable, // 同时转发至<InputBase/>, <SelectBase/>
    disabled, // 同时转发至<InputBase/>, <SelectBase/>
    onToggle,

    // 从SelectableProps继承
    multiple = false, // 同时转发至<Tree/>, <SelectBase/>
    defaultValue, // 同时转发至<Tree/>
    value,
    onChange,
    renderBackfill,

    ...props
}: TreeSelectProps<any>) => {
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
        primaryKey,
        childrenKey,
        clearable: multiple,
        multiple: multiple as any,
        defaultValue,
        value,
        onChange
    })

    const onClear = () => {
        props.onClear?.()
        setInnerValue(multiple ? [] : void 0)
    }

    return (
        <SelectBase
            {...props}
            readOnly={readOnly}
            clearable={clearable}
            disabled={disabled}
            multiple={multiple}
            renderBackfill={renderBackfill}
            onClear={onClear}
            _internalProps={{
                labelKey,
                optionsMap,
                innerValue,
                onToggleSelected: toggleSelected,
                renderPopperContent: (searchValue, toggleSelected) => {
                    return actualOptions?.length
                        ? <Tree
                            {...treeProps}
                            {...{
                                nodes,
                                labelKey,
                                searchTokenKey,
                                showLine,
                                indent,
                                renderExpandIcon,
                                showCheckbox,
                                readOnly,
                                clickLabelToExpand,
                                defaultExpanded,
                                expanded,
                                onExpandedChange,
                                sortable,
                                showDragHandle,
                                onSort,

                                primaryKey,
                                childrenKey,
                                relation,
                                integration,
                                clearable,
                                disabled,
                                onToggle
                            }}
                            multiple={multiple as any}
                            nodes={actualOptions}
                            searchable={false}
                            searchValue={searchValue}
                            value={innerValue}
                            onToggle={(checked, value) => toggleSelected(value)}
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