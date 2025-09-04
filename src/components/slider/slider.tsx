import {HTMLAttributes, ReactNode, memo, useEffect, useMemo, useRef, ComponentProps} from 'react'
import {clsx, isUnset, useControlled, GestureOptions, useDraggable, mergeComponentProps} from '../../utils'
import {classes, useStyle} from './slider.style'
import {ColorPropsValue, DivProps} from '../../types'
import {Tooltip, TooltipProps} from '../tooltip'
import {PopperRef} from '../popper'
import {useTheme} from '../theme'

export interface MarkItem extends DivProps {
    label?: ReactNode
    /**
     * label的位置
     * {@link SliderBaseProps.orientation}为`horizontal`时，默认为`bottom`
     * {@link SliderBaseProps.orientation}为`vertical`时，默认为`right`
     */
    labelPlacement?: 'top' | 'bottom' | 'left' | 'right'
    value: number
}

interface SliderBaseProps extends Omit<DivProps, 'defaultValue' | 'onChange' | 'prefix'> {
    color?: ColorPropsValue
    orientation?: 'horizontal' | 'vertical'
    /** variant只改变滑块的样式 */
    variant?: 'filled' | 'outlined'
    /** inset为true时，滑块整体会嵌入轨道，两侧都无法滑出轨道；否则会以滑块中心点为参考，两侧可能会超出轨道。默认为`false` */
    inset?: boolean
    /** 轨道 */
    railSize?: number
    railProps?: DivProps
    renderRail?(value: number, railProps: HTMLAttributes<HTMLDivElement>): ReactNode
    renderRail?(value: [number, number], railProps: HTMLAttributes<HTMLDivElement>): ReactNode
    /** 滑块 */
    handleSize?: number
    handleProps?: ComponentProps<'button'>
    /** 禁用默认的滑块外边框 */
    disableHandleOutline?: boolean
    /** 渲染滑块，range模式时，改方法会触发两次 */
    renderHandle?(value: number, handleProps: HTMLAttributes<HTMLElement>): ReactNode
    tooltipProps?: TooltipProps

    min?: number
    max?: number
    /** 滑块拖动每格的值，为null时必须配合marks使用，滑块只能在marks上 */
    step?: number | null
    marks?: MarkItem[]
    /** mark中的标签与滑动轨道的距离，默认为`6` */
    markLabelOffset?: number

    disableTrack?: boolean

    gestureOptions?: GestureOptions
}

export interface SliderSingleProps extends SliderBaseProps {
    defaultValue?: number
    value?: number
    onChange?(value: number): void
    prefix?: ReactNode | ((value: number) => ReactNode)
    suffix?: ReactNode | ((value: number) => ReactNode)
}

export interface SliderRangeProps extends SliderBaseProps {
    defaultValue?: [number, number]
    value?: [number, number]
    onChange?(value: [number, number]): void
    prefix?: ReactNode | ((value: [number, number]) => ReactNode)
    suffix?: ReactNode | ((value: [number, number]) => ReactNode)
}

export type SliderProps = SliderSingleProps | SliderRangeProps

