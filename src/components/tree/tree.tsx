import {Children, ReactElement, ReactNode, createContext, isValidElement, memo, useContext, useMemo, useRef} from 'react'
import {DivProps, Id, SelectableProps} from '../../types'
import {OptionType, SelectionContext, SelectionContextBaseProps, SelectionContextProps} from '../selectionContext'
import {Input, InputProps} from '../input'
import {classes, style} from './tree.style'
import {cloneRef, clsx, useTreeSearch} from '../../utils'
import {Highlight} from '../highlight'
import {TreeNode, TreeNodeProps} from './treeNode'
import {Icon} from '../icon'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass'
import {TreeDnd} from './treeDnd'

export interface NodeType<V extends Id = Id> extends Partial<Omit<TreeNodeProps, 'children'>>, Omit<OptionType<V>, 'children'> {
    children?: NodeType<V>[]
}

export type SortPlacement = 'before' | 'after'

export type SortInfo<V extends Id = Id> = {
    source: V
    destination: V
    placement: SortPlacement | 'child'
}

export interface TreeBaseProps<N extends NodeType<V>, V extends Id = Id> extends Omit<SelectionContextBaseProps<N, V>, 'options'>,
    Omit<DivProps, 'defaultValue' | 'onChange' | 'onToggle'> {
    nodes?: N[]
    /** 默认为`label` */
    labelKey?: keyof N
    searchTokenKey?: keyof N
    showLine?: boolean
    indent?: number
    renderExpandIcon?(nodeValue: V, isExpand: boolean, expanded: V[]): ReactNode
    /** 是否显示`checkbox`选择框，`multiple`为`true`时，默认为`true`，否则默认为`false` */
    showCheckbox?: boolean
    readOnly?: boolean
    /** 为true时，点击标签也会展开节点，默认为`false`, 仅点击展开按钮才能展开节点 */
    clickLabelToExpand?: boolean

    defaultExpanded?: V[]
    expanded?: V[]
    onExpandedChange?(expanded: V[], nodeValue: V, isExpand: boolean): void

    /** 是否可以拖拽排序，默认为`false` */
    sortable?: boolean
    /** 是否显示拖拽把手，默认为`true` */
    showDragHandle?: boolean
    onSort?(info: SortInfo<V>): void

    searchable?: boolean
    searchInputProps?: InputProps
    defaultSearchValue?: string
    searchValue?: string
    onSearchChange?(searchValue: string): void
}

export type TreeProps<N extends NodeType<V>, V extends Id = Id> = TreeBaseProps<N, V> & SelectableProps<V>

type TreeContext<V extends Id = Id> = {
    expandedSet: Set<V>
    toggleExpanded(value: V): void
    indent: number
    renderExpandIcon?: TreeBaseProps<any, V>['renderExpandIcon']
    showCheckbox: boolean
    readOnly?: boolean
    disabled?: boolean
    clickLabelToExpand?: boolean
}

const TreeContext = createContext({} as TreeContext<any>)

export function useTreeContext<V extends Id = Id>(): TreeContext<V> {
    return useContext(TreeContext)
}

