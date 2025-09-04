import {ReactElement, memo, useMemo, ComponentProps} from 'react'
import {ColorPropsValue, DivProps, Size} from '../../types'
import {classes, useStyle} from './avatar.style'
import {mergeComponentProps} from '../../utils'
import {useTheme} from '../theme'
import {AvatarGroup} from './avatarGroup'

export interface AvatarProps extends DivProps {
    color?: ColorPropsValue
    size?: Size | number | string
    shape?: 'circular' | 'square'
    src?: string
    imgProps?: ComponentProps<'img'>
}

export function useAvatarStyle(props: Pick<AvatarProps, 'color' | 'size'>) {
    const {mode, size, gray} = useTheme()

    const _size = props.size ?? size

    return useMemo(() => ({
        color: props.color || gray(mode === 'light' ? .2 : .3),
        size: {
            small: 24,
            medium: 32,
            large: 40
        }[_size] || _size
    }), [props.color, mode, _size])
}

export const Avatar = memo(({
    color,
    size,
    shape = 'circular',
    src,
    imgProps,
    ...props
}: AvatarProps) => {
    const style = useAvatarStyle({color, size})

    return (
        <div
            {...mergeComponentProps(
                props,
                {
                    css: useStyle({color: style.color}),
                    className: classes.root,
                    style: {width: style.size}
                }
            )}
            data-shape={shape}
        >
            {src
                ? <img
                    {...mergeComponentProps(
                        {src, alt: ''},
                        imgProps,
                        {className: classes.img}
                    )}
                />
                : props.children
            }
        </div>
    )
}) as any as {
    (props: AvatarProps): ReactElement
    Group: typeof AvatarGroup
}

Avatar.Group = AvatarGroup