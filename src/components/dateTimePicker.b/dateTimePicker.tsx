import React, {ComponentProps, createContext, memo, useContext, useEffect, useMemo, useRef} from 'react'
import {Popper, PopperProps} from '../popper'
import {InputBase, InputBaseProps} from '../inputBase'
import {useControlled, mergeComponentProps} from '../../utils'
import {classes, datePickerPopperStyle, style} from './dateTimePicker.style'
import dayjs, {Dayjs} from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {Calendar} from '../calendar'
import {Timer} from './timer'
import {Icon} from '../icon'
import {faCalendar} from '@fortawesome/free-regular-svg-icons/faCalendar'
import {faClock} from '@fortawesome/free-regular-svg-icons/faClock'

dayjs.extend(customParseFormat)

export type DatePickerSharedProps = {
    min?: Dayjs
    max?: Dayjs
    disabledHours?: (date: Dayjs, hours: number) => any
    disabledMinutes?: (date: Dayjs, minutes: number) => any
    disabledSeconds?: (date: Dayjs, seconds: number) => any
}

export interface DateTimePickerProps extends DatePickerSharedProps,
    Omit<InputBaseProps<'input'>, 'children' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max'> {

    inputProps?: ComponentProps<'input'>
    popperProps?: PopperProps

    defaultOpen?: boolean
    open?: boolean
    onOpenChange?(open: boolean): void
    autoClose?: boolean

    format?: string
    defaultValue?: Dayjs | null
    value?: Dayjs | null
    onChange?(value: Dayjs | null): void

    disabledDates?: (date: Dayjs) => any
}

const availableFormatTokens = ['Y', 'M', 'D', 'H', 'm', 's'] as const

const DateTimePickerContext = createContext<DatePickerSharedProps>({})

export function useDateTimePickerContext() {
    return useContext(DateTimePickerContext)
}

