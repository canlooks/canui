import {Children, ReactElement, cloneElement, createContext, isValidElement, useContext, useMemo} from 'react'
import {Flex, FlexProps} from '../flex'
import {CheckboxBaseProps} from '../checkboxBase'
import {ColorPropsValue, Id, Obj, SelectableProps, Size} from '../../types'
import {clsx, isSelected} from '../../utils'
import {classes} from './checkboxBaseGroup.style'
import {Checkbox} from '../checkbox'
import {Radio} from '../radio'
import {useTheme} from '../theme'
import {useFlatSelection} from '../selectionContext'

export interface ItemType extends Omit<CheckboxBaseProps, '_type'>, Obj {
}

export interface CheckboxBaseGroupCommonProps<I extends ItemType> extends Omit<FlexProps, 'defaultValue' | 'onChange'> {
    size?: CheckboxBaseProps['size']
    color?: CheckboxBaseProps['color']
    items?: I[]
    primaryKey?: keyof I
}

export type CheckboxBaseGroupProps<I extends ItemType, V extends Id = Id> = CheckboxBaseGroupCommonProps<I> & SelectableProps<V>

const CheckboxBaseGroupContext = createContext<{
    size?: Size
    color?: ColorPropsValue
}>({})

export function useCheckboxBaseGroupContext() {
    return useContext(CheckboxBaseGroupContext)
}

export const CheckboxBaseGroup = (<I extends ItemType, V extends Id = Id>({
    size,
    color,
    items,
    primaryKey = 'value',

    multiple,
    defaultValue,
    value,
    onChange,
    ...props
}: CheckboxBaseGroupProps<I, V>) => {
    const {spacing} = useTheme()

    const [innerValue, toggleSelected] = useFlatSelection<any>({multiple, defaultValue, value, onChange})

    const renderItems = () => {
        if (items) {
            return items.map((p, i) => {
                const Component = multiple ? Checkbox : Radio
                const itemValue = p[primaryKey]
                return (
                    <Component
                        size={size}
                        color={color}
                        {...p}
                        key={p.key ?? itemValue ?? i}
                        checked={isSelected(itemValue, innerValue)}
                        onChange={e => {
                            p.onChange?.(e)
                            toggleSelected(itemValue)
                        }}
                    />
                )
            })
        }
        return Children.map(props.children, c => {
            if (!isValidElement(c)) {
                return c
            }
            const {props} = c as ReactElement<I>
            const itemValue = props.value
            return cloneElement(c, {
                size: props.size ?? size,
                color: props.color ?? color,
                checked: isSelected(itemValue, innerValue),
                onChange: e => {
                    props.onChange?.(e)
                    toggleSelected(itemValue)
                }
            } as Omit<CheckboxBaseProps, '_type'>)
        })
    }

    return (
        <Flex
            gap={spacing[8]}
            {...props}
            className={clsx(classes.root, props.className)}
        >
            <CheckboxBaseGroupContext value={
                useMemo(() => ({size, color}), [size, color])
            }>
                {renderItems()}
            </CheckboxBaseGroupContext>
        </Flex>
    )
}) as <I extends ItemType, V extends Id = Id>(props: CheckboxBaseGroupProps<I, V>) => ReactElement