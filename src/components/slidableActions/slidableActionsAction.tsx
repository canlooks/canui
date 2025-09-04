import React, {ReactNode, memo, useEffect, useMemo, useRef} from 'react'
import {ColorPropsValue, DivProps} from '../../types'
import {Button, ButtonProps} from '../button'
import {classes} from './slidableActions.style'
import {colorTransfer, mergeComponentProps} from '../../utils'
import {useTheme} from '../theme'
import {useSlidableActionsContext} from './slidableActions'

export interface SlidableActionsActionProps extends DivProps {
    color?: ColorPropsValue
    label?: ReactNode
    icon?: ReactNode
    buttonProps?: Omit<ButtonProps, 'onClick'>
    /** 点击action后是否自动归位，默认为`true` */
    autoReturn?: boolean

    /** @private */
    _index?: number
}

export const SlidableActionsAction = memo(({
    color = 'default',
    label,
    icon,
    buttonProps,
    _index,
    ...props
}: SlidableActionsActionProps) => {
    const {actionsContainer, translate, resetTranslate, maxDistance, autoReturn} = useSlidableActionsContext()
    const innerButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        actionsContainer![_index!] = innerButtonRef.current
        return () => {
            actionsContainer![_index!] = null
        }
    })

    const currentTranslate = useMemo(() => {
        if (!maxDistance) {
            return 0
        }
        const prevWidth = actionsContainer!.slice(0, _index!).reduce((prevWidth, currentEl) => {
            return currentEl ? prevWidth + currentEl.offsetWidth : prevWidth
        }, 0)
        return (1 - prevWidth / maxDistance) * translate!
    }, [translate, maxDistance, _index])

    const theme = useTheme()

    const backgroundColor = useMemo(() => {
        return color === 'default'
            ? '#aaaaaa'
            : colorTransfer(color, theme)
    }, [color, theme])

    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        autoReturn && resetTranslate!()
    }

    return (
        <div
            {...mergeComponentProps(
                props,
                {
                    className: classes.actionItem,
                    style: {
                        translate: `${currentTranslate}px 0`,
                        backgroundColor
                    },
                    onClick
                }
            )}
        >
            <Button
                {...mergeComponentProps<ButtonProps>(
                    buttonProps,
                    {
                        ref: innerButtonRef,
                        className: classes.actionItemButton,
                        prefix: icon,
                        color,
                        variant: 'flatted'
                    }
                )}
            >
                {label}
            </Button>
        </div>
    )
})