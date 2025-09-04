import {CSSProperties, Children, cloneElement, isValidElement, ElementType} from 'react'
import {classes} from './flex.style'
import {clsx, filterProperties} from '../../utils'
import {TransportStyle, TransportStyleOwnProps} from '../transportStyle'
import {OverridableComponent, OverridableProps} from '../../types'

interface FlexOwnProps extends TransportStyleOwnProps {
    inline?: boolean
    /** 排列方式，默认为`row` */
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    /** 换行方式 */
    wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
    gap?: CSSProperties['gap']
    columnGap?: CSSProperties['columnGap']
    rowGap?: CSSProperties['rowGap']
    /** 当compact为true时，gap无效，而且会清除子元素的圆角，让他们拼接起来 */
    compact?: boolean
}

export type FlexProps<C extends ElementType = 'div'> = OverridableProps<FlexOwnProps, C>

export const Flex = (
    ({
        inline,
        direction = 'row',
        wrap,
        gap = 0,
        columnGap,
        rowGap,
        compact,
        ...props
    }: FlexProps) => {
        const renderChildren = () => {
            if (!compact) {
                return props.children
            }
            const childrenCount = Children.count(props.children)
            return Children.map(props.children, (child, index) => {
                if (!isValidElement(child)) {
                    return child
                }
                return cloneElement(child, {
                    ...index === 0 && {'data-first': true},
                    ...index === childrenCount - 1 && {'data-last': true},
                    ...{'data-compact': direction.split('-')[0]}
                })
            })
        }

        return (
            <TransportStyle
                {...props}
                className={clsx(classes.root, props.className)}
                style={filterProperties({
                    display: inline ? 'inline-flex' : 'flex',
                    flexDirection: direction,
                    flexWrap: wrap, columnGap, rowGap, gap,
                    ...props.style
                })}
            >
                {renderChildren()}
            </TransportStyle>
        )
    }
) as OverridableComponent<FlexOwnProps>