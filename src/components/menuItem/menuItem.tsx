import React, {Children, ReactElement, ReactNode, cloneElement, isValidElement, memo} from 'react'
import {ColorPropsValue, DivProps, Size} from '../../types'
import {menuListPadding, childrenStyle, classes, paddingHorizontal, useStyle} from './menuItem.style'
import {clsx, isUnset, toArray, useControlled} from '../../utils'
import {Checkbox, CheckboxProps} from '../checkbox'
import {usePopperContext} from '../popper'
import {useMenuContext} from '../menu'
import {Collapse} from '../transitionBase'
import {Icon} from '../icon'
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown'

export interface MenuItemProps extends Omit<DivProps, 'prefix'> {
    value?: string | number
    size?: Size
    color?: ColorPropsValue
    /**
     * 是否强调颜色，默认为`false`
     * 如果设置有{@link color}，建议同时设置emphasized为true
     */
    emphasized?: boolean
    selected?: boolean
    focused?: boolean
    disabled?: boolean
    showCheckbox?: boolean
    checkboxProps?: CheckboxProps
    ellipsis?: boolean
    prefix?: ReactNode
    label?: ReactNode
    suffix?: ReactNode
    /** 当label不为string时，该字段会取代label用来搜索 */
    searchToken?: string
    /**
     * 若指定为`true`，则弹框打开时会自动滚动到该选项，默认为`false`
     */
    scrollHere?: boolean

    /** @private 内部使用，缩进的层级 */
    _level?: number
    indent?: number
    expandIcon?: ReactNode | ((expanded: boolean) => ReactNode)
    defaultExpanded?: boolean
    expanded?: boolean
    onExpandedChange?(expanded: boolean): void
}

export const MenuItem = memo(({
    value,
    size,
    color = 'primary',
    emphasized = false,
    selected,
    focused = false,
    disabled = false,
    showCheckbox,
    checkboxProps,
    ellipsis,
    prefix,
    label,
    suffix,
    searchToken,

    _level = 0,
    indent,
    expandIcon,
    defaultExpanded = false,
    expanded,
    onExpandedChange,
    ...props
}: MenuItemProps) => {
    const context = useMenuContext()

    size ??= context.size!
    showCheckbox ??= context.showCheckbox
    ellipsis ??= context.ellipsis!
    indent ??= context.indent!

    if (context.inMenu && !isUnset(value)) {
        expanded ??= context.expandedSet?.has(value)
        const oldOnExpandedChange = onExpandedChange
        onExpandedChange = exp => {
            oldOnExpandedChange?.(exp)
            context.setExpanded!(value, exp)
        }
        selected ??= toArray<any>(context.selected)?.includes(value)
    }

    const {autoClose, setOpen} = usePopperContext()

    const [innerExpanded, setInnerExpanded] = useControlled(defaultExpanded, expanded, onExpandedChange)

    const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) {
            return
        }
        props.onClick?.(e)
        props.children
            ? setInnerExpanded(o => !o)
            : !isUnset(value) && context.toggleSelected?.(value)
        autoClose && setOpen(false)
    }

    const renderExpandIcon = () => {
        if (!props.children) {
            return
        }
        if (!expandIcon) {
            return (
                <div className={classes.arrow} data-open={innerExpanded.current}>
                    <Icon icon={faChevronDown}/>
                </div>
            )
        }
        if (typeof expandIcon === 'function') {
            return expandIcon(innerExpanded.current)
        }
        return expandIcon
    }

    return (
        <>
            <div
                {...props}
                css={useStyle({color: color || 'primary'})}
                className={clsx(classes.root, props.className)}
                style={{
                    paddingLeft: _level > 0
                        ? _level * indent + paddingHorizontal[size] - menuListPadding
                        : void 0,
                    ...props.style
                }}
                data-size={size}
                data-emphasized={emphasized}
                data-selected={selected}
                data-focused={focused}
                data-disabled={disabled}
                data-ellipsis={ellipsis}
                onClick={clickHandler}
            >
                {showCheckbox &&
                    <div className={classes.checkbox}>
                        <Checkbox checked={selected} {...checkboxProps}/>
                    </div>
                }
                {!!prefix &&
                    <div className={classes.prefix}>{prefix}</div>
                }
                <div className={classes.content}>{label}</div>
                {!!suffix &&
                    <div className={classes.suffix}>{suffix}</div>
                }
                {renderExpandIcon()}
            </div>
            {!!props.children &&
                <Collapse css={childrenStyle} className={classes.children} in={innerExpanded.current}>
                    <div className={classes.childrenWrap}>
                        {Children.map(props.children, child =>
                            isValidElement(child)
                                ? cloneElement(child as ReactElement<MenuItemProps>, {
                                    _level: _level + 1
                                })
                                : child
                        )}
                    </div>
                </Collapse>
            }
        </>
    )
})