import {Popper, PopperProps} from '../popper'
import {classes, style} from './dropdown.style'
import {clsx} from '../../utils'
import {useTheme} from '../theme'

export interface DropdownProps extends PopperProps {
    showArrow?: boolean
}

export function Dropdown({
    showArrow,
    ...props
}: DropdownProps) {
    const {spacing} = useTheme()

    props.autoClose ??= true
    props.trigger ??= 'click'
    props.placement ??= 'bottom'
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