import {ReactNode} from 'react'
import {DivProps, Size} from '../../types'
import {classes, style} from './accordion.style'
import {clsx, useControlled} from '../../utils'
import {useTheme} from '../theme'
import {Collapse} from '../transitionBase'
import {Icon} from '../icon'
import {faCaretRight} from '@fortawesome/free-solid-svg-icons'

export interface AccordionProps extends Omit<DivProps, 'title' | 'prefix'> {
    size?: Size
    title?: ReactNode
    prefix?: ReactNode
    suffix?: ReactNode

    /**
     * 展开图标的位置，默认为`left`
     */
    expandIconPlacement?: 'left' | 'right'
    expandIcon?: ReactNode | ((expanded: boolean) => ReactNode)
    defaultExpanded?: boolean
    expanded?: boolean
    onExpandedChange?(expanded: boolean): void

    readOnly?: boolean
    disabled?: boolean
}

export function Accordion({
    size,
    title,
    prefix,
    suffix,
    expandIconPlacement = 'left',
    expandIcon,
    defaultExpanded = false,
    expanded,
    onExpandedChange,
    readOnly,
    disabled,
    ...props
}: AccordionProps) {
    const theme = useTheme()

    size ??= theme.size

    const [innerExpanded, setInnerExpanded] = useControlled(defaultExpanded, expanded, onExpandedChange)

    const toggleExpanded = () => {
        !readOnly && !disabled && setInnerExpanded(o => !o)
    }

    const renderExpandIcon = () => {
        if (!expandIcon) {
            return <Icon icon={faCaretRight} className={classes.expandIcon}/>
        }
        if (typeof expandIcon === 'function') {
            return expandIcon(innerExpanded.current)
        }
        return expandIcon
    }

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-size={size}
            data-expanded={innerExpanded.current}
            data-read-only={readOnly}
            data-disabled={disabled}
        >
            <div
                className={classes.titleRow}
                style={{
                    flexDirection: expandIconPlacement === 'right' ? 'row-reverse' : 'row'
                }}
                onClick={toggleExpanded}
            >
                {renderExpandIcon()}
                <div className={classes.titleContentWrapper}>
                    {!!prefix && <div className={classes.prefix}>{prefix}</div>}
                    <div className={classes.title}>
                        {title}
                    </div>
                    {!!suffix && <div className={classes.suffix}>{suffix}</div>}
                </div>
            </div>
            {!!props.children &&
                <Collapse in={innerExpanded.current}>
                    <div className={classes.content}>
                        {props.children}
                    </div>
                </Collapse>
            }
        </div>
    )
}