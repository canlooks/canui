import {DragEndEvent, PointerSensor, useSensor, useSensors} from '@dnd-kit/core'
import {arrayMove} from '@dnd-kit/sortable'
import {Obj} from '../types'

/**
 * 默认提供给@dnd-kit的sensors属性
 */
export function useDndSensors() {
    return useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        })
    )
}

/**
 * <DndContext>组件通用的onDragEnd方法
 * @param e
 * @param prevState 传入需要排序的数组
 * @param primaryKey 索引用的主键
 */
export function onDndDragEnd<S extends Obj>(e: DragEndEvent, prevState: S[], primaryKey = 'id'): S[] | undefined {
    const {active, over} = e
    if (!over || active.id === over.id) {
        // 并未产生顺序的改变，返回undefined
        return
    }
    const oldIndex = prevState!.findIndex(v => v[primaryKey] === active.id)
    const newIndex = prevState!.findIndex(v => v[primaryKey] === over.id)
    return arrayMove(prevState!, oldIndex, newIndex)
}