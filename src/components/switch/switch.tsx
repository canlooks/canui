import React, {ReactNode, memo, ComponentProps} from 'react'
import {ColorPropsValue, DivProps, Size} from '../../types'
import {classes, useStyle} from './switch.style'
import {useTheme} from '../theme'
import {clsx, useControlled} from '../../utils'

export interface SwitchProps extends Omit<DivProps, 'onChange'> {
    /** <Switch />内部使用<input />实现 */
    inputProps?: ComponentProps<'input'>

    color?: ColorPropsValue
    size?: Size
    /** 滑块 */
    thumbSize?: number
    thumbProps?: DivProps
    renderThumb?: ReactNode | ((checked: boolean, thumbProps: DivProps) => ReactNode)
    /** 轨道 */
    trackSize?: number
    trackProps?: DivProps
    renderTrack?: ReactNode | ((checked: boolean, trackProps: DivProps) => ReactNode)

    checkedLabel?: ReactNode
    unCheckedLabel?: ReactNode

    defaultChecked?: boolean
    checked?: boolean
    onChange?(checked: boolean): void

    readOnly?: boolean
    disabled?: boolean
}

export const Switch = memo(({
        inputProps,

        color = 'primary',
        size,
        thumbSize,
        thumbProps,
        renderThumb,
        trackSize,
        trackProps,
        renderTrack,
        checkedLabel,
        unCheckedLabel,
        defaultChecked = false,
        checked,
        onChange,
        readOnly,
        disabled,
        ...props
    }: SwitchProps) => {
        const theme = useTheme()

        size ??= theme.size
        trackSize ??= size === 'medium' ? 20
            : size === 'large' ? 24
                : 16

        thumbSize ??= trackSize - 4

        const edgePadding = trackSize > thumbSize ? 2 : 0

        const renderThumbFn = () => {
            const _thumbProps: DivProps = {
                ...thumbProps,
                className: clsx(classes.thumb, thumbProps?.className),
                style: {
                    width: thumbSize,
                    left: innerChecked.current
                        ? `calc(100% - ${thumbSize}px - ${edgePadding}px)`
                        : edgePadding,
                    ...thumbProps?.style
                }
            }
            if (!renderThumb) {
                return <div {..._thumbProps} />
            }
            if (typeof renderThumb === 'function') {
                return renderThumb(innerChecked.current, _thumbProps)
            }
            return renderThumb
        }

        const renderTrackFn = () => {
            const _trackProps: DivProps = {
                ...trackProps,
                className: clsx(classes.track, trackProps?.className),
                style: {
                    height: trackSize,
                    ...trackProps?.style
                },
                children: (
                    <>
                        {renderThumbFn()}
                        <div
                            className={classes.label}
                            style={{
                                lineHeight: trackSize + 'px',
                                ...innerChecked.current
                                    ? {
                                        paddingRight: thumbSize! + edgePadding * 2,
                                        marginLeft: '100%'
                                    }
                                    : {paddingLeft: thumbSize! + edgePadding * 2}
                            }}
                        >
                            <div
                                className={classes.checkedLabel}
                                style={{
                                    marginLeft: `calc(-100% - ${thumbSize}px - ${edgePadding * 2}px`,
                                    marginRight: `calc(100% + ${thumbSize}px + ${edgePadding * 2}px`
                                }}
                            >
                                {checkedLabel}
                            </div>
                            {!!unCheckedLabel &&
                                <div
                                    className={classes.uncheckedLabel}
                                    style={{marginTop: -trackSize!}}
                                >
                                    {unCheckedLabel}
                                </div>
                            }
                        </div>
                    </>
                )
            }
            if (!renderTrack) {
                return <div {..._trackProps} />
            }
            if (typeof renderTrack === 'function') {
                return renderTrack(innerChecked.current, _trackProps)
            }
            return renderTrack
        }

        const [innerChecked, setInnerChecked] = useControlled(defaultChecked, checked, onChange)

        const toggleChecked = () => {
            !readOnly && !disabled && setInnerChecked(o => !o)
        }

        const clickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
            props.onClick?.(e)
            toggleChecked()
        }

        const inputKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
            inputProps?.onKeyDown?.(e)
            e.key === 'Enter' && toggleChecked()
        }

        return (
            <div
                {...props}
                css={useStyle({color: color || 'primary'})}
                className={clsx(classes.root, props.className)}
                onClick={clickHandler}
                data-checked={innerChecked.current}
                data-read-only={readOnly}
                data-disabled={disabled}
            >
                {renderTrackFn()}
                <input
                    {...inputProps}
                    checked={innerChecked.current}
                    className={clsx(classes.input, inputProps?.className)}
                    onChange={e => inputProps?.onChange?.(e)}
                    onKeyDown={inputKeyDownHandler}
                />
            </div>
        )
    }
)