import {ReactNode, memo} from 'react'
import {clsx} from '../../utils'
import {classes, useStyle} from './step.style'
import {StepStatus, StepperSharedProps, useStepperContext} from './stepper'
import {useTheme} from '../theme'
import {Icon} from '../icon'
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck'
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons/faCircleInfo'
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark'
import {faMinus} from '@fortawesome/free-solid-svg-icons/faMinus'

export type RenderStepInner = ReactNode | ((params: {
    step: number
    status: StepStatus
}) => ReactNode)

export interface StepProps extends StepperSharedProps {
    indicator?: RenderStepInner
    title?: RenderStepInner
    prefix?: RenderStepInner
    suffix?: RenderStepInner
    description?: RenderStepInner
    /** @private 该步骤的序号，通常由<Stepper/>组件自动传递 */
    step?: number
}

export const Step = memo(({
    indicator,
    title,
    prefix,
    suffix,
    description,
    step = 0,
    // 共享属性，从StepperSharedProps继承而来
    size,
    gap,
    color,
    variant,
    labelPlacement,
    clickable,
    status = 'waiting',
    ...props
}: StepProps) => {
    const theme = useTheme()

    const context = useStepperContext()

    size ??= context.size ?? theme.size
    gap ??= context.gap ?? theme.spacing[5]
    color ||= context.color ?? 'primary'
    variant ??= context.variant ?? 'number'
    labelPlacement ??= context.labelPlacement
    clickable ??= context.clickable

    const renderInner = (prop: RenderStepInner) => {
        return typeof prop === 'function' ? prop({step, status}) : prop
    }

    return (
        <div
            {...props}
            css={useStyle({color, gap})}
            className={clsx(classes.root, props.className)}
            data-size={size}
            data-status={status}
            data-variant={variant}
            data-label-placement={labelPlacement}
            data-clickable={clickable}
        >
            {indicator
                ? renderInner(indicator)
                : <div className={classes.indicatorWrap}>
                    <div className={classes.indicator}>
                        {(() => {
                            if (variant === 'dot') {
                                return null
                            }
                            switch (status) {
                                case 'waiting':
                                case 'processing':
                                    return step + 1
                                case 'finished':
                                    return <Icon icon={faCheck}/>
                                case 'warning':
                                    return <Icon icon={faCircleInfo}/>
                                case 'error':
                                    return <Icon icon={faXmark}/>
                                case 'skipped':
                                    return <Icon icon={faMinus}/>
                            }
                        })()}
                    </div>
                </div>
            }
            <div className={classes.label}>
                <div className={classes.title}>
                    <div className={classes.titleText}>{renderInner(title)}</div>
                </div>
                <div className={classes.description}>{renderInner(description)}</div>
            </div>
        </div>
    )
})