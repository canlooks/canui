import {FontAwesomeIcon, FontAwesomeIconProps} from '@fortawesome/react-fontawesome'
import {ColorPropsValue} from '../../types'
import {clsx, defineInnerClasses, useColor} from '../../utils'

export interface IconProps extends Omit<FontAwesomeIconProps, 'color'> {
    color?: ColorPropsValue
}

const classes = defineInnerClasses('icon')

export function Icon({
    color,
    ...props
}: IconProps) {
    return (
        <FontAwesomeIcon
            {...props}
            className={clsx(classes.root, props.className)}
            color={useColor(color)}
        />
    )
}