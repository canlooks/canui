import {Ref, memo, ComponentProps} from 'react'
import {InputBase, InputBaseProps} from '../inputBase'
import {classes, style} from './textarea.style'
import {clsx, mergeComponentProps} from '../../utils'

export interface TextareaProps extends Omit<InputBaseProps<'textarea'>, 'children' | 'prefix' | 'suffix'> {
    textareaProps?: ComponentProps<'textarea'>
    textareaRef?: Ref<HTMLTextAreaElement>
    rows?: number
    fullWidth?: boolean
}

export const Textarea = memo(({
    textareaProps,
    textareaRef,
    rows,
    fullWidth = false,
    ...props
}: TextareaProps) => {
    return (
        <InputBase<'textarea'>
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-full-width={fullWidth}
        >
            {inputBaseProps =>
                <textarea
                    {...mergeComponentProps(
                        inputBaseProps,
                        {
                            rows,
                            ref: textareaRef,
                            className: classes.textarea
                        }
                    )}
                />
            }
        </InputBase>
    )
})