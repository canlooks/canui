import {ReactNode, memo} from 'react'
import {DivProps, Id} from '../../types'
import {clsx} from '../../utils'
import {classes} from './segmented.style'

export interface SegmentedOptionProps extends Omit<DivProps, 'prefix'> {
    orientation?: 'horizontal' | 'vertical'
    prefix?: ReactNode
    suffix?: ReactNode

    value?: Id
    label?: ReactNode

    disabled?: boolean
}

export const SegmentedOption = memo(({
    orientation,
    prefix,
    suffix,
    value,
    label,
    disabled,
    ...props
}: SegmentedOptionProps) => {
    return (
        <div
            {...props}
            className={clsx(classes.option, props.className)}
            data-orientation={orientation}
            data-disabled={disabled}
            onClick={e => {
                !disabled && props.onClick?.(e)
            }}
        >
            {!!prefix &&
                <div className={classes.prefix}>{prefix}</div>
            }
            <div className={classes.label}>{label}</div>
            {!!suffix &&
                <div className={classes.suffix}>{suffix}</div>
            }
        </div>
    )
})