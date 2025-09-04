import {Children, ReactNode, cloneElement, isValidElement, memo} from 'react'
import {clsx} from '../../utils'
import {classes, style} from './avatarGroup.style'
import {Avatar, AvatarProps, useAvatarStyle} from './avatar'
import {Obj} from '../../types'

export interface AvatarGroupProps extends Omit<AvatarProps, 'src'> {
    items?: (AvatarProps & Obj)[]
    hoverable?: boolean
    /** 最大显示的数量，默认为5 */
    max?: number
    /** 总共的数量，默认取items或children的长度 */
    total?: number
    /** 超过最大限制时，渲染的额外头像 */
    renderSurplus?(surplus: number): ReactNode
}

export const AvatarGroup = memo(({
    color,
    size,
    shape = 'circular',
    imgProps,

    items,
    hoverable = true,
    max = 5,
    total,
    renderSurplus,
    ...props
}: AvatarGroupProps) => {
    const itemStyle = useAvatarStyle({color, size})

    const commonProps = {
        ...itemStyle,
        shape,
        imgProps
    }

    total ??= items?.length ?? Children.count(props.children)

    const isSurplus = total > max

    const renderItems = () => {
        if (items?.length) {
            return items.slice(0, isSurplus ? max - 1 : max).reverse().map((p, i) =>
                <Avatar
                    {...commonProps}
                    {...p}
                    key={p.key ?? i}
                >
                    {p.children}
                </Avatar>
            )
        }
        return Children.toArray(props.children).slice(0, isSurplus ? max - 1 : max).reverse().map(child => {
            return isValidElement(child)
                ? cloneElement(child, {
                    ...commonProps,
                    ...child.props as any
                })
                : child
        })
    }

    const renderSurplusFn = () => {
        if (!isSurplus) {
            return
        }
        const surplus = total! - max + 1
        if (renderSurplus) {
            return renderSurplus(surplus)
        }
        return <Avatar>+{surplus}</Avatar>
    }

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-hoverable={hoverable}
        >
            <div className={classes.wrap}>
                {renderSurplusFn()}
                {renderItems()}
            </div>
        </div>
    )
})