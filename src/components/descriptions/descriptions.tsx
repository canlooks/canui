import {Children, ReactElement, ReactNode, createContext, isValidElement, memo, useContext, useMemo, ElementType, ComponentPropsWithRef} from 'react'
import {Obj, ResponsiveProp, Size} from '../../types'
import {Grid, GridProps} from '../grid'
import {DescriptionItem, DescriptionItemProps} from './descriptionItem'
import {clsx, useResponsiveValue} from '../../utils'
import {classes, tableStyle} from './descriptions.style'
import {useTheme} from '../theme'

// grid, table, 与context都共有的属性，form组件也会继承
export type DescriptionsSharedProps = {
    size?: Size
    /** 标签的宽度,grid模式有效 */
    labelWidth?: string | number
    colon?: ReactNode
    /** 标签的位置，table模式下仅支持`left`与`top`, 默认为`left` */
    labelPlacement?: 'top' | 'bottom' | 'left' | 'right'
    /** 是否禁用margin,{@link DescriptionsProps.variant}为grid有效  */
    disableMargin?: boolean
    /** 是否禁用padding,{@link DescriptionsProps.variant}为table有效 */
    disablePadding?: boolean
}

interface DescriptionsBaseProps extends DescriptionsSharedProps {
    items?: (DescriptionItemProps & Obj)[]
    /**
     * @private 用于渲染item的组件，通常为内部使用
     * 默认为`DescriptionItem` {@link DescriptionItem}
     */
    itemComponent?: ElementType
}

interface DescriptionsGridProps extends DescriptionsBaseProps, GridProps {
    variant?: 'grid'
}

interface DescriptionsTableProps extends DescriptionsBaseProps, ComponentPropsWithRef<'table'> {
    variant: 'table'
    columnCount?: ResponsiveProp
}

export type DescriptionsProps = DescriptionsGridProps | DescriptionsTableProps

interface DescriptionsContext extends DescriptionsSharedProps {
    variant?: 'grid' | 'table'
}

export function useDescriptionsContext() {
    return useContext(DescriptionsContext)
}

const DescriptionsContext = createContext<DescriptionsContext>({})

export const Descriptions = memo(
    ({
        size,
        labelWidth,
        colon = ':',
        labelPlacement = 'left',
        disableMargin,
        disablePadding,
        items,
        itemComponent: ItemComponent = DescriptionItem,
        variant = 'grid',
        columnCount = 3,
        ...props
    }: DescriptionsProps) => {
        const theme = useTheme()

        size ??= theme.size

        const contextValue = useMemo(() => ({
            size, labelWidth, colon, labelPlacement, disableMargin, disablePadding, variant
        }), [
            size, labelWidth, colon, labelPlacement, disableMargin, disablePadding, variant
        ])

        const renderGridItems = () => {
            return items?.map((itemProps, i) =>
                <ItemComponent
                    // 最后一项沾满剩余行空间
                    flex={i === items.length - 1 ? 1 : void 0}
                    {...itemProps}
                    key={itemProps.key ?? i}
                />
            ) || props.children
        }

        const columnCountNum = useResponsiveValue(columnCount, variant === 'grid')

        const renderTableItems = () => {
            const actualItems = items || Children.map(props.children, c => isValidElement(c) ? c.props : c)
            if (actualItems?.length) {
                const rows: ReactElement[][] = []
                for (let i = 0, {length} = actualItems; i < length; i++) {
                    const cols = rows[Math.floor(i / columnCountNum.current)] ||= []
                    const itemProps = actualItems[i] as DescriptionItemProps & Obj

                    cols.push(
                        <ItemComponent
                            {...itemProps}
                            key={itemProps.key ?? i}
                            // 最后一项沾满剩余行空间
                            span={i === actualItems.length - 1 ? columnCountNum.current - i % columnCountNum.current : itemProps.span}
                            className={clsx(classes.col, itemProps)}
                        />
                    )
                }
                return rows.map((r, i) => <tr key={i}>{r}</tr>)
            }
            return null
        }

        const {spacing} = useTheme()

        const style = tableStyle()

        return variant === 'grid'
            ? <Grid
                columnGap={spacing[6]}
                {...props}
                className={clsx(classes.root, props.className)}
                columnCount={columnCount}
                data-variant={variant}
            >
                <DescriptionsContext value={contextValue}>
                    {renderGridItems()}
                </DescriptionsContext>
            </Grid>
            : <table
                {...props as DescriptionsTableProps}
                css={style}
                className={clsx(classes.root, props.className)}
                data-size={size}
                data-variant={variant}
            >
                <tbody>
                <DescriptionsContext value={contextValue}>
                    {renderTableItems()}
                </DescriptionsContext>
                </tbody>
            </table>
    }
) as any as {
    (props: DescriptionsProps): ReactElement
    Item: typeof DescriptionItem
}

Descriptions.Item = DescriptionItem