import {ReactNode, Ref, memo, useMemo, ComponentProps} from 'react'
import {Popper, PopperProps, PopperRef} from '../popper'
import {InputBase} from '../inputBase'
import {classes, colorPickerPopperStyle, style} from './colorPicker.style'
import {clsx, colorTransfer, useControlled, useTouchSpread, mergeComponentProps} from '../../utils'
import {ColorPropsValue, DivProps, Size} from '../../types'
import {useTheme} from '../theme'
import {Palette} from '../palette'
import Color, {ColorInstance} from 'color'

export interface ColorPickerProps extends Omit<DivProps, 'defaultValue' | 'onChange'> {
    inputProps?: ComponentProps<'input'>
    popperProps?: PopperProps
    popperRef?: Ref<PopperRef>

    size?: Size
    shape?: 'square' | 'circular'
    label?: ReactNode
    presets?: (ColorPropsValue | ColorInstance)[]

    defaultOpen?: boolean
    open?: boolean
    onOpenChange?(open: boolean): void

    defaultValue?: ColorInstance
    value?: ColorInstance
    onChange?(color: ColorInstance): void
}

export const ColorPicker = memo(({
    inputProps,
    popperProps,
    popperRef,

    size,
    shape = 'square',
    label = '自定义',
    presets,

    defaultOpen,
    open,
    onOpenChange,

    defaultValue,
    value,
    onChange,

    ...props
}: ColorPickerProps) => {
    const theme = useTheme()

    size ??= theme.size

    const [innerValue, setInnerValue] = useControlled(defaultValue ?? Color(theme.colors.primary.main, 'hex'), value, onChange)

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-size={size}
            data-shape={shape}
        >
            {presets?.map((color, i) => {
                const colorInstance = Color(typeof color === 'string' ? colorTransfer(color, theme) : color)
                return (
                    <BlockItem
                        key={i}
                        selected={colorInstance.hex() === innerValue.current.hex()}
                        color={Color(color)}
                        onClick={() => setInnerValue(Color(color, 'hex'))}
                    />
                )
            })}
            <Popper
                css={colorPickerPopperStyle}
                defaultOpen={defaultOpen}
                open={open}
                onOpenChange={onOpenChange}
                trigger={['click', 'enter']}
                placement="bottomLeft"
                content={
                    <Palette
                        value={innerValue.current}
                        onChange={setInnerValue}
                    />
                }
                {...popperProps}
                popperRef={popperRef}
            >
                <InputBase<'input'>
                    className={classes.inputBase}
                    size={size}
                    shape={shape === 'circular' ? 'rounded' : shape}
                >
                    {inputBaseProps =>
                        <>
                            <BlockItem color={innerValue.current}/>
                            {!!label &&
                                <div className={classes.label}>{label}</div>
                            }
                            <input
                                {...mergeComponentProps<'input'>(inputProps, inputBaseProps)}
                                data-hidden="true"
                            />
                        </>
                    }
                </InputBase>
            </Popper>
        </div>
    )
})

function BlockItem({color, onClick, selected}: {
    color: ColorInstance
    onClick?(): void
    selected?: boolean
}) {
    const light = useMemo(() => color.luminosity() >= .8, [color])

    const colorObject = useMemo(() => ({
        hex: color.hex(),
        alpha: color.alpha()
    }), [color])

    const showSpread = useTouchSpread(light ? 'text.disabled' : colorObject.hex)

    return (
        <div
            className={classes.block}
            data-selected={selected}
            data-light={light}
            onClick={e => {
                onClick?.()
                showSpread(e.currentTarget)
            }}
        >
            <div
                className={classes.blockColor}
                style={{
                    backgroundColor: colorObject.hex,
                    opacity: colorObject.alpha
                }}
            />
        </div>
    )
}