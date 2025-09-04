import {ElementType, ReactElement} from 'react'
import {OverridableProps, ResponsiveProp} from '../../types'
import {classes, useContainerStyle} from './grid.style'
import {GridItem} from './gridItem'
import {clsx, toResponsiveValue} from '../../utils'
import {TransportStyle, TransportStyleOwnProps} from '../transportStyle'

export interface GridOwnProps extends TransportStyleOwnProps {
    inline?: boolean
    /** 网格列数，默认为`{xs: 12}` */
    columnCount?: ResponsiveProp
    gap?: ResponsiveProp
    columnGap?: ResponsiveProp
    rowGap?: ResponsiveProp
}

export type GridProps<C extends ElementType = 'div'> = OverridableProps<GridOwnProps, C>

export const Grid = (
    ({
        inline,
        columnCount = {xs: 12},
        gap = {xs: 0},
        columnGap,
        rowGap,
        ...props
    }: GridProps) => {
        columnCount = toResponsiveValue(columnCount)
        gap = toResponsiveValue(gap)
        columnGap = toResponsiveValue(columnGap!) ?? gap
        rowGap = toResponsiveValue(rowGap!) ?? gap

        return (
            <TransportStyle
                {...props}
                css={useContainerStyle({columnCount, columnGap, rowGap})}
                className={clsx(classes.root, props.className)}
                style={{
                    display: inline ? 'inline-flex' : 'flex',
                    ...props.style
                }}
            />
        )
    }
) as {
    <C extends ElementType = 'div'>(props: GridProps<C>): ReactElement
    Item: typeof GridItem
}

Grid.Item = GridItem