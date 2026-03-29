import React, {ReactNode, memo} from 'react'
import {ColorPropsValue, DivProps, Id} from '../../types'
import {clsx, useColor} from '../../utils'
import {classes} from './tabs.style'
import {useTabsContext} from './tabs'
import {Button} from '../button'
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark'
import {Icon} from '../icon'
import {SortableItem} from '../sortableItem'
import {Collapse} from '../transitionBase'

export interface TabProps extends Omit<DivProps, 'prefix'> {
    prefix?: ReactNode
    suffix?: ReactNode
    /** color仅生效于激活状态，普通状态样式请使用css修改 */
    color?: ColorPropsValue
    orientation?: 'horizontal' | 'vertical'

    label?: ReactNode
    value: Id

    disabled?: boolean

    closable?: boolean
    onClose?: React.MouseEventHandler<HTMLButtonElement>

    /** 是否允许拖拽排序，默认为`false` */
    sortable?: boolean

    /** @private 内部使用，用于表示改选项卡是否为激活状态 */
    _active?: boolean
    /** @private */
    _index?: number
}

export const Tab = memo(({
    prefix,
    suffix,
    color,
    orientation,
    label,
    value,
    disabled,
    closable,
    onClose,
    sortable,
    _active,
    _index,
    ...props
}: TabProps) => {
    const context = useTabsContext()

    const colorValue = useColor(color ?? context.color)

    const _closable = closable ?? context.closable

    const closeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClose?.(e)
        context.onClose?.(value!)
    }

    const _sortable = sortable ?? context.sortable

    return (
        <SortableItem
            {...props}
            className={clsx(classes.tabWrapper, props.className)}
            component={Collapse}
            orientation="horizontal"
            id={value}
            index={_index!}
            disabled={!_sortable}
        >
            <div
                className={classes.tab}
                style={{
                    borderColor: context.variant === 'line' && !context.animating && _active ? colorValue : void 0,
                    color: _active ? colorValue : void 0,
                    ...props.style
                }}
                data-color={colorValue}
                data-disabled={disabled}
                data-orientation={orientation}
                data-active={_active}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    !disabled && props.onClick?.(e)
                }}
            >
                {!!prefix &&
                    <div className={classes.tabPrefix}>{prefix}</div>
                }
                <div className={classes.label}>{label}</div>
                {!!suffix &&
                    <div className={classes.tabSuffix}>{suffix}</div>
                }
                {_closable &&
                    <Button
                        className={classes.tabClose}
                        variant="text"
                        color="text.secondary"
                        onClick={closeHandler}
                    >
                        <Icon icon={faXmark}/>
                    </Button>
                }
            </div>
        </SortableItem>
    )
})