import {ReactNode, memo} from 'react'
import {ColorPropsValue, DivProps, Id} from '../../types'
import {clsx, useColor} from '../../utils'
import {classes} from './tabs.style'
import {useTabsContext} from './tabs'

export interface TabProps extends Omit<DivProps, 'prefix'> {
    prefix?: ReactNode
    suffix?: ReactNode
    /** color仅生效于激活状态，普通状态样式请使用css修改 */
    color?: ColorPropsValue
    orientation?: 'horizontal' | 'vertical'

    label?: ReactNode
    value?: Id

    disabled?: boolean

    /** @private 内部使用，用于表示改选项卡是否为激活状态 */
    _active?: boolean
}

export const Tab = memo(({
    prefix,
    suffix,
    color,
    orientation,
    label,
    value,
    disabled,
    _active,
    ...props
}: TabProps) => {
    const {color: contextColor, variant, animating} = useTabsContext()

    const colorValue = useColor(color ?? contextColor)

    return (
        <div
            {...props}
            className={clsx(classes.tab, props.className)}
            style={{
                borderColor: variant === 'line' && !animating && _active ? colorValue : void 0,
                color: _active ? colorValue : void 0,
                ...props.style
            }}
            data-color={colorValue}
            data-disabled={disabled}
            data-orientation={orientation}
            data-active={_active}
            onClick={e => {
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
        </div>
    )
})