export const Tree = memo(<N extends NodeType<V>, V extends Id = Id>({
    nodes,
    labelKey = 'label',
    searchTokenKey,
    showLine = true,
    indent = 24,
    renderExpandIcon,
    multiple,
    showCheckbox = !!multiple,
    readOnly,
    clickLabelToExpand,

    defaultExpanded,
    expanded,
    onExpandedChange,

    sortable = false,
    showDragHandle = true,
    onSort,

    searchable,
    searchInputProps,
    defaultSearchValue,
    searchValue,
    onSearchChange,

    // 从SelectionContext继承来的属性
    primaryKey = 'id',
    childrenKey = 'children',
    relation = 'dependent',
    integration = 'shallowest',
    clearable,
    disabled,
    defaultValue,
    value,
    onChange,
    onToggle,
    ...props
}: TreeProps<N, V>) => {
    const selectionContextProps = {
        options: nodes, primaryKey, childrenKey, relation, integration,
        multiple, defaultValue, value, onChange, disabled
    } as SelectionContextProps<N, V>

    const containerRef = useRef<HTMLDivElement>(null)

    /**
     * --------------------------------------------------------------
     * 统一处理nodes与children
     */

    const actualTreeNodes = useMemo(() => {
        if (nodes) {
            return nodes
        }
        const fn = (arr?: ReactNode[]): N[] | undefined => {
            return arr?.map(node => {
                if (isValidElement(node)) {
                    const {props} = node as ReactElement<any>
                    return {
                        ...props,
                        children: fn(Children.toArray(props.children))
                    }
                }
                return node
            })
        }
        return fn(Children.toArray(props.children))
    }, [nodes, props.children])

    /**
     * ----------------------------------------------------------------
     * 搜索与展开
     */

    const {
        innerSearchValue, setInnerSearchValue, filteredTreeData, deferredSearchValue,
        expandedSet, toggleExpanded
    } = useTreeSearch({
        nodes: actualTreeNodes, primaryKey, labelKey, searchTokenKey, childrenKey,
        defaultExpanded, expanded, onExpandedChange,
        defaultSearchValue, searchValue, onSearchChange
    })

    return (
        <div
            {...props}
            ref={cloneRef(containerRef, props.ref)}
            css={style}
            className={clsx(classes.root, classes.levelBlock, props.className)}
            data-show-line={showLine}
            data-sortable={sortable}
        >
            {searchable &&
                <Input
                    className={classes.search}
                    prefix={<Icon icon={faMagnifyingGlass}/>}
                    placeholder="搜索"
                    value={innerSearchValue.current}
                    {...searchInputProps}
                    onChange={e => {
                        searchInputProps?.onChange?.(e)
                        setInnerSearchValue(e.target.value)
                    }}
                />
            }
            <SelectionContext {...selectionContextProps}>
                <TreeContext
                    value={
                        useMemo(() => ({
                            expandedSet, toggleExpanded, indent, renderExpandIcon, clickLabelToExpand,
                            showCheckbox, readOnly, disabled
                        }), [
                            expandedSet, indent, renderExpandIcon, clickLabelToExpand,
                            showCheckbox, readOnly, disabled
                        ])
                    }
                >
                    <TreeDnd
                        sortable={sortable}
                        showDragHandle={showDragHandle}
                        onSort={onSort}
                        containerRef={containerRef}
                    >
                        {useMemo(() => {
                            if (!filteredTreeData?.length) {
                                return null
                            }
                            const fn = (arr?: N[]) => {
                                return arr?.map(({_parentId, ...nodeProps}, i) => {
                                    const currentValue = nodeProps[primaryKey as any]
                                    const label = nodeProps[labelKey as any]
                                    const children = nodeProps[childrenKey as any]

                                    delete nodeProps[primaryKey as any]
                                    delete nodeProps[labelKey as any]
                                    delete nodeProps[childrenKey as any]

                                    return (
                                        <TreeNode
                                            {...nodeProps}
                                            key={currentValue}
                                            value={currentValue}
                                            label={typeof label === 'string' && deferredSearchValue
                                                ? <Highlight keywords={deferredSearchValue.split(' ')}>{label}</Highlight>
                                                : label
                                            }
                                            _isLast={i === arr.length - 1}
                                        >
                                            {fn(children)}
                                        </TreeNode>
                                    )
                                })
                            }
                            return fn(filteredTreeData)
                        }, [filteredTreeData])}
                    </TreeDnd>
                </TreeContext>
            </SelectionContext>
        </div>
    )
}) as any as {
    <N extends NodeType<V>, V extends Id = Id>(props: TreeProps<N, V>): ReactElement
    Node: typeof TreeNode
}

Tree.Node = TreeNode