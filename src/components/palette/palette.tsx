import {memo, useEffect, useMemo, useRef, useState} from 'react'
import {DivProps} from '../../types'
import {classes, style} from './palette.style'
import {clsx, GestureOptions, range, useControlled, useDraggable} from '../../utils'
import {useTheme} from '../theme'
import {Slider, SliderSingleProps} from '../slider'
import Color, {ColorInstance} from 'color'
import {Button} from '../button'
import {ColorValueInput} from './colorValueInput'
import {Icon} from '../icon'
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown'

export interface PaletteProps extends Omit<DivProps, 'defaultValue' | 'onChange'> {
    defaultValue?: ColorInstance
    value?: ColorInstance
    onChange?(value: ColorInstance): void

    gestureOptions?: GestureOptions
}

const sliderProps: SliderSingleProps = {
    railSize: 9,
    handleSize: 9,
    variant: 'outlined',
    inset: true,
    disableTrack: true,
    tooltipProps: {disabled: true}
}

const availableFormat = ['HEX', 'RGB', 'HSL', 'CMYK']

export const Palette = memo(({
    defaultValue,
    value,
    onChange,
    gestureOptions,
    ...props
}: PaletteProps) => {
    const {colors} = useTheme()

    const [innerValue, setInnerValue] = useControlled(defaultValue ?? Color(colors.primary.main, 'hex'), value, onChange)

    const colorObject = useMemo(() => {
        return {
            hue: innerValue.current.hue(),
            hex: innerValue.current.hex(),
            alpha: innerValue.current.alpha(),
            saturated: innerValue.current.saturationl(100).lightness(50).hex()
        }
    }, [innerValue.current])

    const hueChangeHandler = (percent: number) => {
        setInnerValue(innerValue.current.hue(percent / 100 * 359))
    }

    const alphaChangeHandler = (percent: number) => {
        setInnerValue(innerValue.current.alpha(percent / 100))
    }

    /**
     * -----------------------------------------------------------------
     * 色板拖拽滑块
     */

    const paletteRef = useRef<HTMLDivElement>(null)

    const [handlePosition, _setHandlePosition] = useState([0, 0])

    const setHandlePosition = (left: number, top: number, hue: number) => {
        const newTop = range(top, 0, 100)
        const newLeft = range(left, 0, 100)
        _setHandlePosition([newLeft, newTop])
        setInnerValue(
            innerValue.current.black(newTop).saturationv(newLeft).hue(hue)
        )
        return [newLeft, newTop]
    }

    const draggableHandles = useDraggable({
        ...gestureOptions,
        onDragStart(e) {
            gestureOptions?.onDragStart?.(e)
            const paletteWidth = paletteRef.current!.clientWidth
            const paletteHeight = paletteRef.current!.clientHeight
            const {hue} = colorObject
            let startPosition = handlePosition
            if (e.currentTarget === paletteRef.current) {
                // 直接点击调色板，立即移动滑块位置
                const {x, y} = paletteRef.current!.getBoundingClientRect()
                startPosition = setHandlePosition((e.clientX - x) / paletteWidth * 100, (e.clientY - y) / paletteHeight * 100, hue)
            }
            return {
                left: startPosition[0],
                top: startPosition[1],
                paletteWidth,
                paletteHeight,
                hue
            }
        },
        onDrag(info, e) {
            gestureOptions?.onDrag?.(info, e)
            const {top, left, paletteWidth, paletteHeight, hue} = info.data
            setHandlePosition(left + info.diff[0] / paletteWidth * 100, top + info.diff[1] / paletteHeight * 100, hue)
        }
    })

    const fitHandlePosition = () => {
        _setHandlePosition([innerValue.current.saturationv(), innerValue.current.black()])
    }

    useEffect(fitHandlePosition, [])

    /**
     * -----------------------------------------------------------------
     * 输入框
     */

    const [activeFormat, setActiveFormat] = useState(0)

    const formatChangeHandler = () => {
        setActiveFormat(o => (o + 1) % availableFormat.length)
    }

    const renderInputs = () => {
        const commonAlphaItem = (
            <ColorValueInput
                label="A"
                min={0}
                max={100}
                value={Math.round(colorObject.alpha * 100 * 10) / 10}
                onChange={v => alphaChangeHandler(+v)}
            />
        )

        return (
            <div className={classes.inputsWrap}>
                {(() => {
                    switch (activeFormat) {
                        case 0: // HEX
                            return (
                                <ColorValueInput
                                    data-wide="true"
                                    hex
                                    label="HEX"
                                    value={colorObject.hex}
                                    onChange={v => setInnerValue(innerValue.current.hex(v))}
                                />
                            )
                        case 1: // RGB
                            return (
                                <>
                                    <ColorValueInput
                                        label="R"
                                        min={0}
                                        max={255}
                                        value={innerValue.current.red().toFixed()}
                                        onChange={v => setInnerValue(innerValue.current.red(+v))}
                                    />
                                    <ColorValueInput
                                        label="G"
                                        min={0}
                                        max={255}
                                        value={innerValue.current.green().toFixed()}
                                        onChange={v => setInnerValue(innerValue.current.green(+v))}
                                    />
                                    <ColorValueInput
                                        label="B"
                                        min={0}
                                        max={255}
                                        value={innerValue.current.blue().toFixed()}
                                        onChange={v => setInnerValue(innerValue.current.blue(+v))}
                                    />
                                </>
                            )
                        case 2: // HSL
                            return (
                                <>
                                    <ColorValueInput
                                        label="H"
                                        min={0}
                                        max={255}
                                        value={colorObject.hue.toFixed()}
                                        onChange={v => setInnerValue(innerValue.current.hue(+v))}
                                    />
                                    <ColorValueInput
                                        label="S"
                                        min={0}
                                        max={255}
                                        value={innerValue.current.saturationl().toFixed()}
                                        onChange={v => setInnerValue(innerValue.current.saturationl(+v))}
                                    />
                                    <ColorValueInput
                                        label="L"
                                        min={0}
                                        max={255}
                                        value={innerValue.current.lightness().toFixed()}
                                        onChange={v => setInnerValue(innerValue.current.lightness(+v))}
                                    />
                                </>
                            )
                        case 3: // CMYK
                            return (
                                <>
                                    <ColorValueInput
                                        label="C"
                                        min={0}
                                        max={255}
                                        value={innerValue.current.cyan().toFixed()}
                                        onChange={v => setInnerValue(innerValue.current.cyan(+v))}
                                    />
                                    <ColorValueInput
                                        label="M"
                                        min={0}
                                        max={255}
                                        value={innerValue.current.magenta().toFixed()}
                                        onChange={v => setInnerValue(innerValue.current.magenta(+v))}
                                    />
                                    <ColorValueInput
                                        label="Y"
                                        min={0}
                                        max={255}
                                        value={innerValue.current.yellow().toFixed()}
                                        onChange={v => setInnerValue(innerValue.current.yellow(+v))}
                                    />
                                    <ColorValueInput
                                        label="K"
                                        min={0}
                                        max={255}
                                        value={innerValue.current.black().toFixed()}
                                        onChange={v => setInnerValue(innerValue.current.black(+v))}
                                    />
                                </>
                            )
                        default:
                            return null
                    }
                })()}
                {commonAlphaItem}
            </div>
        )
    }

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            <div
                ref={paletteRef}
                className={classes.main}
                style={{backgroundImage: `linear-gradient(90deg, #ffffff, ${colorObject.saturated})`}}
                {...draggableHandles}
            >
                <div className={classes.mask}/>
                <div
                    className={classes.handle}
                    style={{
                        left: handlePosition[0] + '%',
                        top: handlePosition[1] + '%'
                    }}
                    {...draggableHandles}
                />
            </div>
            <div className={classes.slidersRow}>
                <div className={classes.sliders}>
                    <Slider
                        {...sliderProps}
                        className={classes.hue}
                        value={colorObject.hue / 359 * 100}
                        onChange={hueChangeHandler}
                    />
                    <Slider
                        {...sliderProps}
                        className={classes.alpha}
                        renderRail={(_, railProps) =>
                            <div {...railProps}>
                                {railProps.children}
                                <div
                                    className={classes.alphaMask}
                                    style={{backgroundImage: `linear-gradient(90deg, transparent, ${colorObject.saturated})`}}
                                />
                            </div>
                        }
                        value={colorObject.alpha * 100}
                        onChange={alphaChangeHandler}
                    />
                </div>
                <div className={classes.preview}>
                    <div
                        className={classes.previewColor}
                        style={{
                            backgroundColor: colorObject.hex,
                            opacity: colorObject.alpha
                        }}
                    />
                </div>
            </div>
            <div className={classes.inputRow}>
                <Button
                    variant="plain"
                    color="text.secondary"
                    suffix={<Icon icon={faChevronDown}/>}
                    onClick={formatChangeHandler}
                >
                    {availableFormat[activeFormat]}
                </Button>
                {renderInputs()}
            </div>
        </div>
    )
})