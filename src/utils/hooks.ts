import {useRef, useEffect, RefObject, Dispatch, SetStateAction, useState, useCallback, useMemo} from 'react'
import {isPromise, getPromiseState} from './utils'
import {DefineElement} from '../types'

/**
 * 获取渲染前的值
 * @param value
 */
export function usePrev<T>(value: T) {
    const prev = useRef<T>(null)
    useEffect(() => {
        prev.current = value
    })
    return prev.current
}

/**
 * 将某个值使用ref同步，主要用于对付组件的闭包问题
 * @param value
 */
export function useSync<T>(value: T) {
    const v = useRef<T>(value)
    v.current = value
    return v
}

/**
 * 同步的状态，state包裹在ref内，主要用于对付组件的闭包问题
 * @param initialState
 */
export function useSyncState<T>(initialState: T | (() => T)): [RefObject<T>, Dispatch<SetStateAction<T>>]
export function useSyncState<T = undefined>(): [RefObject<T | undefined>, Dispatch<SetStateAction<T | undefined>>]
export function useSyncState(initialState?: any): [RefObject<any>, Dispatch<SetStateAction<any>>] {
    const [state, setState] = useState(initialState)
    const synState = useSync(state)
    return [
        synState,
        useCallback(state => {
            const newState = typeof state === 'function' ? state(synState.current) : state
            synState.current !== newState && setState(synState.current = newState)
        }, [])
    ]
}

/**
 * 强制更新组件
 */
export function useForceUpdate() {
    const [, setState] = useState<symbol>()
    return useCallback(() => {
        setState(Symbol())
    }, [])
}

/**
 * 派生状态
 * @param referredState 原始状态
 * @param deps 依赖，类似useMemo的第二个参数，当依赖改变时会更新派生状态，若无该参数，则状态本身将会作为依赖
 */
export function useDerivedState<T>(referredState: (prevState: T | undefined) => T, deps: any[]): [RefObject<T>, Dispatch<SetStateAction<T>>]
export function useDerivedState<T>(referredState: T, deps?: any[]): [RefObject<T>, Dispatch<SetStateAction<T>>]
export function useDerivedState(referredState: any, deps?: any[]) {
    const derivedState = useRef(void 0)

    const updateState = (state: SetStateAction<any>) => {
        const newState = typeof state === 'function' ? state(derivedState.current) : state
        if (derivedState.current !== newState) {
            derivedState.current = newState
            return true
        }
        return false
    }

    useMemo(() => {
        updateState(referredState)
    }, deps || [referredState])

    const forceUpdate = useForceUpdate()

    return [
        derivedState,
        useCallback((state: SetStateAction<any>) => {
            // updateState()返回true才需要强制更新
            updateState(state) && forceUpdate()
        }, [])
    ]
}

/**
 * 组件卸载后得到{current: true}
 * @returns
 */
export function useUnmounted() {
    const isUnmounted = useRef(false)
    useEffect(() => () => {
        isUnmounted.current = true
    }, [])
    return isUnmounted
}

/**
 * 处理受控组件的外部属性与内部属性
 * @param defaultValue
 * @param value
 * @param onChange
 */
export function useControlled<T = any>(defaultValue: T, value?: T, onChange?: (value: T) => void): [RefObject<T>, Dispatch<SetStateAction<T>>]
export function useControlled<T = any>(defaultValue?: T, value?: T, onChange?: (value: T) => void): [RefObject<T | undefined>, Dispatch<SetStateAction<T | undefined>>]
export function useControlled<T = any>(defaultValue: () => T, value?: T, onChange?: (value: T) => void): [RefObject<T | undefined>, Dispatch<SetStateAction<T | undefined>>]
export function useControlled(defaultValue?: any, value?: any, onChange?: (value: any) => void) {
    const [state, setState] = useState(defaultValue)
    const sync = useSync({value, onChange})
    const innerState = useSync(typeof value !== 'undefined' ? value : state)

    return [
        innerState,
        useCallback((state: any) => {
            const newState = typeof state === 'function' ? state(innerState.current) : state
            if (innerState.current !== newState) {
                typeof sync.current.value === 'undefined' && setState(newState)
                sync.current.onChange?.(newState)
            }
        }, [])
    ]
}

/**
 * 将某个方法使用loading包裹
 */
export function useLoading<A extends any[], R>(fn: (...args: A) => R | Promise<R>, referredLoading = false): [
    RefObject<boolean>,
    (...args: A) => Promise<R>,
    Dispatch<SetStateAction<boolean>>
] {
    const [loading, setLoading] = useDerivedState(referredLoading)

    const syncFn = useSync(fn)

    const unmounted = useUnmounted()

    return [
        loading,
        useCallback(async (...args: A) => {
            const res = syncFn.current(...args)
            if (isPromise(res) && await getPromiseState(res) === 'pending') {
                setLoading(true)
                try {
                    return await res
                } finally {
                    !unmounted.current && setLoading(false)
                }
            }
            return res
        }, []),
        setLoading
    ]
}

/**
 * 获取容器元素，通常用于`container`或`effectContainer`属性
 * @param container
 * @param effectContainer
 * @param defaultContainer 默认为`document.body`
 */
export function useContainer<T extends HTMLElement | null>(container?: DefineElement<T>, effectContainer?: DefineElement<T>, defaultContainer: T = document.body as T): RefObject<T> {
    const [containerEl, setContainerEl] = useDerivedState<T>(prev => {
        if (container) {
            return typeof container === 'function' ? container() : container
        }
        return prev || defaultContainer
    }, [container, defaultContainer])

    useEffect(() => {
        if (effectContainer) {
            const el = typeof effectContainer === 'function' ? effectContainer() : effectContainer
            setContainerEl(el)
        }
    }, [])

    return containerEl
}