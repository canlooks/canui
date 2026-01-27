import React, {ReactNode, memo} from 'react'
import {ColorPropsValue, DivProps, Size} from '../../types'
import {classes, useStyle} from './tag.style'
import {clsx} from '../../utils'
import {Icon} from '../icon'
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark'
import {Button} from '../button'

export interface TagProps extends Omit<DivProps, 'prefix'> {
    variant?: 'filled' | 'outlined' | 'plain'
    color?: ColorPropsValue
    shape?: 'square' | 'rounded'
    size?: Size
    prefix?: ReactNode
    suffix?: ReactNode
    clickable?: boolean
    closable?: boolean
    onClose?: React.MouseEventHandler<HTMLButtonElement>
}

export const Tag = memo(({
    variant = 'outlined',
    color = 'text.secondary',
    shape = 'square',
    size = 'small',
    prefix,
    suffix,
    clickable,
    closable,
    onClose,
    ...props
}: TagProps) => {
    const closeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        onClose?.(e)
    }

    return (
        <div
            {...props}
            css={useStyle({color})}
            className={clsx(classes.root, props.className)}
            data-variant={variant}
            data-size={size}
            data-shape={shape}
            data-clickable={clickable}
        >
            {!!prefix &&
                <div className={classes.prefix}>{prefix}</div>
            }
            <div className={classes.content}>{props.children}</div>
            {!!suffix &&
                <div className={classes.suffix}>{suffix}</div>
            }
            {closable &&
                <Button
                    className={classes.close}
                    variant="plain"
                    color={color}
                    onClick={closeHandler}
                >
                    <Icon icon={faXmark}/>
                </Button>
            }
        </div>
    )
})