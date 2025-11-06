import {createContext, Dispatch, memo, ReactNode, RefObject, SetStateAction, useContext, useRef, useState} from 'react'
import {Id} from '../../types'
import {SortPlacement, TreeBaseProps} from './tree'
import {treeDndClasses} from './treeDnd.style'

type TreeDndContextItem<T> = [T | undefined, Dispatch<SetStateAction<T | undefined>>]

type ITreeDndContext = {
    sortable: boolean
    showDragHandle: boolean
    dragging: TreeDndContextItem<Id>
    overing: RefObject<Id | undefined>
    placement: RefObject<SortPlacement | undefined>
    onSort: TreeBaseProps<any>['onSort']
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
    const dragging = useState<Id | undefined>(void 0)
    const overing = useRef<Id | undefined>(void 0)
    const placement = useRef<SortPlacement | undefined>(void 0)

    return (
        <TreeDndContext value={{
            sortable, showDragHandle, onSort,
            dragging, overing, placement
        }}>
            <div className={treeDndClasses.levelBlock}>{children}</div>
        </TreeDndContext>
    )
})