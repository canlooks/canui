import React, {ElementType, useCallback, useEffect, useRef} from 'react'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {cloneRef, useSync} from '../../utils'
import {Arguments} from '@dnd-kit/sortable/dist/hooks/useSortable'
import {OverridableComponent, OverridableProps} from '../../types'

export type SortableItemOwnProps = {
    id: string | number
    disabled?: boolean
    sortableArguments?: Arguments
}

export type SortableItemProps<C extends ElementType = 'div'> = OverridableProps<SortableItemOwnProps, C>

export const SortableItem = (
    ({
        component: Component = 'div',
        id,
        disabled,
        sortableArguments,
        ...props
    }: SortableItemProps) => {
        const {attributes, isDragging, listeners, setNodeRef, transform, transition} = useSortable({
            ...sortableArguments,
            disabled,
            id
        })

        const preventDefaultCallback = useRef<(e: TouchEvent) => void>(void 0)

        const removeListener = () => {
            if (preventDefaultCallback.current) {
                removeEventListener('touchmove', preventDefaultCallback.current)
                preventDefaultCallback.current = void 0
            }
            removeEventListener('pointerup', onPointerUp)
        }

        const onPointerUp = useCallback(removeListener, [])

        const syncOnTouchStart = useSync(props.onTouchStart)

        const onTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
            syncOnTouchStart.current?.(e)
            addEventListener('touchmove', preventDefaultCallback.current = e => {
                e.cancelable && e.preventDefault()
            }, {passive: false})
            addEventListener('pointerup', onPointerUp)
        }, [])

        useEffect(() => removeListener, [])

        return (
            <Component
                {...attributes}
                {...listeners}
                {...props}
                ref={cloneRef(setNodeRef, props.ref)}
                style={{
                    transform: CSS.Transform.toString(transform),
                    transition,
                    ...props.style
                }}
                onTouchStart={disabled ? void 0 : onTouchStart}
                data-dragging={isDragging}
            />
        )
    }
) as OverridableComponent<SortableItemOwnProps>