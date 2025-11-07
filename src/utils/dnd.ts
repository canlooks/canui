import {DragEndEvent, PointerSensor, useSensor, useSensors} from '@dnd-kit/core'
import {arrayMove} from '@dnd-kit/sortable'
import {Id, Obj} from '../types'
import {NodeType, SortInfo} from '../components/tree'

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
 * @param e 事件
 * @param prevState 传入需要排序的数组
 * @param primaryKey 索引用的主键，默认为`id`
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

/**
 * <Tree>组件通用的onSort方法，注意：该方法会原地修改{@link treeNodes}
 * @param info 信息
 * @param treeNodes 树节点
 * @param primaryKey 索引用的主键，默认为`id`
 */
export function onTreeNodeSort<N extends NodeType<V>, V extends Id = Id>(info: SortInfo<V>, treeNodes: N[], primaryKey = 'id'): N[] {
    const find = (arr: N[], id: Id): {
        target: N
        targetIndex: number
        siblings: N[]
    } | null => {
        let target: N | null = null
        let targetIndex = -1
        let siblings: N[] | null = null

        const recurse = (arr?: N[]): boolean => {
            return !!arr?.some((v, i, _siblings) => {
                if (v[primaryKey] === id) {
                    target = v
                    targetIndex = i
                    siblings = _siblings
                    return true
                }
                return v.children?.length && recurse(v.children as N[])
            })
        }
        recurse(arr)

        return target ? {target, targetIndex, siblings: siblings!} : null
    }

    const source = find(treeNodes, info.source)!
    source.siblings.splice(source.targetIndex, 1)
    const destination = find(treeNodes, info.destination)!

    switch (info.placement) {
        case 'before':
            destination.siblings.splice(destination.targetIndex, 0, source.target)
            break
        case 'after':
            destination.siblings.splice(destination.targetIndex + 1, 0, source.target)
            break
        default:
            // children
            destination.target.children ||= []
            destination.target.children.push(source.target)
    }

    return treeNodes
}