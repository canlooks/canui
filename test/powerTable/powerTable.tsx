import {RC, useReactive} from '@canlooks/reactive/react'
import {Table, TableContainer, TdCell, ThCell} from '../../src'
import {style} from './powerTable.style'
import dayjs from 'dayjs'
import {Fragment, JSX} from 'react'

/**
 * -----------------------------------------------------------------------------------
 * 测试
 */

const now = dayjs().startOf('hour')

const mockData = Array(288).fill(void 0).map((_, i) => {
    return {
        start: now.add(i, 'hours').valueOf(),
        plan: Math.floor(Math.random() * 10000 + 3000),
        adjust: Math.floor(Math.random() * 10000 + 3000),
        actual: Math.floor(Math.random() * 10000 + 3000),
        stage: i < 170 ? 1 : 2 // 爬坡阶段，保温阶段
    }
})

/**
 * 测试
 * -----------------------------------------------------------------------------------
 */

const staticRows = Array(24).fill(void 0).map((_, i) => {
    return `${i.toString().padStart(2, '0')}:00-${(i + 1).toString().padStart(2, '0')}:00`
})

export const PowerTable = RC((props: JSX.IntrinsicElements['div']) => {
    const state = useReactive({
        get dataMap() {
            return Map.groupBy(mockData, item => item.start)
        },
        get days() {
            const days = []
            let d = dayjs(mockData[0].start).startOf('day')
            const lastStart = dayjs(mockData[mockData.length - 1].start)
            while (d.isBefore(lastStart)) {
                const label = d.format('M月D日')
                const data = this.dataMap.get(d.valueOf())
                const stage = data?.[0].stage === 2 ? `(保温阶段)` : `(爬坡阶段)`
                days.push({
                    label: label + stage,
                    startTime: d
                })
                d = d.add(1, 'day')
            }
            return days
        }
    })

    return (
        <TableContainer {...props} css={style}>
            <Table bordered striped size="small">
                <thead>
                <tr>
                    <ThCell rowSpan={2} sticky="left"/>
                    {state.days.map(({label}, i) =>
                        <ThCell
                            key={i}
                            className="day-last-cell"
                            colSpan={3}
                        >
                            {label}
                        </ThCell>
                    )}
                </tr>
                <tr>
                    {state.days.map((_, i) =>
                        <Fragment key={i}>
                            <ThCell>初始计划</ThCell>
                            <ThCell>调整计划</ThCell>
                            <ThCell className="day-last-cell">实际</ThCell>
                        </Fragment>
                    )}
                </tr>
                </thead>
                <tbody>
                {staticRows.map((label, rowIndex) =>
                    <tr key={rowIndex}>
                        <TdCell sticky="left">{label}</TdCell>
                        {state.days.map(({startTime}, i) => {
                            const timestamp = startTime.add(rowIndex, 'hours').valueOf()
                            const data = state.dataMap.get(timestamp)?.[0]
                            return (
                                <Fragment key={i}>
                                    <TdCell data-no-data={!data}>{data?.plan}</TdCell>
                                    <TdCell data-no-data={!data}>{data?.adjust}</TdCell>
                                    <TdCell className="day-last-cell" data-no-data={!data}>{data?.actual}</TdCell>
                                </Fragment>
                            )
                        })}
                    </tr>
                )}
                </tbody>
                <tfoot>
                <tr>
                    <ThCell sticky="left"/>
                    {state.days.map((_, i) =>
                        <Fragment key={i}>
                            <ThCell>初始计划</ThCell>
                            <ThCell>调整计划</ThCell>
                            <ThCell className="day-last-cell">实际</ThCell>
                        </Fragment>
                    )}
                </tr>
                </tfoot>
            </Table>
        </TableContainer>
    )
})