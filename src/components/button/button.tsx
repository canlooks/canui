import React, {ElementType, ReactNode} from 'react'
import {useTheme} from '../theme'
import {useTouchSpread} from '../../utils'
import {ColorPropsValue, OverridableComponent, OverridableProps, Size} from '../../types'
import {clsx} from '../../utils'
import {LoadingIndicator} from '../loadingIndicator'
import {classes, useStyle} from './button.style'
import {Collapse} from '../transitionBase'

export type ButtonOwnProps = {
    color?: ColorPropsValue
    /** 默认为`"square"` */
    shape?: 'square' | 'circular' | 'rounded'
    size?: Size
    /** 默认为`"filled"` */
    variant?: 'flatted' | 'filled' | 'outlined' | 'dashed' | 'ghost' | 'text' | 'plain'
    /** 默认为`"horizontal"` */
    orientation?: 'horizontal' | 'vertical'
    prefix?: ReactNode
    suffix?: ReactNode
    loading?: boolean
    readOnly?: boolean

    /** @alias {@link prefix} */
    icon?: ReactNode
    /** @alias {@link ButtonProps.children} */
    label?: ReactNode
}

export type ButtonProps<C extends ElementType = 'button'> = OverridableProps<ButtonOwnProps, C>

export const Button: OverridableComponent<ButtonProps, 'button'> = ({
    component: Component = 'button',
    color = 'primary',
    shape = 'square',
    size,
    variant = 'filled',
    orientation = 'horizontal',
    prefix,
    suffix,
    loading = false,
    readOnly,
    icon,
    label,
    ...props
}: ButtonProps) => {
    const theme = useTheme()

    size ??= theme.size

    const showSpread = useTouchSpread(color)

    const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
        props.onPointerUp?.(e)
        if (!props.disabled
            && !loading
            && !readOnly
            && ({flatted: true, filled: true, outlined: true, dashed: true} as any)[variant]
        ) {
            showSpread(e.currentTarget)
        }
    }

    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        !loading && !readOnly && props.onClick?.(e)
    }

    const actualPrefix = prefix ?? icon
    const actualChildren = label ?? props.children

    const reverseTextColor = variant === 'filled' || variant === 'flatted' ? '#ffffff' : color

    return (
        <Component
            type="button"
            {...props}
            css={useStyle({color: color || 'primary'})}
            className={clsx(classes.root, props.className)}
            onPointerUp={onPointerUp}
            onClick={onClick}
            data-variant={variant}
            data-orientation={orientation}
            data-shape={shape}
            data-size={size}
            data-loading={loading}
            data-read-only={readOnly}
        >
            {loading
                ? actualPrefix
                    ? <LoadingIndicator color={reverseTextColor}/>
                    : <Collapse orientation="horizontal" in>
                        <LoadingIndicator color={reverseTextColor}/>
                    </Collapse>
                : actualPrefix
            }
            {!!actualChildren &&
                <div className={classes.content}>{actualChildren}</div>
            }
            {!!suffix &&
                <div className={classes.suffix}>
                    {suffix}
                </div>
            }
        </Component>
    )
}