import {createContext, SetStateAction, useContext, useRef, RefObject, useCallback} from 'react'
import {useExternalClass} from '../../utils'

export const PopperContext = createContext({
    autoClose: false,
    open: false,
    setOpen(open: SetStateAction<boolean>) {
    },
    onChildrenOpenChange(open: boolean) {
    },
    beforeOpenCallbacks: new Set<() => void>()
})

export function usePopperContext() {
    return useContext(PopperContext)
}

/**
 * 当弹框打开时，滚动至已选项
 * @returns {RefObject} ref
 */
export function useScrollToTarget<T extends HTMLElement>(scrollerRef: RefObject<HTMLElement | null>): RefObject<T | null> {
    const ref = useRef<T>(null)

    const {beforeOpenCallbacks} = usePopperContext()

    const beforeOpen = useCallback(() => {
        const targetEl = ref.current
        const scrollerEl = scrollerRef.current
        if (targetEl && scrollerEl && scrollerEl.scrollHeight > scrollerEl.clientHeight) {
            scrollerEl.scrollTop = targetEl.offsetTop + targetEl.clientHeight / 2 - scrollerEl.clientHeight / 2
        }
    }, [])

    useExternalClass(() => {
        beforeOpenCallbacks.add(beforeOpen)
    }, () => {
        beforeOpenCallbacks.delete(beforeOpen)
    })

    return ref
}