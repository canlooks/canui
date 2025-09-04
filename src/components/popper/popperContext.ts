import {createContext, SetStateAction, useContext, useRef, RefObject, useEffect} from 'react'

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
export function useScrollToSelected<T extends HTMLElement>(scrollerRef: RefObject<Element | null>): RefObject<T | null> {
    const ref = useRef<T>(null)

    const {beforeOpenCallbacks} = usePopperContext()

    useEffect(() => {
        const beforeOpen = () => {
            if (ref.current && scrollerRef.current && scrollerRef.current.scrollHeight > scrollerRef.current.clientHeight) {
                scrollerRef.current.scrollTop = ref.current.offsetTop - scrollerRef.current.clientHeight / 2 + ref.current.clientHeight / 2
            }
        }
        beforeOpenCallbacks.add(beforeOpen)
        return () => {
            beforeOpenCallbacks.delete(beforeOpen)
        }
    }, [])

    return ref
}