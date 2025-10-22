import {ComponentProps, createContext, memo, useContext, useMemo, useRef} from 'react'
import {classes, datePickerPopperStyle, style} from './dateTimePicker.style'
import dayjs, {Dayjs} from 'dayjs'
import {InputBase, InputBaseProps} from '../inputBase'
import {mergeComponentProps, useControlled} from '../../utils'
import {Popper, PopperProps} from '../popper'
import {Calendar} from '../calendar'
import {Icon} from '../icon'
import {faCalendar} from '@fortawesome/free-regular-svg-icons/faCalendar'
import {faClock} from '@fortawesome/free-regular-svg-icons/faClock'
import { Timer } from './timer'

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
    const focused = useRef(false)

    const [innerOpen, _setInnerOpen] = useControlled(defaultOpen, open, onOpenChange)
    const setInnerOpen = (open: boolean) => {
        // 如果仍聚焦在输入框，则不用关闭弹框
        (open || !focused.current) && _setInnerOpen(open)
    }

    const [dateValue, _setDateValue] = useControlled(defaultValue, value, onChange)
    const setDateValue = (date: Dayjs | null) => {
        _setDateValue(date)
        autoClose && _setInnerOpen(false)
    }

    const contextValue = useMemo(() => ({
        min, max, disabledHours, disabledMinutes, disabledSeconds
    }), [
        min, max, disabledHours, disabledMinutes, disabledSeconds
    ])

    const showCalendar = /[YMD]/.test(format)

    const showTimer = /[Hms]/.test(format)

    // 若外部没有值，内部需要“现在”作为默认值
    const innerValue = dateValue.current || dayjs()

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
                                    value={innerValue}
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
                                        value={innerValue}
                                        onChange={setDateValue}
                                    />
                                </DateTimePickerContext>
                            }
                        </>
                    )
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
                        onClear() {
                            setDateValue(null)
                        }
                    }
                )}
                data-focused={innerOpen.current}
            >
                {inputBaseProps =>
                    <div className={classes.container}>
                        {!dateValue.current
                            ? <div className={classes.placeholder}>{props.placeholder ?? '请选择'}</div>
                            : <div className={classes.backfill}>
                                {dateValue.current.format(format)}
                            </div>
                        }
                        <input
                            size={1}
                            {...mergeComponentProps<'input'>(inputBaseProps, inputProps)}
                            data-hidden="true"
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