export const Slider = memo(({
    color = 'primary',
    orientation = 'horizontal',
    variant = 'filled',
    inset,

    railSize = inset ? 14 : 4,
    railProps,
    renderRail,

    handleSize = 14,
    handleProps,
    disableHandleOutline,
    renderHandle,
    tooltipProps,

    min = 0,
    max = 100,
    step = 1,
    marks,
    markLabelOffset,
    prefix,
    suffix,
    disableTrack,
    gestureOptions,

    defaultValue = min,
    value,
    onChange,
    ...props
}: SliderProps) => {
    const {spacing} = useTheme()

    markLabelOffset ??= inset ? spacing[1] : spacing[2]

    const orderedMarks = useMemo(() => {
        return marks ? [...marks].sort((a, b) => a.value - b.value) : void 0
    }, [marks])

    // 处理value，让滑块在合理的位置
    const treatValue = (value: number | [number, number]) => {
        const fn = (value: number) => {
            value = Math.max(min, Math.min(max, value))
            if (typeof step === 'number') {
                // 算法：转成value，减去最小值，除以step，四舍五入，乘以step，加上最小值
                return Math.round((value - min) / step) * step + min
            }
            if (!marks?.length) {
                return value
            }
            // step为null时，滑块只能在mark上
            if (value <= orderedMarks![0].value) {
                return orderedMarks![0].value
            }
            if (value >= orderedMarks![orderedMarks!.length - 1].value) {
                return orderedMarks![orderedMarks!.length - 1].value
            }
            const betweenIndex = orderedMarks!.findIndex(mark => mark.value >= value)
            if (value - orderedMarks![betweenIndex - 1].value < orderedMarks![betweenIndex].value - value) {
                return orderedMarks![betweenIndex - 1].value
            }
            return orderedMarks![betweenIndex].value
        }
        return Array.isArray(value)
            ? value.slice(0, 2).sort((a, b) => a - b).map(fn)
            : fn(value)
    }

    const treatedDefaultValue = useMemo(() => {
        return treatValue(defaultValue)
    }, [])

    const treatedValue = useMemo(() => {
        return !isUnset(value) ? treatValue(value) : void 0
    }, [value])

    const [innerValue, _setInnerValue] = useControlled<any>(treatedDefaultValue, treatedValue, onChange)
    const setInnerValue = (value: number, index?: number) => {
        const newValue = treatValue(value) as number
        if (Array.isArray(innerValue.current)) {
            if (innerValue.current[index!] !== newValue) {
                innerValue.current[index!] = index
                    ? Math.max(innerValue.current[0], newValue)
                    : Math.min(innerValue.current[1], newValue)
                _setInnerValue([...innerValue.current])
            }
        } else {
            innerValue.current !== newValue && _setInnerValue(newValue)
        }
    }

    /**
     * -----------------------------------------------------------------
     * tooltip跟随滑块移动
     */

    const tooltipRefs = useRef<(PopperRef | null)[]>([])

    useEffect(() => {
        setTimeout(() => {
            tooltipRefs.current[dragStartData.current?.handleIndex || 0]?.fit()
        })
    }, [innerValue.current])

    /**
     * -----------------------------------------------------------------
     * 百分比与数值的相互转换
     */

    const valueToPercent = (value: number) => {
        return (value - min) / (max - min) * 100
    }

    const percentToValue = (percent: number) => {
        return (percent / 100) * (max - min) + min
    }

    /**
     * -----------------------------------------------------------------
     * 拖拽
     */

    const railRef = useRef<HTMLDivElement>(null)

    const handleRefs = useRef<(HTMLButtonElement | null)[]>([])

    const dragStartData = useRef<{
        // 正在拖拽的handle的index，两个handler时有效
        handleIndex: number
        railLength: number
        percent: number
    }>(void 0)

    const draggableHandles = useDraggable({
        ...gestureOptions,
        onDragStart(e) {
            gestureOptions?.onDragStart?.(e)
            const railLength = orientation === 'horizontal' ? railRef.current!.offsetWidth : railRef.current!.offsetHeight
            let handleIndex = 0
            let percent

            if (e.currentTarget === railRef.current) {
                // 点击轨道，需要直接滑动至点击处，并从点击处开始拖拽
                let offset
                if (orientation === 'horizontal') {
                    offset = e.clientX - railRef.current!.getBoundingClientRect().x

                    if (Array.isArray(innerValue.current)) {
                        const xArr = handleRefs.current.map(r => r!.getBoundingClientRect().x)
                        if (e.clientX <= xArr[0]) {
                            handleIndex = 0
                        } else if (e.clientX >= xArr[1]) {
                            handleIndex = 1
                        } else {
                            handleIndex = e.clientX - xArr[0] < xArr[1] - e.clientX ? 0 : 1
                        }
                    }
                } else {
                    const {y, height} = railRef.current!.getBoundingClientRect()
                    offset = y + height - e.clientY

                    if (Array.isArray(innerValue.current)) {
                        const yArr = handleRefs.current.map(r => r!.getBoundingClientRect().y)
                        if (e.clientY >= yArr[0]) {
                            handleIndex = 0
                        } else if (e.clientY <= yArr[1]) {
                            handleIndex = 1
                        } else {
                            handleIndex = yArr[0] - e.clientY < e.clientY - yArr[1] ? 0 : 1
                        }
                    }
                }
                percent = offset / railLength * 100
                setInnerValue(percentToValue(percent), handleIndex)
                setTimeout(() => {
                    handleRefs.current[handleIndex]!.focus()
                })
            } else {
                // 拖拽滑块
                if (Array.isArray(innerValue.current)) {
                    handleIndex = handleRefs.current.indexOf(e.currentTarget as HTMLButtonElement)
                    percent = valueToPercent(innerValue.current[handleIndex])
                } else {
                    percent = valueToPercent(innerValue.current)
                }
            }
            dragStartData.current = {railLength, percent, handleIndex}
        },
        onDrag(info, e) {
            gestureOptions?.onDrag?.(info, e)
            const {percent, railLength, handleIndex} = dragStartData.current!
            const delta = orientation === 'horizontal' ? info.diff[0] : -info.diff[1]
            setInnerValue(
                percentToValue(percent + delta / railLength * 100),
                handleIndex
            )
        }
    })

    /**
     * -----------------------------------------------------------------
     * 渲染滑块
     */

    const valueIsArray = Array.isArray(innerValue.current)

    const renderHandleFn = () => {
        const fn = (value: number, index: number = 0) => {
            const _handleProps = mergeComponentProps<'button'>(
                handleProps,
                {
                    key: index,
                    ref: r => {
                        handleRefs.current[index] = r
                    },
                    className: classes.handle,
                    style: {
                        width: handleSize,
                        height: handleSize,
                        ...orientation === 'horizontal'
                            ? {
                                top: '50%',
                                left: valueToPercent(value) + '%'
                            }
                            : {
                                bottom: valueToPercent(value) + '%',
                                left: '50%'
                            }
                    },
                    onPointerDown(e) {
                        e.stopPropagation()
                        draggableHandles.onPointerDown(e)
                    }
                }
            )
            return renderHandle
                ? renderHandle(value, _handleProps)
                : <Tooltip
                    title={valueIsArray ? innerValue.current[index] : innerValue.current}
                    trigger={['hover', 'focus']}
                    placement={orientation === 'horizontal' ? 'top' : 'left'}
                    {...tooltipProps}
                    key={index}
                    popperRef={r => {
                        if (r) {
                            tooltipRefs.current[index] = r
                        } else {
                            delete tooltipRefs.current[index]
                        }
                    }}
                >
                    <button {..._handleProps} key={index}/>
                </Tooltip>
        }
        return valueIsArray
            ? innerValue.current.map(fn)
            : fn(innerValue.current)
    }

    /**
     * -----------------------------------------------------------------
     * 渲染轨道
     */

    const renderRailFn = () => {
        const _railProps = mergeComponentProps(
            railProps,
            {
                ref: railRef,
                className: classes.rail,
                style: {
                    ...orientation === 'horizontal'
                        ? {
                            height: railSize,
                            [inset ? 'padding' : 'margin']: `0 ${handleSize / 2}px`
                        }
                        : {
                            width: railSize,
                            [inset ? 'padding' : 'margin']: `${handleSize / 2}px 0`
                        },
                },
                onPointerDown: draggableHandles.onPointerDown,
                children: (
                    <div className={classes.railWrap}>
                        {!disableTrack &&
                            <div
                                className={classes.track}
                                style={valueIsArray
                                    ? (
                                        orientation === 'horizontal'
                                            ? {
                                                width: valueToPercent(innerValue.current[1] - innerValue.current[0]) + '%',
                                                inset: `0 auto 0 ${valueToPercent(innerValue.current[0])}%`
                                            }
                                            : {
                                                height: valueToPercent(innerValue.current[1] - innerValue.current[0]) + '%',
                                                inset: `auto 0 ${valueToPercent(innerValue.current[0])}% 0`
                                            }
                                    )
                                    : (
                                        orientation === 'horizontal'
                                            ? {
                                                width: valueToPercent(innerValue.current) + '%',
                                                inset: '0 auto 0 0'
                                            }
                                            : {
                                                height: valueToPercent(innerValue.current) + '%',
                                                inset: 'auto 0 0 0'
                                            }
                                    )
                                }
                            >
                                {inset && !valueIsArray &&
                                    <div
                                        className={classes.trackCorner}
                                        style={orientation === 'horizontal'
                                            ? {
                                                width: -railSize / 2
                                            }
                                            : {bottom: -railSize / 2}
                                        }
                                    />
                                }
                            </div>
                        }
                        {marks?.map(({
                                value,
                                label,
                                labelPlacement = orientation === 'horizontal' ? 'bottom' : 'right',
                                ...m
                            }) =>
                                <div
                                    {...m}
                                    key={value}
                                    className={classes.mark}
                                    style={{
                                        ...orientation === 'horizontal'
                                            ? {
                                                height: inset ? '8px' : 'calc(100% + 4px)',
                                                top: '50%',
                                                left: `${valueToPercent(value)}%`
                                            }
                                            : {
                                                width: inset ? '8px' : 'calc(100% + 4px)',
                                                bottom: `${valueToPercent(value)}%`,
                                                left: '50%'
                                            },
                                        ...m.style
                                    }}
                                    data-active={valueIsArray
                                        ? innerValue.current[0] <= value && value <= innerValue.current[1]
                                        : innerValue.current >= value
                                    }
                                >
                                    <div
                                        className={classes.label}
                                        style={{
                                            ...labelPlacement === 'bottom'
                                                ? {
                                                    top: markLabelOffset + railSize / 2,
                                                    left: '50%',
                                                    transform: 'translateX(-50%)'
                                                }
                                                : {
                                                    top: '50%',
                                                    left: markLabelOffset + railSize / 2,
                                                    transform: 'translateY(-50%)'
                                                }
                                        }}
                                    >
                                        {label}
                                    </div>
                                </div>
                        )}
                        {renderHandleFn()}
                    </div>
                )
            }
        )
        return renderRail
            ? renderRail(innerValue.current, _railProps)
            : <div {..._railProps}/>
    }

    /**
     * -----------------------------------------------------------------
     * 渲染前后缀
     */

    const renderExtra = (prop: SliderProps['prefix' | 'suffix']) => {
        return typeof prop === 'function' ? prop(innerValue.current as any) : prop
    }

    return (
        <div
            {...props}
            css={useStyle({color: color || 'primary'})}
            className={clsx(classes.root, props.className)}
            data-orientation={orientation}
            data-variant={variant}
            data-inset={inset}
            data-disable-outline={disableHandleOutline}
        >
            {!!prefix &&
                <div className={classes.prefix}>{renderExtra(prefix)}</div>
            }
            {renderRailFn()}
            {!!suffix &&
                <div className={classes.suffix}>{renderExtra(suffix)}</div>
            }
        </div>
    )
})