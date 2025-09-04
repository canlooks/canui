import React, {CSSProperties, Children, ReactElement, cloneElement, isValidElement, memo, useEffect, useRef, useState} from 'react'
import {ColorPropsValue, DivProps, Id, Obj, Size} from '../../types'
import {classes, useStyle} from './segmented.style'
import {clsx, cloneRef, isUnset, useControlled, useDerivedState} from '../../utils'
import {SegmentedOption, SegmentedOptionProps} from './SegmentedOption'
import {useTheme} from '../theme'

export type ISegmentedOption = SegmentedOptionProps & Obj

export interface SegmentedProps<O extends ISegmentedOption, V extends Id = Id> extends Omit<DivProps, 'defaultValue' | 'onChange'> {
    options?: O[]
    orientation?: 'horizontal' | 'vertical'
    size?: Size
    labelKey?: keyof O
    primaryKey?: keyof O
    fullWidth?: boolean
    /** 指示器的颜色，默认为`background.content` */
    indicatorColor?: ColorPropsValue

    defaultValue?: V
    value?: V
    onChange?(value: V): void

    readOnly?: boolean
    disabled?: boolean
}

export const Segmented = memo(<O extends ISegmentedOption, V extends Id = Id>({
    options,
    orientation = 'horizontal',
    size,
    labelKey = 'label',
    primaryKey = 'value',
    fullWidth,
    indicatorColor = 'background.content',
    defaultValue,
    value,
    onChange,
    readOnly,
    disabled,
    ...props
}: SegmentedProps<O, V>) => {
    const theme = useTheme()

    size ??= theme.size

    const [animating, setAnimating] = useState(false)

    const [innerValue, _setInnerValue] = useControlled(defaultValue, value, onChange)
    const setInnerValue = (value: V) => {
        if (!readOnly && !disabled) {
            setAnimating(true)
            _setInnerValue(value)
        }
    }

    const optionRefs = useRef(new Map<Id, HTMLDivElement | null>())

    /**
     * 计算指示器的位置
     */
    const fitIndicatorRect = () => {
        const activeOption = !isUnset(innerValue.current) && optionRefs.current.get(innerValue.current)
        if (activeOption) {
            return {
                width: activeOption.offsetWidth,
                height: activeOption.offsetHeight,
                left: activeOption.offsetLeft,
                top: activeOption.offsetTop
            }
        }
        return {
            width: 0,
            height: 0,
            left: 0,
            top: 0
        }
    }

    const [indicatorRect, setIndicatorRect] = useDerivedState<CSSProperties>(fitIndicatorRect, [innerValue.current])

    useEffect(() => {
        // 仅首次渲染需要计算
        setIndicatorRect(fitIndicatorRect())
    }, [])

    const renderOptions = () => {
        if (options) {
            return options.map((p, i) => {
                const v = p[primaryKey]
                const active = !isUnset(v) && v === innerValue.current
                return (
                    <SegmentedOption
                        {...p}

                        key={p.key ?? v ?? i}
                        ref={r => {
                            r
                                ? optionRefs.current.set(v, r)
                                : optionRefs.current.delete(v)
                        }}
                        value={v}
                        label={p[labelKey]}
                        onClick={e => {
                            p.onClick?.(e)
                            setInnerValue(v)
                        }}
                        data-active={active}
                    />
                )
            })
        }

        return Children.map(props.children as ReactElement<SegmentedOptionProps>, c => {
            if (isValidElement(c)) {
                const {value} = c.props
                const active = !isUnset(value) && value === innerValue.current
                return cloneElement(c as any, {
                    ref: cloneRef((c as any).ref, (r: HTMLDivElement | null) => {
                        !isUnset(value) && optionRefs.current.set(value, r)
                    }),
                    onClick(e: React.MouseEvent<HTMLDivElement>) {
                        c.props.onClick?.(e)
                        !isUnset(value) && setInnerValue(value as V)
                    },
                    'data-active': active
                })
            }
            return c
        })
    }

    return (
        <div
            {...props}
            css={useStyle({indicatorColor})}
            className={clsx(classes.root, props.className)}
            data-full-width={fullWidth}
            data-animating={animating}
            data-orientation={orientation}
            data-size={size}
            data-read-only={readOnly}
            data-disabled={disabled}
        >
            <div
                className={classes.indicator}
                onTransitionEnd={() => setAnimating(false)}
                style={indicatorRect.current}
            />
            {renderOptions()}
        </div>
    )
}) as any as {
    <O extends ISegmentedOption, V extends Id = Id>(props: SegmentedProps<O, V>): ReactElement
    Option: typeof SegmentedOption
}

Segmented.Option = SegmentedOption