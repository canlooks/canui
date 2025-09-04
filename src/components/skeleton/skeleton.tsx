import {ReactElement, memo, ComponentProps} from 'react'
import {DivProps} from '../../types'
import {clsx} from '../../utils'
import {articalStyle, classes, style, tableStyle} from './skeleton.style'

type SkeletonSharedProps = {
    /** 默认为`rounded` */
    variant?: 'circular' | 'rectangular' | 'rounded'
    /** 是否播放动画，默认为`true` */
    animation?: boolean
}

export interface SkeletonProps extends SkeletonSharedProps, DivProps {
    width?: string | number
    height?: string | number
}

export const Skeleton = memo(({
    variant = 'rounded',
    animation = true,
    width,
    height,
    ...props
}: SkeletonProps) => {
    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            style={{
                width,
                height,
                ...props.style
            }}
            data-variant={variant}
            data-animation={animation}
        >
            {!!props.children &&
                <div className={classes.children}>{props.children}</div>
            }
        </div>
    )
}) as any as {
    (props: SkeletonProps): ReactElement
    Card: typeof SkeletonCard
    Table: typeof SkeletonTable
}

export interface SkeletonCardProps extends SkeletonSharedProps, DivProps {
    /** 默认为false */
    showAvatar?: boolean
    /** 默认为true */
    showTitle?: boolean
    /** 默认为3 */
    rows?: number
}

export const SkeletonCard = memo(({
    showAvatar,
    showTitle = true,
    rows = 3,
    variant = 'rounded',
    animation = true,
    ...props
}: SkeletonCardProps) => {
    const commonProps = {variant, animation}

    return (
        <div
            {...props}
            css={articalStyle}
            className={clsx(classes.artical, props.className)}
        >
            {showAvatar &&
                <div className={classes.avatar}>
                    <Skeleton variant="circular"/>
                </div>
            }
            <div className={classes.text}>
                {showTitle &&
                    <Skeleton
                        {...commonProps}
                        style={{
                            width: '80%',
                            height: 24,
                            margin: '4px 0 2em'
                        }}
                    />
                }
                {Array(rows).fill(void 0).map((_, i) =>
                    <Skeleton
                        {...commonProps}
                        key={i}
                        style={i === rows - 1 ? {width: '60%'} : void 0}
                    />
                )}
            </div>
        </div>
    )
})

Skeleton.Card = SkeletonCard

export interface SkeletonTableProps extends SkeletonSharedProps, Partial<ComponentProps<'table'>> {
    columns?: number
    rows?: number
}

export const SkeletonTable = memo(({
    columns = 3,
    rows = 4,
    variant = 'rounded',
    animation = true,
    ...props
}: SkeletonTableProps) => {
    const commonProps = {variant, animation}

    const renderCols = () => {
        return Array(columns).fill(void 0).map((_, i) =>
            <td key={i}>
                <Skeleton {...commonProps} />
            </td>
        )
    }

    const renderRows = () => {
        return Array(rows).fill(void 0).map((_, i) =>
            <tr key={i}>
                {renderCols()}
            </tr>
        )
    }

    return (
        <table
            {...props}
            css={tableStyle}
            className={clsx(classes.table, props.className)}
        >
            <tbody>
            {renderRows()}
            </tbody>
        </table>
    )
})

Skeleton.Table = SkeletonTable