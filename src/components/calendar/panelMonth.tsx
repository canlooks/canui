import {memo} from 'react'
import {PanelProps} from './calendar'
import {classes} from './calendar.style'
import {Button} from '../button'
import {Dayjs} from 'dayjs'

export const PanelMonth = memo(({
    innerD,
    setInnerD,
    onSelected,
    min,
    max
}: PanelProps) => {
    const currentMonth = innerD.month()

    const clickHandler = (d: Dayjs, i: number) => {
        currentMonth !== i && setInnerD(d)
        onSelected(d)
    }

    const isDisabled = (d: Dayjs) => {
        if (min && min.isAfter(d)) {
            return true
        }
        return max && max.isBefore(d)
    }

    const renderButtons = () => {
        const ret = []
        for (let i = 0; i < 12; i++) {
            const d = innerD.month(i)
            ret.push(
                <Button
                    key={i}
                    className={classes.monthItem}
                    variant={currentMonth === i ? 'filled' : 'text'}
                    size="large"
                    color={currentMonth === i ? 'primary' : 'text'}
                    disabled={isDisabled(d)}
                    onClick={() => clickHandler(d, i)}
                >
                    {i + 1}月
                </Button>
            )
        }
        return ret
    }

    return (
        <>
            <div className={classes.head}>
                <div className={classes.headCenter}>月份</div>
            </div>
            <div className={classes.body} data-view-type="month">
                {renderButtons()}
            </div>
        </>
    )
})