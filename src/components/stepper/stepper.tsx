import React, {Children, ReactElement, cloneElement, createContext, isValidElement, useContext, useMemo} from 'react'
import {clsx, useControlled} from '../../utils'
import {classes, style} from './stepper.style'
import {ColorPropsValue, DivProps, Obj, Size} from '../../types'
import {Step, StepProps} from './step'

export type StepStatus = 'waiting' | 'processing' | 'finished' | 'skipped' | 'error' | 'warning'

// Stepper, Step与context都共享的属性
export interface StepperSharedProps extends Omit<DivProps, 'onChange' | 'title' | 'prefix'> {
    size?: Size
    /** 
     * 各步骤的间距
     * {@link StepperProps.orientation}为`horizontal`时，默认为`15`
     * {@link StepperProps.orientation}为`vertical`时，默认为`6`
     */
    gap?: number
    color?: ColorPropsValue
    variant?: 'dot' | 'number'
    clickable?: boolean
    labelPlacement?: 'right' | 'bottom'
    status?: StepStatus
}

export interface StepperProps extends StepperSharedProps {
    steps?: (StepProps & Obj)[]
    /** 默认为`horizontal` */
    orientation?: 'horizontal' | 'vertical'
    defaultValue?: number
    value?: number
    onChange?(value: number): void
}

const StepperContext = createContext<Omit<StepperSharedProps, 'status'>>({})

export function useStepperContext() {
    return useContext(StepperContext)
}

export const Stepper = (({
    steps,
    orientation = 'horizontal',
    defaultValue = 0,
    value,
    onChange,
    // 以下为共享属性
    size,
    gap = orientation === 'horizontal' ? 15 : 9,
    color,
    variant,
    clickable,
    labelPlacement,
    status,
    ...props
}: StepperProps) => {
    const [innerValue, setInnerValue] = useControlled(defaultValue, value, onChange)

    const renderSteps = () => {
        if (steps) {
            return steps.map((p, i) => {
                const isCurrentStep = i === innerValue.current
                return (
                    <Step
                        {...p}

                        key={p.key ?? i}
                        step={i}
                        status={p.status ?? (
                            isCurrentStep
                                ? status ?? 'processing'
                                : i < innerValue.current
                                    ? 'finished'
                                    : 'waiting'
                        )}
                        clickable={p.clickable ?? clickable}
                        onClick={e => {
                            p.onClick?.(e);
                            (p.clickable ?? clickable) && setInnerValue(i)
                        }}
                        data-orientation={orientation}
                    />
                )
            })
        }
        return Children.map(props.children as ReactElement<StepProps & Obj>, (c, i) => {
            if (isValidElement(c)) {
                const isCurrentStep = i === innerValue.current
                const {props} = c
                return cloneElement(c, {
                    step: props.step ?? i,
                    status: props.status ?? (
                        isCurrentStep
                            ? status ?? 'processing'
                            : i < innerValue.current
                                ? 'finished'
                                : 'waiting'
                    ),
                    onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                        props.onClick?.(e);
                        (props.clickable ?? clickable) && setInnerValue(i)
                    },
                    'data-orientation': orientation
                })
            }
            return c
        })
    }

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-orientation={orientation}
            style={{
                gap,
                ...props.style
            }}
        >
            <StepperContext
                value={
                    useMemo(() => ({
                        size, gap, color, variant, clickable, labelPlacement
                    }), [
                        size, gap, color, variant, clickable, labelPlacement
                    ])
                }
            >
                {renderSteps()}
            </StepperContext>
        </div>
    )
}) as {
    (props: StepperProps): ReactElement
    Step: typeof Step
}

Stepper.Step = Step