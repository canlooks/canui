import {createContext, Dispatch, memo, ReactNode, RefObject, SetStateAction, useContext, useEffect, useRef, useState} from 'react'
import {Id} from '../../types'
import {useSyncState} from '../../utils'
import {SortPlacement, TreeBaseProps} from './tree'
import {classes} from './tree.style'

type TreeDndContextItem<T> = [T | undefined, Dispatch<SetStateAction<T | undefined>>]

type ITreeDndContext = {
    sortable: boolean
    showDragHandle: boolean
    containerRef: RefObject<HTMLDivElement | null>
    isOffsetSatisfied: [boolean, Dispatch<SetStateAction<boolean>>]
    dragging: TreeDndContextItem<Id>
    overing: TreeDndContextItem<Id>
    placement: [RefObject<SortPlacement | undefined>, Dispatch<SetStateAction<SortPlacement | undefined>>]
    onSort: TreeBaseProps<any>['onSort']
    overingTimer: RefObject<any>
}

export const TreeDndContext = createContext({} as ITreeDndContext)

export function useTreeDndContext() {
    return useContext(TreeDndContext)
}

export const TreeDnd = memo(({
    sortable,
    showDragHandle,
    onSort,
    containerRef,
    children
}: {
    sortable: boolean
    showDragHandle: boolean
    onSort: TreeBaseProps<any>['onSort']
    containerRef: RefObject<HTMLDivElement | null>
    children: ReactNode
}) => {
    const isOffsetSatisfied = useState(false)
    const dragging = useState<Id | undefined>(void 0)
    const overing = useState<Id | undefined>(void 0)
    const placement = useSyncState<SortPlacement | undefined>(void 0)

    useEffect(() => {
        if (dragging[0]) {
            document.documentElement.style.cursor = 'grabbing'
        }
        return () => {
            document.documentElement.style.cursor = ''
        }
    }, [dragging[0]])

    const overingTimer = useRef<any>(void 0)

    return (
        <TreeDndContext value={{
            sortable, showDragHandle, onSort, containerRef,
            isOffsetSatisfied, dragging, overing, placement,
            overingTimer
        }}>
            <div className={classes.container} data-dragging={!!dragging[0]}>
                {children}
            </div>
        </TreeDndContext>
    )
})