import {ElementType} from 'react'
import {cloneRef, clsx} from '../../utils'
import {Id, OverridableComponent, OverridableProps} from '../../types'
import {classes} from './sortableItem.style'
import {useSortable, UseSortableInput} from '@dnd-kit/react/sortable'

export type SortableItemOwnProps = {
    id: Id
    index: number
    disabled?: boolean
    sortableArguments?: UseSortableInput
    noStyle?: boolean
}

export type SortableItemProps<C extends ElementType = 'div'> = OverridableProps<SortableItemOwnProps, C>

export const SortableItem = (
    ({
        component: Component = 'div',
        id,
        index,
        disabled,
        sortableArguments,
        noStyle,
        ...props
    }: SortableItemProps) => {
        const {ref} = useSortable({
            ...sortableArguments,
            id,
            index,
            disabled
        })

        return (
            <Component
                {...props}
                ref={cloneRef(ref, props.ref)}
                className={clsx(classes.root, props.className)}
                data-no-style={noStyle}
                data-draggable={!disabled}
            />
        )
    }
) as OverridableComponent<SortableItemOwnProps>