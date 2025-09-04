import {createContext, ReactNode, RefObject, useContext, useEffect, useRef} from 'react'

export const DelegationContext = createContext<RefObject<MouseEvent | null>>({
    current: null
})

export function useEventDelegation() {
    return useContext(DelegationContext)
}

export function GlobalEventDelegation(props: {
    children?: ReactNode
}) {
    const contextValue = useRef<MouseEvent>(null)

    useEffect(() => {
        const click = (e: MouseEvent) => {
            contextValue.current = e
        }
        document.addEventListener('click', click, {capture: true})
        return () => {
            document.removeEventListener('click', click)
        }
    }, [])

    return (
        <DelegationContext value={contextValue}>
            {props.children}
        </DelegationContext>
    )
}