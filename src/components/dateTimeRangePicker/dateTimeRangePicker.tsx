import {ReactNode, memo, useRef} from 'react'
import {ColorPropsValue, DivProps, Size} from '../../types'
import {classes, style} from './dateTimeRangePicker.style'
import {clsx, mergeComponentProps, useControlled} from '../../utils'
import {DatePickerSharedProps, DateTimePicker, DateTimePickerProps} from '../dateTimePicker'
import {Dayjs} from 'dayjs'

type DateValueType = [Dayjs | null, Dayjs | null] | null

type PickerType = 'start' | 'end'

export interface DateTimeRangePickerProps extends DatePickerSharedProps, Omit<DivProps, 'defaultValue' | 'onChange'> {
    startPickerProps?: DateTimePickerProps
    endPickerProps?: DateTimePickerProps

    format?: string
    defaultValue?: DateValueType
    value?: DateValueType
    onChange?(value: DateValueType): void

    defaultOpenPicker?: PickerType | 'closed'
    openPicker?: PickerType | 'closed'
    onOpenPickerChange?(openPicker?: PickerType | 'closed'): void
    autoClose?: boolean

    separator?: ReactNode

    disabledDates?: (date: Dayjs) => any

    variant?: 'outlined' | 'underlined' | 'plain'
    size?: Size
    color?: ColorPropsValue
    disabled?: boolean
    readOnly?: boolean
    autoFocus?: boolean
}

export const DateTimeRangePicker = memo(({
    startPickerProps,
    endPickerProps,

    format = 'YYYY-MM-DD',
    defaultValue,
    value,
    onChange,

    defaultOpenPicker = 'closed',
    openPicker,
    onOpenPickerChange,
    autoClose = !/[Hms]/.test(format),

    separator,

    min,
    max,
    disabledDates,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    // 以下属性除autoFocus外，原样转发，autoFocus只对开始选择器生效
    variant,
    size,
    color,
    disabled,
    readOnly,
    autoFocus,
    ...props
}: DateTimeRangePickerProps) => {
    const [innerOpen, setInnerOpen] = useControlled(defaultOpenPicker, openPicker, onOpenPickerChange)

    const [innerValue, setInnerValue] = useControlled(defaultValue, value, onChange)

    const endPickerInputRef = useRef<HTMLInputElement>(null)

    const showTimer = /[Hms]/.test(format)

    const renderPickerItem = (type: PickerType) => {
        const commonProps = {
            format, disabledDates, disabledHours, disabledMinutes, disabledSeconds,
            variant, size, color, disabled, readOnly
        }
        return (
            <DateTimePicker
                {...mergeComponentProps<DateTimePickerProps>(
                    commonProps,
                    type === 'start'
                        ? {
                            autoFocus,
                            autoClose: false,
                            placeholder: showTimer ? '开始时间' : '开始日期',
                            max: innerValue.current?.[1] || void 0,
                            open: innerOpen.current === 'start'
                        }
                        : {
                            autoClose,
                            placeholder: showTimer ? '结束时间' : '结束日期',
                            min: innerValue.current?.[0] || void 0,
                            open: innerOpen.current === 'end'
                        },
                    type === 'start'
                        ? startPickerProps
                        : endPickerProps,
                    type === 'start'
                        ? {
                            onOpenChange: open => setInnerOpen(open ? 'start' : 'closed'),
                            value: innerValue.current?.[0],
                            onChange: value => {
                                setInnerValue(o => [value, o?.[1] || null])
                                if (value && !showTimer) {
                                    endPickerInputRef.current!.focus()
                                    innerOpen.current === 'start' && setInnerOpen('end')
                                }
                            }
                        }
                        : {
                            inputProps: {ref: endPickerInputRef},
                            onOpenChange: open => setInnerOpen(open ? 'end' : 'closed'),
                            value: innerValue.current?.[1],
                            onChange: value => {
                                setInnerValue(o => [o?.[0] || null, value])
                            },
                            popperProps: {
                                ...endPickerProps?.popperProps,
                                placement: 'bottomRight'
                            }
                        }
                )}
            />
        )
    }

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            {renderPickerItem('start')}
            {separator ?? <span>-</span>}
            {renderPickerItem('end')}
        </div>
    )
})