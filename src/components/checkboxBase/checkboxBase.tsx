import React, {ReactNode, memo, useRef, ComponentProps} from 'react'
import {ColorPropsValue, DivProps, Id, Size} from '../../types'
import {clsx, useControlled, useTouchSpread, mergeComponentProps} from '../../utils'
import {classes, useStyle} from './checkboxBase.style'
import {useCheckboxBaseGroupContext} from '../checkboxBaseGroup'
import {Icon} from '../icon'
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck'

export interface CheckboxBaseProps extends DivProps {
    inputProps?: ComponentProps<'input'>
    /** @private 内部使用 */
    _type: 'checkbox' | 'radio'

    size?: Size
    color?: ColorPropsValue
    label?: ReactNode
    value?: Id

    indeterminate?: boolean
    disabled?: boolean
    readOnly?: boolean
    defaultChecked?: boolean
    checked?: boolean
    onChange?(e: React.ChangeEvent<HTMLInputElement>): void
}

export const CheckboxBase = memo(({
    inputProps,
    _type,

    size,
    color,
    label,
    value,

    indeterminate,
    disabled,
    readOnly,
    defaultChecked = false,
    checked,
    onChange,
    ...props
}: CheckboxBaseProps) => {
    const context = useCheckboxBaseGroupContext()

    size ??= context.size || 'medium'
    color ||= context.color || 'primary'

    if (_type === 'radio') {
        // "radio"不支持indeterminate
        indeterminate = false
    }

    const checkboxRef = useRef<HTMLDivElement>(null)
    const innerInputRef = useRef<HTMLInputElement>(null)

    const [innerChecked, setInnerChecked] = useControlled(defaultChecked, checked)

    const showSpread = useTouchSpread(color)

    const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || readOnly) {
            return
        }
        showSpread(checkboxRef.current!)
        const newChecked = innerInputRef.current!.checked = !innerChecked.current
        e.target = e.currentTarget = innerInputRef.current!
        props.onClick?.(e)
        onChange?.(e as any)
        setInnerChecked(newChecked)
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        inputProps?.onKeyDown?.(e)
        e.key === 'Enter' && clickHandler(e as any)
    }

    return (
        <div
            {...props}
            css={useStyle({color})}
            className={clsx(classes.root, props.className)}
            onClick={clickHandler}
            data-size={size}
            data-checked={innerChecked.current && !indeterminate}
            data-disabled={disabled}
        >
            {_type === 'checkbox'
                ? <div ref={checkboxRef} className={classes.checkbox}>
                    {indeterminate
                        ? <div className={classes.indeterminate}/>
                        : innerChecked.current
                            ? <Icon icon={faCheck} className={classes.icon}/>
                            : null
                    }
                </div>
                : <div ref={checkboxRef} className={`${classes.checkbox} ${classes.radio}`}>
                    {innerChecked.current
                        ? <div className={classes.radioChecked}/>
                        : null
                    }
                </div>
            }
            {!!label &&
                <div className={classes.label}>{label}</div>
            }
            <input
                {...mergeComponentProps<'input'>(
                    {
                        type: _type,
                        disabled,
                        readOnly,
                        ref: innerInputRef,
                        className: classes.input,
                        onKeyDown
                    },
                    inputProps
                )}
            />
        </div>
    )
})