import {FontAwesomeIcon, FontAwesomeIconProps} from '@fortawesome/react-fontawesome'
import {ColorPropsValue} from '../../types'
import {useColor} from '../../utils'

export interface IconProps extends Omit<FontAwesomeIconProps, 'color'> {
    color?: ColorPropsValue
}

export function Icon({
    color,
    ...props
}: IconProps) {
    return <FontAwesomeIcon {...props} color={useColor(color)}/>
}