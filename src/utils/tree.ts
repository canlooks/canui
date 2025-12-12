import {useCallback, useDeferredValue, useMemo} from 'react'
import {Id, Obj} from '../types'
import {useControlled, useSync} from './hooks'
import {NodeType, SortInfo} from '../components/tree'

/**
 * ------------------------------------------------------------------------
 * 统一处理树形搜索
 */

export type UseTreeSearchParams<N extends Obj, V extends Id = Id> = {
    nodes?: N[]
    primaryKey?: keyof N
    labelKey?: keyof N
    childrenKey?: keyof N
    searchTokenKey?: keyof N
    defaultExpanded?: V[]
    expanded?: V[]
    onExpandedChange?(expanded: V[], nodeValue: V, isExpand: boolean): void
    defaultSearchValue?: string
    searchValue?: string
    onSearchChange?(searchValue: string): void
}

export function useTreeSearch<N extends Obj, V extends Id = Id>({
    nodes,
    primaryKey = 'id',
    labelKey = 'label',
    childrenKey = 'children',
    searchTokenKey = 'searchToken',
    defaultExpanded = [],
    expanded,
    onExpandedChange,
    defaultSearchValue = '',
    searchValue,
    onSearchChange
}: UseTreeSearchParams<N, V>) {
    const [innerExpanded, setInnerExpanded] = useControlled(defaultExpanded, expanded)

    const expandedSet = useMemo(() => {
        return new Set(innerExpanded.current)
    }, [innerExpanded.current])

    const sync = useSync({expandedSet, onExpandedChange})

    const toggleExpanded = useCallback((value: V) => {
        const {expandedSet, onExpandedChange} = sync.current
        const currentExpanded = expandedSet.has(value)
        setInnerExpanded(o => {
            const newExpanded = currentExpanded
                ? o.filter(v => v !== value)
                : [...o, value]
            onExpandedChange?.(newExpanded, value, !currentExpanded)
            return newExpanded
        })
    }, [])

    const [innerSearchValue, setInnerSearchValue] = useControlled(defaultSearchValue, searchValue, onSearchChange)
    const deferredSearchValue = useDeferredValue(innerSearchValue.current.trim())

    const filteredTreeData = useMemo(() => {
        if (!deferredSearchValue) {
            return nodes
        }
        const newExpanded: V[] = []
        const split = deferredSearchValue.split(' ')
        const fn = (arr?: N[]): N[] | undefined => {
            return arr?.flatMap(item => {
                const children = fn(item[childrenKey])
                if (children?.length) {
                    newExpanded.push(item[primaryKey])
                    return [{...item, children}]
                }
                if (item && typeof item === 'object') {
                    const searchToken = typeof item[labelKey] === 'string' ? item[labelKey] : item[searchTokenKey]
                    if (
                        typeof searchToken === 'string' &&
                        split.some(k => {
                            return k && searchToken.toLowerCase().includes(k.toLowerCase())
                        })
                    ) {
                        children?.length && newExpanded.push(item[primaryKey])
                        return [{...item, children}]
                    }
                }
                return []
            })
        }
        setInnerExpanded(newExpanded)
        return fn(nodes)
    }, [nodes, deferredSearchValue, primaryKey, labelKey, searchTokenKey, childrenKey])

    return {
        expandedSet,
        setInnerExpanded,
        toggleExpanded,
        innerSearchValue,
        deferredSearchValue,
        setInnerSearchValue,
        filteredTreeData
    }
}

/**
 * 得到排序后的树结构
 */
export function sortTreeNodes<N extends NodeType<V>, V extends Id = Id>(props: {
    nodes: N[]
    primaryKey?: keyof N
    childrenKey?: keyof N
}, sortInfo: SortInfo<V>): N[] {
    let {nodes, primaryKey = 'id', childrenKey = 'children'} = props
    const {source, destination, placement} = sortInfo

    nodes = structuredClone(nodes)

    const pickUp = (nodes?: N[]): N | null => {
        if (!nodes?.length) {
            return null
        }
        for (let i = 0, {length} = nodes; i < length; i++) {
            const node = nodes[i]
            if (node[primaryKey] === source) {
                nodes.splice(i, 1)
                return node
            }
            const foundInChildren = pickUp(node[childrenKey])
            if (foundInChildren) {
                return foundInChildren
            }
        }
        return null
    }
    pickUp(nodes)

    const putDown = (nodes?: N[]) => {
        if (!nodes?.length) {
            return false
        }
        for (let i = 0, {length} = nodes; i < length; i++) {
            const node = nodes[i]
            if (node[primaryKey] === destination) {
                switch (placement) {
                    case 'before':
                        nodes.splice(i, 0, node)
                        return true
                    case 'after':
                        nodes.splice(i + 1, 0, node)
                        return true
                    default:
                        node.children ||= []
                        node.children.push(node)
                        return true
                }
            }
            const foundInChildren = pickUp(node[childrenKey])
            if (foundInChildren) {
                return foundInChildren
            }
        }
        return false
    }
    putDown(nodes)

    return nodes
}