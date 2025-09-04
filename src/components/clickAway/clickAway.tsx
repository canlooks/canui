import {ReactElement, cloneElement, isValidElement, useEffect, useRef} from 'react'
import {cloneRef, isChildOf, toArray, useSync} from '../../utils'
import {DivProps, DefineElement} from '../../types'

export interface ClickAwayProps extends DivProps {
    container?: DefineElement<Element | Window>
    /** 传入addEventListener的事件类型，默认为`'click'` */
    eventType?: string
    onClickAway?(e: MouseEvent): void
    disabled?: boolean
    children?: ReactElement<any>
    /** 用于参考的目标元素，若为数组，需要点击数组外的元素才会触发clickAway */
    targets?: () => Element | null | (Element | null)[]
}

export function ClickAway({
    ref,
    container = self,
    eventType = 'click',
    onClickAway,
    disabled,
    children,
    targets,
    ...props
}: ClickAwayProps) {
    const syncOnClickAway = useSync(onClickAway)

    const childRef = useRef<Element>(null)

    const targetsArr = useRef<(Element | undefined | null)[]>([])

    useEffect(() => {
        targetsArr.current = [childRef.current, ...toArray(targets?.()) || []]
    })

    useEffect(() => {
        if (disabled) {
            return
        }
        const onClick = (e: any) => {
            if (!syncOnClickAway.current) {
                return
            }
            if (targetsArr.current.every(t => !isChildOf(e.target, t))) {
                syncOnClickAway.current(e)
            }
        }
        const containerEl = typeof container === 'function' ? container() : container
        const standardEventType = eventType.toLowerCase().replace(/^on/, '')
        containerEl.addEventListener(standardEventType, onClick)
        return () => {
            containerEl.removeEventListener(standardEventType, onClick)
        }
    }, [disabled])

    return !disabled && isValidElement(children)
        ? cloneElement(children as any, {
            ...props,
            ref: cloneRef((children.props as any).ref, ref, childRef)
        })
        : children
}