import {ReactNode, memo, useState} from 'react'
import {PanelProps} from './calendar'
import {classes} from './calendar.style'
import {Button} from '../button'
import {Tooltip} from '../tooltip'
import {Icon} from '../icon'
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import {faAngleRight} from '@fortawesome/free-solid-svg-icons/faAngleRight'
import {Dayjs} from 'dayjs'

export const PanelYear = memo(({
    innerD,
    setInnerD,
    onSelected,
    min,
    max
}: PanelProps) => {
    const currentYear = innerD.year()

    const clickHandler = (d: Dayjs, yearNum: number) => {
        currentYear !== yearNum && setInnerD(d)
        onSelected(d)
    }

    const [page, setPage] = useState(() => Math.floor(currentYear / 12))

    const renderHeadControl = (icon: ReactNode, title: ReactNode, onClick: () => void) => (
        <Tooltip title={title}>
            <Button
                className={classes.headControl}
                variant="text"
                size="small"
                color="text.secondary"
                onClick={onClick}
            >
                {icon}
            </Button>
        </Tooltip>
    )

    const isDisabled = (d: Dayjs) => {
        if (min && min.isAfter(d)) {
            return true
        }
        return max && max.isBefore(d)
    }

    const renderButtons = () => {
        const ret = []
        for (let i = 0; i < 12; i++) {
            const yearNum = page * 12 + i + 1
            const d = innerD.year(yearNum)
            ret.push(
                <Button
                    key={i}
                    className={classes.monthItem}
                    variant={currentYear === yearNum ? 'filled' : 'text'}
                    size="large"
                    color={currentYear === yearNum ? 'primary' : 'text'}
                    disabled={isDisabled(d)}
                    onClick={() => clickHandler(d, yearNum)}
                >
                    {yearNum}
                </Button>
            )
        }
        return ret
    }

    return (
        <>
            <div className={classes.head}>
                <div className={classes.headSide}>
                    {renderHeadControl(<Icon icon={faAngleLeft}/>, '上一页', () => setPage(p => p - 1))}
                </div>
                <div className={classes.headSide}>
                    {renderHeadControl(<Icon icon={faAngleRight}/>, '下一页', () => setPage(p => p + 1))}
                </div>
                <div className={classes.headCenter}>年份</div>
            </div>
            <div className={classes.body} data-view-type="year">
                {renderButtons()}
            </div>
        </>
    )
})