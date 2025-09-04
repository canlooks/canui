import {OverridableComponent, OverridableProps, ResponsiveProp} from '../../types'
import {clsx, toResponsiveValue} from '../../utils'
import {classes, useItemStyle} from './grid.style'
import {TransportStyle, TransportStyleOwnProps} from '../transportStyle'
import {ElementType} from 'react'

interface GridItemOwnProps extends TransportStyleOwnProps {
    span?: ResponsiveProp
    offset?: ResponsiveProp
}

export type GridItemProps<C extends ElementType = 'div'> = OverridableProps<GridItemOwnProps, C>

export const GridItem = (
    ({
        span = {xs: 1},
        offset = {xs: 0},
        ...props
    }: GridItemProps) => {
        span = toResponsiveValue(span)
        offset = toResponsiveValue(offset)

        return (
            <TransportStyle
                {...props}
                css={useItemStyle({span, offset})}
                className={clsx(classes.item, props.className)}
            />
        )
    }
) as OverridableComponent<GridItemOwnProps>