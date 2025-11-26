import {classes, style} from './card.style'
import {clsx} from '../../utils'
import {useTheme} from '../theme'
import {Flex, FlexProps} from '../flex'

export interface CardProps extends FlexProps {
    /** 是否采用flex布局，等效于`display: flex`，默认为`false` */
    flexable?: boolean
    /** 是否显示边框，默认为`false` */
    bordered?: boolean
    /** 支持0-5，明亮主题表示阴影的程度, 暗黑主题表示背景色，默认为`0` */
    elevation?: number
    /** 默认为{@link Theme.borderRadius} */
    borderRadius?: number
}

export function Card({
    flexable,
    bordered,
    elevation = 0,
    borderRadius,
    ...props
}: CardProps) {
    const theme = useTheme()

    borderRadius ??= theme.borderRadius

    return (
        <Flex
            direction="column"
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            style={{
                display: flexable ? 'flex' : void 0,
                borderRadius,
                ...props.style
            }}
            data-elevation={elevation}
            data-bordered={bordered}
        />
    )
}