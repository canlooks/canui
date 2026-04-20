import {Dispatch, ReactElement, SetStateAction, memo, useMemo, useState, useRef} from 'react'
import {Button} from '../button'
import {Bubble, BubbleProps} from '../bubble'
import {classes, style} from './curdColumnConfig.style'
import {CurdColumn} from './curd'
import {RowType} from '../dataGrid'
import {MenuItem} from '../menuItem'
import {Checkbox} from '../checkbox'
import {SortableItem} from '../sortableItem'
import {defaultSensors, isUnset, onDndDragEnd} from '../../utils'
import {Icon} from '../icon'
import {faGear} from '@fortawesome/free-solid-svg-icons/faGear'
import {Id} from '../../types'
import {DragDropProvider, useDragDropMonitor} from '@dnd-kit/react'
import {DragDropEvents} from '@dnd-kit/abstract'

export type CurdColumnConfigProps<R extends RowType> = {
    columns: CurdColumn<R>[] | undefined
    innerVisible: Id[] | undefined
    setInnerVisible: Dispatch<SetStateAction<Id[] | undefined>>
    setInnerOrder: Dispatch<SetStateAction<Id[] | undefined>>
    columnConfigBubbleProps?: BubbleProps
}

export const CurdColumnConfig = memo(<R extends RowType>(props: CurdColumnConfigProps<R>) => {
    const dragEndHandler: DragDropEvents<any, any, any>['dragend'] = e => {
        const newColumns = onDndDragEnd(e, props.columns || [], '_key')
        newColumns && props.setInnerOrder(
            newColumns.flatMap(col => col._key ?? [])
        )
    }

    return (
        <DragDropProvider sensors={defaultSensors} onDragEnd={dragEndHandler}>
            <CurdColumnConfigContent {...props}/>
        </DragDropProvider>
    )
}) as <R extends RowType>(props: CurdColumnConfigProps<R>) => ReactElement

const CurdColumnConfigContent = memo(({
    columns,
    innerVisible,
    setInnerVisible,
    columnConfigBubbleProps
}: CurdColumnConfigProps<any>) => {
    const isDragging = useRef(false)

    useDragDropMonitor({
        onDragStart: () => isDragging.current = true,
        onDragEnd: () => isDragging.current = false
    })

    const [open, setOpen] = useState(false)

    const openChangeHandler = (open: boolean) => {
        columnConfigBubbleProps?.onOpenChange?.(open)
        if (open || !isDragging.current) {
            setOpen(open)
        }
    }

    const visibleSet = useMemo(() => {
        return innerVisible && new Set(innerVisible)
    }, [innerVisible])

    const toggleVisible = (key: Id | undefined, checked: boolean) => {
        !isUnset(key) && setInnerVisible((o = []) => checked
            ? [...o, key]
            : o.filter(k => k !== key)
        )
    }

    return (
        <Bubble
            placement="bottomRight"
            trigger={['hover', 'click']}
            {...columnConfigBubbleProps}
            css={style}
            open={open}
            onOpenChange={openChangeHandler}
            content={
                <div className={classes.content}>
                    <div className={classes.title}>
                        <div className={classes.titleText}>列设置</div>
                        <div className={classes.description}>拖拽调整顺序</div>
                    </div>
                    {columns?.map((col, i) => {
                        const id = col._key
                        const checked = !isUnset(id) && (!visibleSet || visibleSet.has(id))

                        return (
                            <SortableItem
                                id={id ?? i}
                                index={i}
                                component={MenuItem}
                                key={id ?? i}
                                className={classes.item}
                                prefix={
                                    <Checkbox
                                        className={classes.checkbox}
                                        checked={checked}
                                        onChange={e => {
                                            e.stopPropagation()
                                            toggleVisible(id, e.target.checked)
                                        }}
                                    />
                                }
                                onClick={() => toggleVisible(id, !checked)}
                                label={col.titleText ?? col.title}
                                noStyle
                            />
                        )
                    })}
                </div>
            }
            autoClose={false}
        >
            <Button
                shape="circular"
                variant="text"
                color="text.secondary"
            >
                <Icon icon={faGear}/>
            </Button>
        </Bubble>
    )
})