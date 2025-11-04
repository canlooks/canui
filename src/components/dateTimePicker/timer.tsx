import {memo, useRef} from 'react'
import {classes, style} from './timer.style'
import {MenuItem} from '../menuItem'
import dayjs, {Dayjs} from 'dayjs'
import {useDateTimePickerContext} from './dateTimePicker'
import {useScrollToTarget} from '../popper'

export const Timer = memo(({
    showHours,
    showMinutes,
    showSeconds,
    value,
    onChange
}: {
    showHours: boolean
    showMinutes: boolean
    showSeconds: boolean
    value: Dayjs | null
    onChange(value: Dayjs): void
}) => {
    return (
        <div
            css={style}
            className={classes.root}
        >
            {showHours && <TimerItem type="hour" value={value} onChange={onChange}/>}
            {showMinutes && <TimerItem type="minute" value={value} onChange={onChange}/>}
            {showSeconds && <TimerItem type="second" value={value} onChange={onChange}/>}
        </div>
    )
})

function TimerItem({
    type,
    value,
    onChange
}: {
    type: 'hour' | 'minute' | 'second'
    value: Dayjs | null
    onChange(value: Dayjs): void
}) {
    const {min, max, disabledHours, disabledMinutes, disabledSeconds} = useDateTimePickerContext()

    const currentNum = !value ? -1
        : type === 'hour' ? value.hour()
            : type === 'minute' ? value.minute()
                : value.second()

    const isDisabled = (num: number) => {
        if (!value) {
            return false
        }
        if (type === 'hour') {
            if (disabledHours && !disabledHours(value, num)) {
                return true
            }
        } else if (type === 'minute') {
            if (disabledMinutes && !disabledMinutes(value, num)) {
                return true
            }
        } else {
            if (disabledSeconds && !disabledSeconds(value, num)) {
                return true
            }
        }
        if (min && min.isSame(value, 'date') && min.get(type) > num) {
            return true
        }
        return !!(max && max.isSame(value, 'date') && max.get(type) < num)
    }

    const scrollerRef = useRef<HTMLDivElement>(null)

    const selectedItemRef = useScrollToTarget<HTMLDivElement>(scrollerRef)

    const renderItems = (count: number) => {
        const ret = []
        for (let i = 0; i < count; i++) {
            ret.push(
                <MenuItem
                    key={i}
                    ref={i === currentNum ? selectedItemRef : void 0}
                    className={classes.timerItem}
                    label={i.toString().padStart(2, '0')}
                    selected={i === currentNum}
                    onClick={() => {
                        if (i !== currentNum) {
                            value ||= dayjs()
                            onChange(value.set(type as any, i))
                        }
                    }}
                    disabled={isDisabled(i)}
                />
            )
        }
        return ret
    }

    return (
        <div className={classes.selectItem}>
            <div className={classes.selectItemTitle}>
                {type === 'hour' ? '时'
                    : type === 'minute' ? '分'
                        : '秒'
                }
            </div>
            <div ref={scrollerRef} className={classes.selectItemBody}>
                {renderItems(type === 'hour' ? 24 : 60)}
            </div>
        </div>
    )
}