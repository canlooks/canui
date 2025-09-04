import {CSSProperties, ElementType} from 'react'
import {OverridableComponent, OverridableProps} from '../../types'
import {filterProperties} from '../../utils'

export type TransportStyleOwnProps = {
    /** 交叉轴对齐方式 */
    alignItems?: CSSProperties['alignItems']
    /** 平行轴对齐方式 */
    justifyContent?: CSSProperties['justifyContent']

    alignSelf?: CSSProperties['alignSelf']
    justifySelf?: CSSProperties['justifySelf']

    flex?: CSSProperties['flex']
    /** 传递其他常用样式 */
    width?: CSSProperties['width']
    minWidth?: CSSProperties['minWidth']
    maxWidth?: CSSProperties['maxWidth']
    height?: CSSProperties['height']
    minHeight?: CSSProperties['minHeight']
    maxHeight?: CSSProperties['maxHeight']
    lineHeight?: CSSProperties['lineHeight']
    paddingTop?: CSSProperties['paddingTop']
    paddingRight?: CSSProperties['paddingRight']
    paddingBottom?: CSSProperties['paddingBottom']
    paddingLeft?: CSSProperties['paddingLeft']
    padding?: CSSProperties['padding']
    marginTop?: CSSProperties['marginTop']
    marginRight?: CSSProperties['marginRight']
    marginBottom?: CSSProperties['marginBottom']
    marginLeft?: CSSProperties['marginLeft']
    margin?: CSSProperties['margin']
    overflowX?: CSSProperties['overflowX']
    overflowY?: CSSProperties['overflowY']
    overflow?: CSSProperties['overflow']
}

export type TransportStyleProps<C extends ElementType = 'div'> = OverridableProps<TransportStyleOwnProps, C>

export const TransportStyle = (
    ({
        component: Component = 'div',
        alignItems, justifyContent, alignSelf, justifySelf, flex,
        width, minWidth, maxWidth, height, minHeight, maxHeight, lineHeight,
        paddingTop, paddingRight, paddingBottom, paddingLeft, padding,
        marginTop, marginRight, marginBottom, marginLeft, margin,
        overflowX, overflowY, overflow,
        ...props
    }: TransportStyleProps) => {
        return (
            <Component
                {...props}
                style={filterProperties({
                    alignItems, justifyContent, alignSelf, justifySelf, flex,
                    width, minWidth, maxWidth, height, minHeight, maxHeight, lineHeight,
                    padding, paddingTop, paddingRight, paddingBottom, paddingLeft,
                    margin, marginTop, marginRight, marginBottom, marginLeft,
                    overflow, overflowX, overflowY,
                    ...props.style
                })}
            />
        )
    }
) as OverridableComponent<TransportStyleOwnProps>