import {ReactNode, memo, ElementType} from 'react'
import {DescriptionsSharedProps, useDescriptionsContext} from './descriptions'
import {useTheme} from '../theme'
import {GridItem, GridItemProps} from '../grid'
import {clsx, useResponsiveValue} from '../../utils'
import {classes, gridItemStyle} from './descriptions.style'
import {MergeProps, OverridableComponent, ResponsiveProp} from '../../types'

export interface DescriptionGridItemOwnProps extends DescriptionsSharedProps {
    label?: ReactNode
    /** @alias {@link children} */
    content?: ReactNode
}

export interface DescriptionTableItemProps extends DescriptionGridItemOwnProps {
    span?: ResponsiveProp

    className?: string
    children?: ReactNode
}

export type DescriptionItemProps<C extends ElementType = 'div'> =
    | MergeProps<DescriptionGridItemOwnProps, GridItemProps<C>>
    | DescriptionTableItemProps

export const DescriptionItem = memo(
    ({
        label,
        content,
        // 以下属性从DescriptionsSharedProps继承
        size,
        labelWidth,
        colon,
        labelPlacement,
        disableMargin,
        disablePadding,

        span = {xs: 1},
        ...props
    }: DescriptionItemProps) => {
        const theme = useTheme()

        const {
            variant = 'grid',
            ...context
        } = useDescriptionsContext()

        size ??= context.size ?? theme.size
        labelWidth ??= context.labelWidth
        colon ??= context.colon ?? ':'
        labelPlacement ??= context.labelPlacement ?? 'left'
        disableMargin ??= context.disableMargin
        disablePadding ??= context.disablePadding

        const spanNum = useResponsiveValue(span, variant === 'grid')

        return variant === 'grid'
            ? <GridItem
                {...props}
                css={gridItemStyle}
                className={clsx(classes.item, props.className)}
                span={span}
                data-size={size}
                data-label-placement={labelPlacement}
                data-disable-margin={disableMargin}
            >
                {!!label &&
                    <div
                        className={classes.label}
                        style={{width: labelWidth}}
                    >
                        {label}
                        {!!colon && labelPlacement === 'left' &&
                            <div className={classes.colon}>{colon}</div>
                        }
                    </div>
                }
                <div className={classes.content}>{content ?? props.children}</div>
            </GridItem>
            : labelPlacement === 'top'
                ? <td className={classes.vertical} colSpan={spanNum.current}>
                    <div className={classes.verticalColWrap}>
                        <div
                            className={`${classes.col} ${classes.labelCol}`}
                            data-size={size}
                        >
                            {label}
                        </div>
                        <div
                            className={`${classes.col} ${classes.contentCol}`}
                            data-size={size}
                            data-disable-padding={disablePadding}
                        >
                            {content ?? props.children}
                        </div>
                    </div>
                </td>
                : <>
                    {!!label &&
                        <td
                            className={`${classes.col} ${classes.labelCol}`}
                            data-size={size}
                        >
                            {label}
                        </td>
                    }
                    <td
                        className={`${classes.col} ${classes.contentCol}`}
                        colSpan={spanNum.current * 2 - 1}
                        data-size={size}
                        data-disable-padding={disablePadding}
                    >
                        {content ?? props.children}
                    </td>
                </>
    }
) as OverridableComponent<DescriptionItemProps>