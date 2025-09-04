import {ThCell, ThCellProps} from '../table'
import {ComponentType, createContext, ReactNode, RefObject, useContext, useRef} from 'react'
import {classes} from './dataGrid.style'
import {cloneRef, useDraggable} from '../../utils'

const ColumnResizeContextProvider = createContext({
    columnResizable: false,
    columnRefs: {current: [] as HTMLTableCellElement[]},
    scrollToEnd() {
    }
})

export function ColumnResizeContext({
    columnResizable,
    children
}: {
    columnResizable: boolean
    children(ref: {
        scrollerRef: RefObject<HTMLDivElement | null>
        tableRef: RefObject<HTMLTableElement | null>
    }): ReactNode
}) {
    const scrollerRef = useRef<HTMLDivElement>(null)
    const tableRef = useRef<HTMLTableElement>(null)
    const columnRefs = useRef<HTMLTableCellElement[]>([])

    const scrollToEnd = () => {
        scrollerRef.current!.scrollLeft = scrollerRef.current!.scrollWidth
    }

    return (
        <ColumnResizeContextProvider value={{columnResizable, columnRefs, scrollToEnd}}>
            {children({scrollerRef, tableRef})}
        </ColumnResizeContextProvider>
    )
}

export function useRenderHead<T extends ReactNode>(render: (Column: ComponentType<ThCellProps>) => T): T {
    const {columnRefs} = useContext(ColumnResizeContextProvider)
    columnRefs.current = []

    return render(ResizableColumn)
}

function ResizableColumn(props: ThCellProps) {
    const {columnResizable, columnRefs, scrollToEnd} = useContext(ColumnResizeContextProvider)

    const cellRef = useRef<HTMLTableCellElement>(null)

    const findNext = () => {
        const index = columnRefs.current.indexOf(cellRef.current!)
        let next = columnRefs.current[index + 1]
        if (next?.classList.contains(classes.selectable)) {
            next = columnRefs.current[index + 2]
        }
        return next
    }

    const draggableHandles = useDraggable({
        onDragStart(e) {
            const next = findNext()
            return {
                startX: e.clientX,
                selfStartWidth: cellRef.current!.offsetWidth,
                nextStartWidth: next?.offsetWidth
            }
        },
        onDrag({diff: [dx, dy], data: {selfStartWidth, nextStartWidth}}) {
            const next = findNext()
            cellRef.current!.style.width = selfStartWidth + dx + 'px'
            if (next) {
                next.style.width = nextStartWidth! - dy + 'px'
            } else {
                scrollToEnd()
            }
        }
    })

    if (!columnResizable) {
        return <ThCell {...props}/>
    }

    return (
        <ThCell
            {...props}
            ref={cloneRef(r => {
                if (r) {
                    columnRefs.current.push(r)
                    cellRef.current = r
                }
            }, props.ref)}
        >
            {props.children}
            <div className={classes.resizeHandle} {...draggableHandles}/>
        </ThCell>
    )
}