import React, {memo, ReactNode, useMemo, useRef} from 'react'
import {ColorPropsValue, DivProps} from '../../types'
import {classes, useStyle} from './progress.style'
import {clsx} from '../../utils'
import {useTheme} from '../theme'
import {css, keyframes} from '@emotion/react'
import {Icon} from '../icon'
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons/faCircleCheck'
import {faCircleXmark} from '@fortawesome/free-solid-svg-icons/faCircleXmark'

export interface ProgressProps extends DivProps {
    showInfo?: boolean
    renderInfo?(value: number): ReactNode
    color?: ColorPropsValue
    status?: 'default' | 'processing' | 'success' | 'error'
    variant?: 'linear' | 'circular' | 'gauge'
    /** {@link variant}为`gauge`时有效，下方缺口的角度，默认为`90` */
    gapDegree?: number
    /** {@link variant}为`circular`时有效，表示圆圈的大小 */
    size?: number
    /**
     * @enum {@link variant}为`linear`时，表示进度条粗细
     * @enum {@link variant}为`circular`或`gauge`时，表示圆环的宽度
     * 默认为4
     */
    barWidth?: number
    /** 若为`true`，则会一直播放动画，默认为`false` */
    indeterminate?: boolean

    strokeLinecap?: React.SVGAttributes<SVGCircleElement>['strokeLinecap']

    value?: number
}

export const Progress = memo(({
    showInfo = true,
    renderInfo,
    color,
    status = 'default',
    variant = 'linear',
    gapDegree = 90,
    size = 60,
    indeterminate = false,
    barWidth = 4,
    strokeLinecap = variant === 'gauge' ? 'butt' : 'round',
    value = 0,
    ...props
}: ProgressProps) => {
    const isColorSpecified = !!color
    color ??= 'primary'

    const {colors: {success, error}} = useTheme()

    const isSucceed = status === 'success' || (status !== 'error' && value === 100 && variant !== 'gauge')

    const renderInfoFn = () => {
        if (renderInfo) {
            return renderInfo(value)
        }
        if (isSucceed) {
            return <Icon icon={faCircleCheck} className={classes.icon} style={{color: success.main}}/>
        }
        if (status === 'error') {
            return <Icon icon={faCircleXmark} className={classes.icon} style={{color: error.main}}/>
        }
        return value + '%'
    }

    const commonCircleProps: React.SVGAttributes<SVGCircleElement> = {
        strokeLinecap,
        r: size / 2 - barWidth / 2,
        cx: size / 2,
        cy: size / 2,
        strokeWidth: barWidth
    }

    const strokeDasharray = Math.PI * 2 * (commonCircleProps.r as number)

    const barRef = useRef<SVGCircleElement>(null)

    const cssAnimation = useMemo(() => {
        if (variant === 'circular' && indeterminate) {
            const dasharray = (commonCircleProps.r as number) * 10
            const anim = keyframes`
                0% {
                    stroke-dasharray: 1px ${dasharray}px;
                    stroke-dashoffset: 0;
                }
                50% {
                    stroke-dasharray: ${dasharray / 2}px ${dasharray}px;
                    stroke-dashoffset: -${dasharray / 2 * .15}px;
                }
                100% {
                    stroke-dasharray: ${dasharray / 2}px ${dasharray}px;
                    stroke-dashoffset: -${dasharray / 2 * 1.25}px;
                }
            `
            return css({animation: `${anim} 1.4s linear infinite`})
        }
        return
    }, [indeterminate, variant, commonCircleProps.r])

    return (
        <div
            {...props}
            css={useStyle({color: color || 'primary', variant})}
            className={clsx(classes.root, props.className)}
            data-variant={variant}
            data-indeterminate={indeterminate}
            data-processing={value < 100 && status === 'processing'}
            data-success={isColorSpecified ? void 0 : isSucceed}
            data-error={isColorSpecified ? void 0 : status === 'error'}
        >
            {variant === 'linear'
                ? <>
                    <div
                        className={classes.track}
                        style={{
                            height: barWidth,
                            ...props.style
                        }}
                    >
                        <div
                            className={classes.bar}
                            style={indeterminate
                                ? void 0
                                : {width: value + '%'}
                            }
                        />
                    </div>
                    {showInfo && !indeterminate &&
                        <div className={classes.info}>{renderInfoFn()}</div>
                    }
                </>
                : <>
                    <svg
                        className={classes.svg}
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        style={{
                            transform: variant === 'gauge'
                                ? `rotate(${90 + gapDegree / 2}deg)`
                                : void 0
                        }}
                    >
                        <circle
                            {...commonCircleProps}
                            className={classes.track}
                            strokeDasharray={variant === 'gauge' ? strokeDasharray : void 0}
                            strokeDashoffset={variant === 'gauge' ? strokeDasharray * gapDegree / 360 : void 0}
                        />
                        <circle
                            {...commonCircleProps}
                            ref={barRef}
                            css={cssAnimation}
                            className={classes.bar}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={variant === 'circular'
                                ? strokeDasharray * (1 - value / 100)
                                : strokeDasharray * (1 - Math.max(0, Math.min(100, value)) / 100 * (1 - gapDegree / 360))
                            }
                        />
                    </svg>
                    {showInfo && !indeterminate &&
                        <div className={classes.info}>{renderInfoFn()}</div>
                    }
                </>
            }
        </div>
    )
})