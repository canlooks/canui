import {mergeComponentProps} from '../../utils'
import {classes, style} from './input.style'
import {memo, ComponentProps} from 'react'
import {InputBase, InputBaseProps} from '../inputBase'

export interface InputProps extends Omit<InputBaseProps<'input'>, 'children'> {
    inputProps?: ComponentProps<'input'>
    /** 是否根据内容自动调整宽度 */
    widthAdaptable?: boolean
}

export const Input = memo(({
    inputProps,
    widthAdaptable,
    ...props
}: InputProps) => {
    return (
        <InputBase<'input'>
            {...mergeComponentProps<InputBaseProps<'input'>>(
                props,
                {
                    css: style,
                    className: classes.root,
                    'data-adaptable': widthAdaptable
                }
            )}
        >
            {inputBaseProps => {
                return (
                    <>
                        <input
                            {...mergeComponentProps<'input'>(
                                {
                                    size: 1,
                                    className: classes.input
                                },
                                inputBaseProps,
                                inputProps
                            )}
                        />
                        {widthAdaptable &&
                            <span className={classes.adaptable}>{inputBaseProps.value}</span>
                        }
                    </>
                )
            }}
        </InputBase>
    )
})