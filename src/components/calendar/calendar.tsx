import {Size} from '../../types'
import dayjs, {Dayjs} from 'dayjs'
import {clsx, useControlled, useDerivedState} from '../../utils'
import {PanelDates} from './panelDates'
import {Dispatch, ReactNode, SetStateAction} from 'react'
import {classes, style} from './calendar.style'
import {Flex, FlexProps} from '../flex'
import {PanelYear} from './panelYear'
import {PanelMonth} from './panelMonth'
import {ButtonProps} from '../button'

export type ViewLevel = 'date' | 'month' | 'year'

type SharedProps = {
    min?: Dayjs
    max?: Dayjs
    dateButtonProps?: ButtonProps | ((date: Dayjs) => ButtonProps)
    disabledDates?: (date: Dayjs) => boolean
    /** 是否显示`回今天`按钮，默认为`true` */
    showToday?: boolean
    todayButtonText?: ReactNode
    todayButtonProps?: ButtonProps
    /** @private */
    _defaultNull?: boolean
}

export interface CalendarProps extends SharedProps, Omit<FlexProps, 'defaultValue' | 'onChange'> {
    /** 视图等级，默认为`date` */
    viewLevel?: ViewLevel
    size?: Size
    defaultValue?: Dayjs | null
    value?: Dayjs | null
    onChange?(value: Dayjs | null): void
}

export interface PanelProps extends SharedProps {
    value: Dayjs | null
    setValue: Dispatch<SetStateAction<Dayjs | null>>
    innerD: Dayjs
    setInnerD: Dispatch<SetStateAction<Dayjs>>
    setViewType: Dispatch<SetStateAction<'date' | 'month' | 'year'>>
    onSelected(newValue: Dayjs): void
}

export const Calendar = ({
    viewLevel = 'date',
    showToday = true,
    dateButtonProps,
    todayButtonText = '回今天',
    todayButtonProps,
    size = 'medium',
    defaultValue = null,
    min,
    max,
    disabledDates,
    value,
    onChange,
    _defaultNull,
    ...props
}: CalendarProps) => {
    const [innerValue, setInnerValue] = useControlled(defaultValue, value, onChange)

    const [viewType, setViewType] = useDerivedState<'date' | 'month' | 'year'>(viewLevel)

    const [innerD, setInnerD] = useDerivedState(() => {
        if (innerValue.current) {
            return innerValue.current
        }
        const today = dayjs().startOf('date')

        const _min = min?.add(1, 'day')
        if (_min?.isAfter(today, 'month')) {
            return _min
        }
        const _max = max?.subtract(1, 'day')
        if (_max?.isBefore(today, 'month')) {
            return _max
        }
        return today
    }, [innerValue.current, min, max])

    const commonProps: PanelProps = {
        value: innerValue.current,
        setValue: setInnerValue,
        innerD: innerD.current,
        setInnerD,
        setViewType,
        min,
        max,
        disabledDates,
        onSelected: (newValue: Dayjs) => {
            if (viewLevel === 'date') {
                // 视图等级为`date`时，选中年或月跳转回`date`视图
                setViewType('date')
            } else {
                // 视图等级不为`date`时，选中年或月即完成
                setInnerValue(newValue)
            }
        },
        showToday,
        dateButtonProps,
        todayButtonText,
        todayButtonProps,
        _defaultNull
    }

    const renderPanel = () => {
        switch (viewType.current) {
            case 'date':
                return <PanelDates {...commonProps}/>
            case 'month':
                return <PanelMonth {...commonProps}/>
            default:
                return <PanelYear {...commonProps}/>
        }
    }

    return (
        <Flex
            inline
            direction="column"
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-size={size}
        >
            {renderPanel()}
        </Flex>
    )
}