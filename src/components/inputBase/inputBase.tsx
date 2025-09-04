import React, {ComponentProps, ReactElement, ReactNode, useRef} from 'react'
import {ColorPropsValue, DivProps, Size} from '../../types'
import {classes, useStyle} from './inputBase.style'
import {fixInputNumber, mergeComponentProps, useControlled} from '../../utils'
import {useTheme} from '../theme'
import {Button} from '../button'
import {LoadingIndicator} from '../loadingIndicator'
import {Icon} from '../icon'
import {faCircleXmark} from '@fortawesome/free-solid-svg-icons/faCircleXmark'

export interface InputBaseProps<T extends 'input' | 'textarea'> extends Omit<DivProps, 'prefix' | 'onChange' | 'children'> {
    variant?: 'outlined' | 'underlined' | 'plain'
    size?: Size
    shape?: 'square' | 'rounded'
    color?: ColorPropsValue
    prefix?: ReactNode
    suffix?: ReactNode
    clearable?: boolean
    onClear?(): void
    loading?: boolean

    type?: T extends 'input' ? ComponentProps<T>['type'] : never
    min?: T extends 'input' ? ComponentProps<T>['min'] : never
    max?: T extends 'input' ? ComponentProps<T>['max'] : never
    step?: T extends 'input' ? ComponentProps<T>['step'] : never
    precision?: T extends 'input' ? number : never

    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    autoFocus?: ComponentProps<T>['autoFocus']
    defaultValue?: ComponentProps<T>['defaultValue']
    value?: ComponentProps<T>['value']
    onChange?: ComponentProps<T>['onChange']

    children(childProps: ComponentProps<T>): ReactNode
}

export const InputBase = (({
    variant = 'outlined',
    size,
    shape,
    color = 'primary',
    children,
    prefix,
    suffix,
    onClear,
    loading,
    type,
    clearable = type !== 'number',
    // 以下属性传递给<input/>
    min,
    max,
    step,
    precision,
    placeholder,
    disabled,
    readOnly,
    autoFocus,
    defaultValue,
    value,
    onChange,

    ...props
}: InputBaseProps<any>) => {
    const theme = useTheme()

    size ??= theme.size

    const innerInputRef = useRef<HTMLInputElement>(null)

    const wrapClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        // 点击包裹元素时，聚焦到内部的input元素
        !disabled && innerInputRef.current && innerInputRef.current !== document.activeElement && innerInputRef.current.focus()
    }

    const [innerValue, setInnerValue] = useControlled(defaultValue, value)

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e)
        setInnerValue(e.target.value)
    }

    const clear = (e: React.MouseEvent<any>) => {
        // 阻止冒泡，防止触发clickAway事件，如输入框在popper内的情况
        e.stopPropagation()
        if (innerInputRef.current) {
            innerInputRef.current.value = ''
            e.target = e.currentTarget = innerInputRef.current
            onClear?.()
            changeHandler(e as any)
            innerInputRef.current.focus()
        }
    }

    const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        if (type !== 'number') {
            return
        }
        const value = fixInputNumber(e.target.value, {min, max, precision})
        if (e.target.value !== value) {
            e.target.value = value
            changeHandler(e)
        }
    }

    return (
        <div
            {...mergeComponentProps(
                props,
                {
                    className: classes.root,
                    onClick: wrapClickHandler,
                    onPointerDown: e => {
                        const {target} = e
                        if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLTextAreaElement)) {
                            e.preventDefault()
                        }
                    }
                }
            )}
            css={useStyle({color: color || 'primary'})}
            data-variant={variant}
            data-size={size}
            data-shape={shape}
        >
            {!!prefix &&
                <div className={classes.prefix}>{prefix}</div>
            }
            <div className={classes.content}>
                {children({
                    ref: innerInputRef,
                    type,
                    min,
                    max,
                    step,
                    precision,
                    placeholder,
                    disabled,
                    readOnly,
                    autoFocus,
                    // 复制disabled与readOnly属性用于定义样式
                    'data-disabled': !!disabled + '',
                    'data-read-only': !!readOnly + '',
                    value: innerValue.current ?? '',
                    onChange: changeHandler,
                    onBlur: blurHandler,
                    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && blurHandler(e as any)
                })}
            </div>
            {loading &&
                <LoadingIndicator/>
            }
            {clearable && !disabled && !readOnly && (Array.isArray(innerValue.current) ? !!innerValue.current.length : !!innerValue.current) &&
                <Button
                    className={classes.clear}
                    variant="plain"
                    color="text.disabled"
                    onClick={clear}
                    tabIndex={-1}
                >
                    <Icon icon={faCircleXmark}/>
                </Button>
            }
            {!!suffix &&
                <div className={classes.suffix}>{suffix}</div>
            }
        </div>
    )
}) as <T extends 'input' | 'textarea'>(props: InputBaseProps<T>) => ReactElement