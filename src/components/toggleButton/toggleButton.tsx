import {Children, ReactElement, cloneElement, isValidElement} from 'react'
import {Flex, FlexProps} from '../flex'
import {clsx, isSelected} from '../../utils'
import {classes, style} from './toggleButton.style'
import {Button, ButtonProps} from '../button'
import {Id, Obj, SelectableProps} from '../../types'
import {useFlatSelection} from '../selectionContext'

type ButtonItem = ButtonProps & Obj

export interface ToggleButtonBaseProps<I extends ButtonItem> extends Omit<FlexProps, 'defaultValue' | 'onChange'> {
    variant?: 'filled' | 'outlined'
    size?: ButtonProps['size']
    color?: ButtonProps['color']
    disabled?: boolean
    readOnly?: boolean
    items?: I[]
    primaryKey?: keyof I
}

export type ToggleButtonProps<I extends ButtonItem, V extends Id = Id> = SelectableProps<V> & ToggleButtonBaseProps<I>

export const ToggleButton = (<I extends ButtonItem, V extends Id = Id>({
    variant = 'filled',
    size,
    color = 'primary',
    disabled,
    readOnly,
    items,
    primaryKey = 'value',

    multiple,
    defaultValue,
    value,
    onChange,
    ...props
}: ToggleButtonProps<I, V>) => {
    const [innerValue, toggleSelected] = useFlatSelection<any>({
        disabled: disabled ?? readOnly,
        multiple,
        defaultValue,
        value,
        onChange
    })

    const renderItems = () => {
        const makeProps = (p: I, value: I[keyof I], selected: boolean): ButtonProps => ({
            size: p.size ?? size,
            readOnly: p.readOnly ?? readOnly,
            disabled: p.disabled ?? disabled,
            variant: selected ? variant : 'outlined',
            color: selected ? color : 'text',
            onClick(e) {
                p.onClick?.(e)
                toggleSelected(value)
            },
            style: {
                borderLeftColor: selected ? 'inherit' : void 0,
                ...p.style
            }
        })
        if (items) {
            return items.map((p, i) => {
                const itemValue = p[primaryKey]
                return (
                    <Button
                        {...p}
                        key={itemValue ?? i}
                        {...makeProps(p, itemValue, isSelected(itemValue, innerValue))}
                    >
                        {p.children}
                    </Button>
                )
            })
        }
        return Children.map(props.children, c => {
            if (isValidElement(c)) {
                const {props} = c as ReactElement<I>
                return cloneElement(
                    c,
                    makeProps(props, props.value as any, isSelected(props.value, innerValue))
                )
            }
            return c
        })
    }

    return (
        <Flex
            compact
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            {renderItems()}
        </Flex>
    )
}) as <I extends ButtonItem, V extends Id = Id>(props: ToggleButtonProps<I, V>) => ReactElement