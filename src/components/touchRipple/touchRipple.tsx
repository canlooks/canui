import {memo, useEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import {ColorPropsValue, DefineElement, DivProps} from '../../types'
import {cloneRef, clsx, useContainer} from '../../utils'
import {classes, useStyle} from './touchRipple.style'

export interface TouchRippleOverlayProps extends DivProps {
    color?: ColorPropsValue
    /** 容器元素，默认为该组件元素的父元素 */
    container?: DefineElement<HTMLElement>
    effectContainer?: DefineElement<HTMLElement>
}

export const TouchRipple = memo(({
    color = 'primary',
    container,
    effectContainer,
    ...props
}: TouchRippleOverlayProps) => {
    const ref = useRef<HTMLDivElement>(null)

    const [ripples, setRipples] = useState(new Map<number, {
        key: number
        diameter: number
        left: number
        top: number
        leaving: boolean
    }>())

    const incrementKey = useRef(0)

    const containerEl = useContainer(container, effectContainer, null)

    useEffect(() => {
        const parentElement = containerEl.current ?? ref.current!.parentElement
        if (parentElement) {
            const pointerDown = ({offsetX, offsetY}: PointerEvent) => {
                const maxWidth = Math.max(parentElement.clientWidth - offsetX, offsetX)
                const maxHeight = Math.max(parentElement.clientHeight - offsetY, offsetY)
                setRipples(o => {
                    const r = new Map(o)
                    const key = ++incrementKey.current

                    r.set(key, {
                        key,
                        diameter: Math.sqrt(maxWidth ** 2 + maxHeight ** 2) * 2,
                        left: offsetX,
                        top: offsetY,
                        leaving: false
                    })
                    return r
                })
                parentElement.addEventListener('pointerup', leave)
                parentElement.addEventListener('pointerleave', leave)
            }
            const leave = () => {
                setRipples(o => {
                    const r = new Map(o)
                    r.forEach(v => v.leaving = true)
                    return r
                })
                removeLeaveListener()
            }
            const removeLeaveListener = () => {
                parentElement.removeEventListener('pointerup', leave)
                parentElement.removeEventListener('pointerleave', leave)
            }

            parentElement.addEventListener('pointerdown', pointerDown)
            return () => {
                parentElement.removeEventListener('pointerdown', pointerDown)
                removeLeaveListener()
            }
        }
    }, [containerEl.current])

    const leftHandler = (key: number) => {
        setRipples(o => {
            const r = new Map(o)
            r.delete(key)
            if (!r.size) {
                incrementKey.current = 0
            }
            return r
        })
    }

    const children = (
        <div
            {...props}
            ref={cloneRef(ref, props.ref)}
            css={useStyle({color})}
            className={clsx(classes.root, props.className)}
        >
            {ripples.values().toArray().map(({key, diameter, left, top, leaving}) =>
                <div
                    key={key}
                    className={classes.ripple}
                    style={{
                        width: diameter,
                        height: diameter,
                        left, top
                    }}
                    data-leaving={leaving}
                    onTransitionEnd={() => leftHandler(key)}
                />
            )}
        </div>
    )

    return containerEl.current
        ? createPortal(children, containerEl.current)
        : children
})