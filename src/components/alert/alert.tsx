import React, {ReactNode, memo} from 'react'
import {ColorPropsValue, DivProps, Status} from '../../types'
import {clsx} from '../../utils'
import {classes, useStyle} from './alert.style'
import {Button} from '../button'
import {Skeleton} from '../skeleton'
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark'
import {Icon} from '../icon'
import {statusMapToIconDefinition} from '../status'

export interface AlertProps extends Omit<DivProps, 'title' | 'prefix' | 'children'> {
    variant?: 'filled' | 'outlined' | 'standard'
    status?: Status
    color?: ColorPropsValue
    /** 是否显示图标，默认为`true` */
    showIcon?: boolean
    icon?: ReactNode
    title?: ReactNode
    description?: ReactNode
    prefix?: ReactNode
    suffix?: ReactNode
    /** 是否显示关闭按钮 */
    closable?: boolean
    onClose?: React.MouseEventHandler<HTMLButtonElement>
    loading?: boolean
}

export const Alert = memo(({
    variant = 'standard',
    status = 'error',
    color = status,
    showIcon = true,
    icon,
    title,
    description,
    prefix,
    suffix,
    closable,
    onClose,
    loading,
    ...props
}: AlertProps) => {
    return (
        <div
            {...props}
            css={useStyle({color: color || 'error'})}
            className={clsx(classes.root, props.className)}
            data-variant={variant}
        >
            {showIcon &&
                <div className={classes.icon}>{
                    loading
                        ? <Skeleton variant="circular"/>
                        : icon ?? <Icon icon={statusMapToIconDefinition[status]}/>
                }</div>
            }
            {!loading && !!prefix &&
                <div className={classes.prefix}>{prefix}</div>
            }
            <div className={classes.content}>
                {!!(loading || title) &&
                    <div className={classes.title}>
                        {loading
                            ? <Skeleton width="40%"/>
                            : title
                        }
                    </div>
                }
                {!!(loading || description) &&
                    <div className={classes.description}>
                        {loading
                            ? <Skeleton/>
                            : description
                        }
                    </div>
                }
            </div>
            {!loading && !!suffix &&
                <div className={classes.suffix}>{suffix}</div>
            }
            {closable &&
                <Button
                    className={classes.close}
                    variant="text"
                    shape="circular"
                    color={variant === 'filled' ? '#fff' : 'text.secondary'}
                    onClick={onClose}
                    disabled={loading}
                >
                    <Icon icon={faXmark}/>
                </Button>
            }
        </div>
    )
})