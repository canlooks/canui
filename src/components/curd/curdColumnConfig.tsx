import {Dispatch, ReactElement, SetStateAction, memo, useMemo} from 'react'
import {Button} from '../button'
import {Bubble} from '../bubble'
import {classes, style} from './curdColumnConfig.style'
import {CurdColumn} from './curd'
import {RowType} from '../dataGrid'
import {MenuItem} from '../menuItem'
import {Checkbox} from '../checkbox'
import {SortableItem} from '../sortableItem'
import {DndContext, DragEndEvent} from '@dnd-kit/core'
import {SortableContext} from '@dnd-kit/sortable'
import {isUnset, onDndDragEnd, useDndSensors} from '../../utils'
import {Icon} from '../icon'
import {faGear} from '@fortawesome/free-solid-svg-icons/faGear'
import {Id} from '../../types'

export type CurdColumnConfigProps<R extends RowType> = {
    columns?: CurdColumn<R>[]
    innerVisible: Id[]
    setInnerVisible: Dispatch<SetStateAction<Id[]>>
    setInnerOrder: Dispatch<SetStateAction<Id[]>>
}

export const CurdColumnConfig = memo(<R extends RowType>({
    columns,
    innerVisible,
    setInnerVisible,
    setInnerOrder
}: CurdColumnConfigProps<R>) => {
    columns ||= []

    const dragEndHandler = (e: DragEndEvent) => {
        const newColumns = onDndDragEnd(e, columns, '_key')
        newColumns && setInnerOrder(
            newColumns.flatMap(col => col._key ?? [])
        )
    }

    const visibleSet = useMemo(() => {
        return new Set(innerVisible)
    }, [innerVisible])

    const toggleVisible = (key: Id | undefined, checked: boolean) => {
        !isUnset(key) && setInnerVisible(o => checked
            ? [...o, key]
            : o.filter(k => k !== key)
        )
    }

    return (
        <Bubble
            css={style}
            placement="bottomRight"
            content={
                <DndContext sensors={useDndSensors()} onDragEnd={dragEndHandler}>
                    <SortableContext items={columns?.map((col, i) => col._key ?? i)}>
                        <div className={classes.content}>
                            <div className={classes.title}>
                                <div className={classes.titleText}>列设置</div>
                                <div className={classes.description}>拖拽调整顺序</div>
                            </div>
                            {columns?.map((col, i) => {
                                const id = col._key
                                const checked = !isUnset(id) && visibleSet.has(id)

                                return (
                                    <SortableItem
                                        id={id ?? i}
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
                    </SortableContext>
                </DndContext>
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
}) as <R extends RowType>(props: CurdColumnConfigProps<R>) => ReactElement