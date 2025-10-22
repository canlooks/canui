import {Ref, memo, ComponentProps, CSSProperties} from 'react'
import {InputBase, InputBaseProps} from '../inputBase'
import {classes, style} from './textarea.style'
import {clsx, mergeComponentProps} from '../../utils'

export interface TextareaProps extends Omit<InputBaseProps<'textarea'>, 'children' | 'prefix' | 'suffix'> {
    textareaProps?: ComponentProps<'textarea'>
    textareaRef?: Ref<HTMLTextAreaElement>
    rows?: number
    fullWidth?: boolean
    /**
     * @enum {@link fullWidth} 为`true`时，默认为`vertical`
     * @enum {@link fullWidth} 为`false`时，默认为`both`
     * @enum 若设为`none`，则不可调整尺寸
     */
    resize?: CSSProperties['resize']
}

export const Textarea = memo(({
    textareaProps,
    textareaRef,
    rows,
    fullWidth = false,
    resize = fullWidth ? 'vertical' : 'both',
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
                            className: classes.textarea,
                            style: {resize}
                        }
                    )}
                />
            }
        </InputBase>
    )
})