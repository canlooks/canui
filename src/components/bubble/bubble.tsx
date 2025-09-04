import {Popper, PopperProps} from '../popper'
import {classes, style} from './bubble.style'
import {clsx} from '../../utils'
import {useTheme} from '../theme'

export interface BubbleProps extends PopperProps {
    showArrow?: boolean
}

export function Bubble({
    showArrow = true,
    ...props
}: BubbleProps) {
    const {spacing} = useTheme()

    props.autoClose ??= true
    props.offset ??= showArrow ? spacing[3] : spacing[2]

    return (
        <Popper
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            content={
                <div
                    className={classes.content}
                    data-show-arrow={showArrow}
                >
                    {props.content}
                </div>
            }
        />
    )
}