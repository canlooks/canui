import {Id, Obj} from '../types'
import {NodeType, SortInfo} from '../components/tree'
import {range} from './utils'
import {BezierFunc, cubicBezier} from './bezier'
import {Customizable, DragDropEvents, Sensors} from '@dnd-kit/abstract'
import {PointerSensor} from '@dnd-kit/react'
import {PointerActivationConstraints} from '@dnd-kit/dom'

/**
 * 默认提供给@dnd-kit<DragDropProvider/>的sensors属性
 */
export const defaultSensors: Customizable<Sensors> = defaults => [
    ...defaults,
    PointerSensor.configure({
        activationConstraints: [
            new PointerActivationConstraints.Distance({value: 5})
        ]
    })
]

/**
 * <DragDropProvider>组件通用的onDragEnd方法
 * @param e 事件
 * @param items 传入需要排序的数组
 * @param primaryKey 索引用的主键，默认为`id`
 * @return 返回新的数组，但如果顺序未改变，会得到null
 */
export function onDndDragEnd<T extends Obj>({operation}: Parameters<DragDropEvents<any, any, any>['dragend']>[0], items: T[], primaryKey: keyof T = 'id'): T[] | null {
    const {source, target, canceled} = operation
    if (!source || !target || canceled) {
        return null
    }
    const sourceIndex = items.findIndex(item => item[primaryKey] === source.id)
    const targetIndex = items.findIndex(item => item[primaryKey] === target.id)

    if (sourceIndex === -1 || targetIndex === -1) {
        if (typeof source.initialIndex === 'number' && typeof source.index === 'number') {
            const from = source.initialIndex
            const to = source.index
            if (from === to || from < 0 || from >= items.length) {
                return null
            }
            return arrayMove(items, from, to)
        }
        return null
    }

    if (typeof source.index === 'number') {
        if (source.index !== sourceIndex) {
            return arrayMove(items, sourceIndex, source.index)
        }
    }

    return arrayMove(items, sourceIndex, targetIndex)
}

export function arrayMove<T>(array: T[], from: number, to: number) {
    if (from === to) {
        return array
    }
    const newArray = [...array]
    newArray.splice(to, 0, newArray.splice(from, 1)[0])
    return newArray
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

export function edgeBounce(value: number, {
    allowEdgeBounce,
    min,
    max,
    bounceElementTranslate,
    bounceDragDistance,
    bezierFn = cubicBezier(0, 0, 0, 1)
}: {
    allowEdgeBounce: boolean
    min: number
    max: number
    bounceElementTranslate: number
    bounceDragDistance: number
    bezierFn?: BezierFunc
}) {
    if (allowEdgeBounce && bounceElementTranslate && bounceDragDistance > 0) {
        value = range(value, min - bounceDragDistance, max + bounceDragDistance)

        if (value < min) {
            value = min - bezierFn((min - value) / bounceDragDistance) * bounceElementTranslate
        } else if (value > max) {
            value = max + bezierFn((value - max) / bounceDragDistance) * bounceElementTranslate
        }

        return value
    }

    return range(value, min, max)
}