import {ReactElement} from 'react'
import {CheckboxBase, CheckboxBaseProps} from '../checkboxBase'
import {CheckboxBaseGroup, CheckboxBaseGroupCommonProps, ItemType} from '../checkboxBaseGroup'
import {Id, SelectableMultipleProps} from '../../types'

export interface CheckboxProps extends Omit<CheckboxBaseProps, '_type'> {}

export const Checkbox = ((props: CheckboxProps) => {
    return <CheckboxBase {...props} _type="checkbox" />
}) as {
    (props: CheckboxProps): ReactElement
    Group: typeof CheckboxGroup
}

export interface CheckboxGroupProps<I extends ItemType, V extends Id = Id> extends CheckboxBaseGroupCommonProps<I>, Omit<SelectableMultipleProps<V>, 'multiple'> {}

export const CheckboxGroup = (<I extends ItemType, V extends Id = Id>(props: CheckboxGroupProps<I, V>) => {
    return <CheckboxBaseGroup {...props} multiple />
}) as <I extends ItemType, V extends Id = Id>(props: CheckboxGroupProps<I, V>) => ReactElement

Checkbox.Group = CheckboxGroup