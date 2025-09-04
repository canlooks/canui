import {Children, ReactElement, ReactNode, cloneElement, isValidElement, memo} from 'react'
import {clsx} from '../../utils'
import {classes, style} from './breadcrumb.style'
import {Button, ButtonProps} from '../button'
import {useTheme} from '../theme'
import {DivProps, Obj} from '../../types'

export interface BreadcrumbItemProps extends ButtonProps, Obj {
    /** @alias ButtonProps.prefix */
    icon?: ReactNode
    label?: ReactNode
}

export interface BreadcrumbProps extends DivProps {
    separator?: ReactNode
    readOnly?: boolean
    items?: BreadcrumbItemProps[]
}

export const Breadcrumb = memo(({
    separator = '/',
    readOnly,
    items,
    ...props
}: BreadcrumbProps) => {
    const {text} = useTheme()

    const renderItems = () => {
        if (items) {
            return items.flatMap(({icon, ...p}, i) => {
                const isLast = i === items.length - 1
                return [
                    <Button
                        {...p}
                        key={p.key ?? i}
                        variant={p.variant ?? 'plain'}
                        color={p.color ?? (isLast ? text.primary : text.disabled)}
                        readOnly={p.readOnly ?? (isLast || readOnly)}
                        prefix={p.prefix ?? icon}
                    >
                        {p.children}
                    </Button>,
                    ...isLast ? [] : [
                        <span key={`${classes.separator}_${i}`} className={classes.separator}>{separator}</span>
                    ]
                ]
            })
        }
        const childrenArr = Children.toArray(props.children)
        return childrenArr.flatMap((c, i) => {
            const isLast = i === childrenArr.length - 1
            const ret = []
            if (isValidElement(c)) {
                const {props} = c as ReactElement<BreadcrumbItemProps>
                ret.push(
                    cloneElement(c as ReactElement<BreadcrumbItemProps>, {
                        variant: props.variant ?? 'plain',
                        color: props.color ?? (isLast ? text.primary : text.disabled),
                        readOnly: props.readOnly ?? (isLast || readOnly),
                        prefix: props.prefix ?? props.icon,
                    })
                )
            } else {
                ret.push(c)
            }
            !isLast && ret.push(
                <span key={`${classes.separator}_${i}`} className={classes.separator}>{separator}</span>
            )
            return ret
        })
    }

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            {renderItems()}
        </div>
    )
}) as any as {
    (props: BreadcrumbProps): ReactElement
    Item: typeof Button
}

Breadcrumb.Item = Button