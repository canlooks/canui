import React, {ReactNode, cloneElement, isValidElement, memo, useState} from 'react'
import {ColorPropsValue, DivProps, Size} from '../../types'
import {clsx, useControlled} from '../../utils'
import {classes, useStyle} from './rating.style'
import {useTheme} from '../theme'
import {Icon} from '../icon'
import {faStar} from '@fortawesome/free-solid-svg-icons/faStar'

export type CharacterProps = {
    index: number
    active?: true
    half?: boolean
}

export interface RatingProps extends Omit<DivProps, 'defaultValue' | 'onChange'> {
    color?: ColorPropsValue
    size?: Size
    /** 星星的数量，默认为`5` */
    count?: number
    renderStar?: ReactNode | ((characterProps: CharacterProps) => ReactNode)
    /** 允许选中半颗星 */
    allowHalf?: boolean
    /** 为true时只高亮选中的星星，否则从第一颗开始高亮至选中，默认为`false` */
    highlightSelectedOnly?: boolean

    defaultValue?: number
    value?: number
    onChange?(value: number): void

    readOnly?: boolean
    disabled?: boolean
}

export const Rating = memo(({
    color = '#FFCC00',
    size,
    count = 5,
    renderStar = <Icon icon={faStar}/>,
    allowHalf,
    highlightSelectedOnly = false,

    defaultValue = 0,
    value,
    onChange,
    readOnly,
    disabled,
    ...props
}: RatingProps) => {
    const theme = useTheme()

    size ??= theme.size

    const [innerValue, setInnerValue] = useControlled(defaultValue, value, onChange)

    const [hovering, setHovering] = useState(0)

    const enterHandler = (index: number, isHalf: boolean) => {
        if (readOnly || disabled) {
            return
        }
        allowHalf
            ? setHovering(isHalf ? index + .5 : index + 1)
            : setHovering(index + 1)
    }

    const leaveHandler = (e: React.PointerEvent<HTMLDivElement>) => {
        props.onPointerOut?.(e)
        setHovering(0)
    }

    const clickHandler = (index: number, isHalf: boolean) => {
        if (readOnly || disabled) {
            return
        }
        allowHalf
            ? setInnerValue(isHalf ? index + .5 : index + 1)
            : setInnerValue(index + 1)
    }

    const renderStarFn = () => {
        const characterIsFunction = typeof renderStar === 'function'
        return Array(count).fill(void 0).map((_, index) => {
            const refer = hovering || innerValue.current
            const isActive = highlightSelectedOnly
                ? index === refer - 1
                : index < refer
            const isHalf = !highlightSelectedOnly && isActive && index > refer - 1

            return (
                <div key={index} className={classes.star}>
                    {characterIsFunction
                        ? renderStar({index})
                        : renderStar
                    }
                    {isActive && (
                        characterIsFunction
                            ? renderStar({
                                index,
                                active: true,
                                half: isHalf
                            })
                            : isValidElement(renderStar)
                                ? cloneElement(renderStar as any, {
                                    'data-active': true,
                                    'data-half': isHalf
                                })
                                : renderStar
                    )}
                    <div
                        className={classes.starBefore}
                        onPointerEnter={() => enterHandler(index, true)}
                        onClick={() => clickHandler(index, true)}
                    />
                    <div
                        className={classes.starAfter}
                        onPointerEnter={() => enterHandler(index, false)}
                        onClick={() => clickHandler(index, false)}
                    />
                </div>
            )
        })
    }

    return (
        <div
            {...props}
            css={useStyle({color: color || '#FFCC00'})}
            className={clsx(classes.root, props.className)}
            data-size={size}
            data-read-only={readOnly}
            data-disabled={disabled}
            onPointerLeave={leaveHandler}
        >
            {renderStarFn()}
        </div>
    )
})