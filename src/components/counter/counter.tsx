import {memo} from 'react'
import {Size} from '../../types'
import {classes, style} from './counter.style'
import {clsx, mergeComponentProps, useControlled} from '../../utils'
import {Button, ButtonProps} from '../button'
import {Input, InputProps} from '../input'
import {Flex, FlexProps} from '../flex'
import {Icon} from '../icon'
import {faMinus} from '@fortawesome/free-solid-svg-icons/faMinus'
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus'

export interface CounterProps extends Omit<FlexProps, 'defaultValue' | 'onChange'> {
    size?: Size
    min?: number
    max?: number
    step?: number
    precision?: number

    defaultValue?: number
    value?: number
    onChange?(value: number): void

    decreaseProps?: ButtonProps
    increaseProps?: ButtonProps
    inputProps?: InputProps
}

export const Counter = memo(({
    size,
    min = -Infinity,
    max = Infinity,
    step = 1,
    precision = 0,
    defaultValue = 0,
    value,
    onChange,
    decreaseProps,
    increaseProps,
    inputProps,
    ...props
}: CounterProps) => {
    const [innerValue, setInnerValue] = useControlled(defaultValue, value, onChange)

    const commonButtonProps: ButtonProps = {
        size,
        variant: 'outlined',
        color: 'text'
    }

    const clickHandler = (dir: -1 | 1) => {
        setInnerValue(
            Math.max(min, Math.min(max, innerValue.current + dir * step))
        )
    }

    return (
        <Flex
            compact
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            <Button
                disabled={innerValue.current <= min}
                {...mergeComponentProps(
                    commonButtonProps,
                    decreaseProps,
                    {
                        onClick: () => clickHandler(-1)
                    }
                )}
            >
                <Icon icon={faMinus}/>
            </Button>
            <Input
                type="number"
                widthAdaptable
                size={size}
                min={min}
                max={max}
                step={step}
                precision={precision}
                {...mergeComponentProps(
                    inputProps,
                    {
                        className: classes.input,
                        value: innerValue.current,
                        onChange: e => setInnerValue(+e.target.value)
                    }
                )}
            />
            <Button
                disabled={innerValue.current >= max}
                {...mergeComponentProps(
                    commonButtonProps,
                    increaseProps,
                    {
                        onClick: () => clickHandler(1)
                    }
                )}
            >
                <Icon icon={faPlus}/>
            </Button>
        </Flex>
    )
})