export const DateTimePicker = memo(({
    inputProps,
    popperProps,

    min,
    max,
    disabledDates,
    disabledHours,
    disabledMinutes,
    disabledSeconds,

    format = 'YYYY-MM-DD',
    defaultValue = null,
    value,
    onChange,

    defaultOpen = false,
    open,
    onOpenChange,
    autoClose = !/[Hms]/.test(format),

    ...props
}: DateTimePickerProps) => {
    const innerInputRef = useRef<HTMLInputElement>(null)

    const focused = useRef(false)

    const [innerOpen, _setInnerOpen] = useControlled(defaultOpen, open, onOpenChange)
    const setInnerOpen = (open: boolean) => {
        // 如果仍聚焦在输入框，则不用关闭弹框
        (open || !focused.current) && _setInnerOpen(open)
    }

    useEffect(() => {
        if (!innerOpen.current && !dateValue.current) {
            // 弹框关闭时没有选中日期，清空输入框
            innerInputRef.current!.value = format
        }
    }, [innerOpen.current])

    const [dateValue, _setDateValue] = useControlled(defaultValue, value, onChange)
    const setDateValue = (date: Dayjs | null) => {
        _setDateValue(date)
        autoClose && _setInnerOpen(false)
    }

    useEffect(() => {
        innerInputRef.current!.value = dateValue.current?.format(format) ?? format
    }, [dateValue.current])

    const clearHandler = () => {
        setDateValue(null)
        selectFn()
    }

    const ranges = useMemo(() => {
        const range: {
            token: typeof availableFormatTokens[number]
            start: number
            end: number
        }[] = []
        format.length && availableFormatTokens.forEach(token => {
            const matched = format.match(new RegExp(`${token}+`))
            if (matched && typeof matched.index === 'number') {
                range.push({
                    token,
                    start: matched.index,
                    end: matched.index + matched[0].length
                })
            }
        })
        return range
    }, [format])

    const currentRange = useRef<typeof ranges[0]>(null)

    const selectFn = () => {
        const input = innerInputRef.current!
        const {selectionStart} = input
        const range = ranges.find(({end}) => (selectionStart || 0) <= end) || ranges[ranges.length - 1]
        if (range) {
            currentRange.current = range
            input.value ||= format
            input.setSelectionRange(range.start, range.end)
        }
    }

    const selectHandler = (e: any) => {
        if (e.nativeEvent.type === 'selectionchange' || !ranges.length) {
            // setSelectionRange()方法也会触发该回调，通过nativeEvent.type排除
            return
        }
        selectFn()
    }

    const focusHandler = () => {
        focused.current = true
        selectFn()
    }

    const blurHandler = () => {
        resetContinue()
        focused.current = false
        _setInnerOpen(false)
    }

    const valueContinueHelper = useRef({token: '', value: ''})

    const resetContinue = () => {
        valueContinueHelper.current = {token: '', value: ''}
    }

    const keydownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!currentRange.current) {
            return
        }
        const {key} = e
        const input = e.target as HTMLInputElement
        const {token, start, end} = currentRange.current!

        if (/^\d$/.test(e.key)) {
            // 数字键
            e.preventDefault()
            let continuedValue
            if (valueContinueHelper.current.token === token) {
                continuedValue = valueContinueHelper.current.value += key
            } else {
                valueContinueHelper.current = {token, value: key}
                continuedValue = key
            }
            input.value = `${input.value.slice(0, start)}${continuedValue.padStart(end - start, '0')}${input.value.slice(end)}`
            input.setSelectionRange(start, end)
            const d = dayjs(input.value, format)
            d.isValid() && _setDateValue(d)

            // 当长度达到，或者数值超过，将会跳转下一个range
            if (token === 'Y') {
                if (continuedValue.length === 4) {
                    return selectNext(input)
                }
            } else if (continuedValue.length === 2) {
                return selectNext(input)
            }
            switch (token) {
                case 'M':
                    if (+key > 1) {
                        return selectNext(input)
                    }
                    break
                case 'D':
                    if (+key > 3) {
                        return selectNext(input)
                    }
                    break
                default:
                    // 'H' | 'm' | 's'
                    if (+key > 5) {
                        return selectNext(input)
                    }
            }
        }
        switch (key) {
            case 'Backspace':
            case 'Delete':
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
            case 'Escape':
                e.preventDefault()
                resetContinue()
        }
        switch (key) {
            case 'Backspace':
            case 'Delete':
                input.value = `${input.value.slice(0, start)}${format.slice(start, end)}${input.value.slice(end)}`
                input.setSelectionRange(start, end)
                _setDateValue(null)
                break
            case 'ArrowLeft':
                const prevRange = ranges[ranges.indexOf(currentRange.current!) - 1] || ranges[0]
                currentRange.current = prevRange
                input.setSelectionRange(prevRange.start, prevRange.end)
                break
            case 'ArrowRight':
                selectNext(input)
                break
            case 'ArrowUp':
            case 'ArrowDown':
                let valueFragment = +input.value.slice(start, end)
                if (isNaN(valueFragment)) {
                    valueFragment = 0
                }
                key === 'ArrowUp' ? valueFragment++ : valueFragment--
                switch (token) {
                    case 'Y':
                        break
                    case 'M':
                        valueFragment >= 13 ? valueFragment = 1
                            : valueFragment <= 0 && (valueFragment = 12)
                        break
                    case 'D':
                        valueFragment >= 32 ? valueFragment = 1
                            : valueFragment <= 0 && (valueFragment = 31)
                        break
                    default:
                        valueFragment >= 60 ? valueFragment = 1
                            : valueFragment <= 0 && (valueFragment = 59)
                }
                input.value = `${input.value.slice(0, start)}${valueFragment.toString().padStart(end - start, '0')}${input.value.slice(end)}`
                input.setSelectionRange(start, end)
                const d = dayjs(input.value, format)
                d.isValid() && _setDateValue(d)
                break
            case 'Escape':
                _setInnerOpen(false)
        }
    }

    const selectNext = (input: HTMLInputElement) => {
        resetContinue()
        const nextRange = ranges[ranges.indexOf(currentRange.current!) + 1] || ranges[ranges.length - 1]
        currentRange.current = nextRange
        input.setSelectionRange(nextRange.start, nextRange.end)
    }

    const contextValue = useMemo(() => ({
        min, max, disabledHours, disabledMinutes, disabledSeconds
    }), [
        min, max, disabledHours, disabledMinutes, disabledSeconds
    ])

    const showCalendar = /[YMD]/.test(format)

    const showTimer = /[Hms]/.test(format)

    const _dateVal = dateValue.current || dayjs()

    return (
        <Popper
            {...mergeComponentProps<PopperProps>(
                {
                    css: datePickerPopperStyle,
                    open: innerOpen.current,
                    placement: 'bottomLeft',
                    trigger: ['click', 'enter'],
                    disabled: props.disabled || props.readOnly,
                    content: (
                        <>
                            {showCalendar &&
                                <Calendar
                                    viewLevel={format.includes('D') ? 'date'
                                        : format.includes('M') ? 'month'
                                            : 'year'
                                    }
                                    _defaultNull={!dateValue.current}
                                    value={_dateVal}
                                    onChange={setDateValue}
                                    min={min}
                                    max={max}
                                    disabledDates={disabledDates}
                                />
                            }
                            {showTimer &&
                                <DateTimePickerContext value={contextValue}>
                                    <Timer
                                        showHours={format.includes('H')}
                                        showMinutes={format.includes('m')}
                                        showSeconds={format.includes('s')}
                                        value={_dateVal}
                                        onChange={setDateValue}
                                    />
                                </DateTimePickerContext>
                            }
                        </>
                    ),
                },
                popperProps,
                {
                    onOpenChange: setInnerOpen,
                    onPointerDown: e => e.preventDefault()
                }
            )}
        >
            <InputBase<'input'>
                {...mergeComponentProps<InputBaseProps<'input'>>(
                    props,
                    {
                        css: style,
                        className: classes.root,
                        value: dateValue.current as any,
                        onClear: clearHandler,
                        onSelect: selectHandler,
                        onFocus: focusHandler,
                        onBlur: blurHandler,
                        onKeyDown: keydownHandler
                    }
                )}
                data-focused={innerOpen.current}
            >
                {inputBaseProps =>
                    <div className={classes.container}>
                        <input
                            {...mergeComponentProps<'input'>(
                                inputBaseProps,
                                inputProps,
                                {
                                    ref: innerInputRef,
                                    className: classes.input
                                }
                            )}
                        />
                        <div className={classes.dateTimeIcon}>
                            {showTimer && !showCalendar
                                ? <Icon icon={faClock}/>
                                : <Icon icon={faCalendar}/>
                            }
                        </div>
                    </div>
                }
            </InputBase>
        </Popper>
    )
})