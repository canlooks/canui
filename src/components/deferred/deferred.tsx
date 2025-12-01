import {ReactNode, useDeferredValue, useEffect, useState} from 'react'

export type DeferredPropsWithoutValue = {
    init?: ReactNode
    value?: undefined
    children?: ReactNode | ((updating: boolean, deferredValue: undefined) => ReactNode)
}

export type DeferredPropsWithValue<T> = {
    init?: ReactNode
    value: T
    children?: ReactNode | ((updating: boolean, deferredValue: T) => ReactNode)
}

export function Deferred(props: DeferredPropsWithoutValue): ReactNode
export function Deferred<T>(props: DeferredPropsWithValue<T>): ReactNode
export function Deferred<T>({
    init,
    value,
    children
}: DeferredPropsWithoutValue | DeferredPropsWithValue<T>) {
    const [initialized, setInitialized] = useState(false)
    const deferredInitialized = useDeferredValue(initialized)

    useEffect(() => {
        setInitialized(true)
    }, [])

    const deferredValue = useDeferredValue(value)

    if (!deferredInitialized) {
        return init
    }

    return typeof children === 'function'
        ? children(deferredValue !== value, deferredValue as any)
        : children
}