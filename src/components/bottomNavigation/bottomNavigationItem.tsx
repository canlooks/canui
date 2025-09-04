import {ReactNode, memo} from 'react'
import {DivProps, Id} from '../../types'
import {clsx} from '../../utils'
import {classes} from './bottomNavigation.style'

export interface BottomNavigationItemProps extends DivProps {
    value?: Id
    icon?: ReactNode
    label?: ReactNode
    showLabelInactive?: boolean
    active?: boolean
}

export const BottomNavigationItem = memo(({
    value,
    icon,
    label,
    showLabelInactive = true,
    active,
    ...props
}: BottomNavigationItemProps) => {
    return (
        <div
            {...props}
            className={clsx(classes.item, props.className)}
            data-active={active}
            data-show-label-inactive={showLabelInactive}
        >
            {!!icon &&
                <div className={classes.icon}>{icon}</div>
            }
            {!!label &&
                <div className={classes.label}>{label}</div>
            }
        </div>
    )
})