import {FontAwesomeIcon, FontAwesomeIconProps} from '@fortawesome/react-fontawesome'
import {ColorPropsValue} from '../../types'
import {clsx, defineInnerClasses, useColor} from '../../utils'
import {IconDefinition} from '@fortawesome/free-brands-svg-icons'

export interface IconProps extends Omit<FontAwesomeIconProps, 'color' | 'icon'> {
    color?: ColorPropsValue
    icon: FontAwesomeIconProps['icon'] | IconDefinition
}

const classes = defineInnerClasses('icon')

export function Icon({
    color,
    ...props
}: IconProps) {
    return (
        <FontAwesomeIcon
            {...props as FontAwesomeIconProps}
            className={clsx(classes.root, props.className)}
            color={useColor(color)}
            fontSize={14}
        />
    )
}