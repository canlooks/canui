import {ReactElement} from 'react'
import {CheckboxBase, CheckboxBaseProps} from '../checkboxBase'
import {CheckboxBaseGroup, CheckboxBaseGroupCommonProps, ItemType} from '../checkboxBaseGroup'
import {Id, SelectableSingleProps} from '../../types'

export interface RadioProps extends Omit<CheckboxBaseProps, '_type' | 'indeterminate'> {
}

export const Radio = ((props: RadioProps) => {
    return <CheckboxBase {...props} _type="radio"/>
}) as {
    (props: RadioProps): ReactElement
    Group: typeof RadioGroup
}

export interface RadioGroupProps<I extends ItemType, V extends Id = Id> extends CheckboxBaseGroupCommonProps<I>, Omit<SelectableSingleProps<V>, 'multiple'> {
}

export const RadioGroup = (<I extends ItemType, V extends Id = Id>(props: RadioGroupProps<I, V>) => {
    return <CheckboxBaseGroup {...props}/>
}) as <I extends ItemType, V extends Id = Id>(props: RadioGroupProps<I, V>) => ReactElement

Radio.Group = RadioGroup