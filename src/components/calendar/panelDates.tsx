import {memo, ReactElement, ReactNode} from 'react'
import {PanelProps} from './calendar'
import {Button, ButtonProps} from '../button'
import dayjs, {Dayjs} from 'dayjs'
import {Tooltip} from '../tooltip'
import {Icon} from '../icon'
import {faAnglesLeft} from '@fortawesome/free-solid-svg-icons/faAnglesLeft'
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import {faAngleRight} from '@fortawesome/free-solid-svg-icons/faAngleRight'
import {faAnglesRight} from '@fortawesome/free-solid-svg-icons/faAnglesRight'
import {classes} from './calendar.style'
import {clsx} from '../../utils'

const days = ['一', '二', '三', '四', '五', '六', '日']

const renderedDaysList = (() => {
    const ret: ReactElement[] = []
    for (let i = 0; i < 7; i++) {
        ret.push(
            <div key={i}>{days[i]}</div>
        )
    }
    return ret
})()

const commonButtonProps: ButtonProps = {
    variant: 'text',
    size: 'small',
    color: 'text'
}

export const PanelDates = memo(({
    value,
    setValue,
    innerD,
    setInnerD,
    setViewType,
    min,
    max,
    disabledDates,
    showToday,
    dateButtonProps,
    todayButtonText = '回今天',
    todayButtonProps,
    _defaultNull
}: PanelProps) => {
    const today = dayjs()

    const prevMonth = () => {
        setInnerD(d => d.subtract(1, 'month'))
    }

    const nextMonth = () => {
        setInnerD(d => d.add(1, 'month'))
    }

    const prevYear = () => {
        setInnerD(d => d.subtract(1, 'year'))
    }

    const nextYear = () => {
        setInnerD(d => d.add(1, 'year'))
    }

    const renderHeadControl = (icon: ReactNode, title: ReactNode, onClick: () => void) => (
        <Tooltip title={title}>
            <Button
                {...commonButtonProps}
                className={classes.headControl}
                onClick={onClick}
            >
                {icon}
            </Button>
        </Tooltip>
    )

    const isDisabled = (d: Dayjs) => {
        if (disabledDates && !disabledDates(d)) {
            return true
        }
        if (min && min.isAfter(d)) {
            return true
        }
        return max && max.isBefore(d)
    }

    const renderDates = () => {
        let startD = innerD.date(0)
        const startDay = startD.day()
        const ret = []
        for (let i = 0; i < 42; i++) {
            const offset = i - startDay + 1
            const _d = offset > 0 ? startD.add(offset, 'days')
                : offset < 0 ? startD.subtract(-offset, 'days')
                    : startD
            const isToday = _d.isSame(today, 'day')
            const selected = !_defaultNull && _d.isSame(value, 'day')
            const isCurrentMonth = _d.isSame(innerD, 'month')
            const disabled = isDisabled(_d)
            const outerProps = typeof dateButtonProps === 'function' ? dateButtonProps(_d) : dateButtonProps

            ret.push(
                <Button
                    size="small"
                    variant={disabled || selected ? 'filled'
                        : isToday ? 'outlined'
                            : 'text'
                    }
                    color={selected ? 'primary' : 'text'}
                    {...outerProps}
                    key={i}
                    className={clsx(classes.dateItem, outerProps?.className)}
                    disabled={disabled}
                    data-other-month={!isCurrentMonth}
                    onClick={e => {
                        outerProps?.onClick?.(e)
                        !selected && setValue(_d)
                    }}
                >
                    {_d.date()}
                </Button>
            )
        }
        return ret
    }

    return (
        <>
            <div className={classes.head}>
                <div className={classes.headSide}>
                    {renderHeadControl(<Icon icon={faAnglesLeft}/>, '上一年', prevYear)}
                    {renderHeadControl(<Icon icon={faAngleLeft}/>, '上一月', prevMonth)}
                </div>
                <div className={classes.headSide}>
                    {renderHeadControl(<Icon icon={faAngleRight}/>, '下一月', nextMonth)}
                    {renderHeadControl(<Icon icon={faAnglesRight}/>, '下一年', nextYear)}
                </div>
                <div className={classes.headCenter}>
                    <Button
                        {...commonButtonProps}
                        className={classes.headButton}
                        onClick={() => setViewType('year')}
                    >
                        {innerD.year()}年
                    </Button>
                    <Button
                        {...commonButtonProps}
                        className={classes.headButton}
                        onClick={() => setViewType('month')}
                    >
                        {(innerD.month() + 1).toString().padStart(2, '0')}月
                    </Button>
                </div>
            </div>
            <div className={classes.body} data-view-type="date">
                {renderedDaysList}
                {renderDates()}
            </div>
            {showToday &&
                <div className={classes.foot}>
                    <Button
                        variant="text"
                        {...todayButtonProps}
                        onClick={e => {
                            todayButtonProps?.onClick?.(e)
                            const d = dayjs()
                            setInnerD(d)
                            setValue(d)
                        }}
                    >
                        {todayButtonText}
                    </Button>
                </div>
            }
        </>
    )
})