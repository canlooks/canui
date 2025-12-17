import {ReactNode, memo, useMemo} from 'react'
import {DivProps, Status as IStatus} from '../../types'
import {classes, style} from './status.style'
import {clsx, useStatusColor} from '../../utils'
import {faCircleInfo, faCircleCheck, faCircleExclamation, faCircleXmark, faCircleQuestion} from '@fortawesome/free-solid-svg-icons'
import {Icon, IconProps} from '../icon'

export type StatusType = IStatus | 'confirm' | 'unknown'

export const statusMapToIconDefinition = {
    info: faCircleInfo,
    success: faCircleCheck,
    warning: faCircleExclamation,
    error: faCircleXmark,
    confirm: faCircleQuestion,
    unknown: faCircleQuestion
}

export interface StatusIconProps extends Partial<IconProps> {
    status?: StatusType
}

export const StatusIcon = memo(({
    status = 'unknown',
    ...props
}: StatusIconProps) => {
    const statusColor = useStatusColor(status)

    const iconProps: IconProps = {
        ...props,
        icon: props.icon || statusMapToIconDefinition[status],
        className: clsx(classes.icon, props.className),
        style: useMemo(() => ({
            color: statusColor,
            ...props.style
        }), [statusColor, props.style])
    }

    return <Icon {...iconProps}/>
})

export interface StatusProps extends DivProps {
    status?: StatusType
    /** 默认为"icon" */
    variant?: 'icon' | 'dot'
    label?: ReactNode
    /** 是否播放动画，默认为false */
    animation?: boolean
    /** {@link variant}为`icon`时生效，传递给`<StatusIcon/>`组件 */
    iconProps?: Partial<IconProps>
}

const defaultLabel = {
    unknown: '未知',
    confirm: '确认',
    info: '信息',
    success: '成功',
    warning: '警告',
    error: '错误'
}

export const Status = memo(({
    status = 'unknown',
    variant = 'icon',
    label = defaultLabel[status],
    animation,
    iconProps,
    ...props
}: StatusProps) => {
    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-animation={animation}
        >
            {variant === 'icon'
                ? <StatusIcon {...iconProps} status={status} />
                : <div
                    className={classes.dot}
                    style={{backgroundColor: useStatusColor(status)}}
                />
            }
            <div className={classes.label}>{label}</div>
        </div>
    )
})