import {useRef, useEffect, RefObject, Dispatch, SetStateAction, useState, useCallback, useMemo, EffectCallback, DependencyList} from 'react'
import {isPromise, getPromiseState, arrayShallowEqual} from './utils'
import {DefineElement} from '../types'

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

    useMemo(() => {
        // StrictMode下，需要重置2次，使prevState保持正确
        derivedState.current = void 0
    }, [])

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

export function useMounted() {

}

/**
 * 得到一个RefObject，用于判断组件是否卸载
 * @param onUnmount 回调函数，卸载时触发
 */
export function useUnmounted(onUnmount?: () => void) {
    const isUnmounted = useRef(false)
    const mountTimes = useRef(0)

    useMemo(() => {
        mountTimes.current++
    }, [])

    useEffect(() => () => {
        if (!--mountTimes.current) {
            isUnmounted.current = true
            onUnmount?.()
        }
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
export function useContainer<T extends HTMLElement | null>(
    container?: DefineElement<T>,
    effectContainer?: DefineElement<T>,
    defaultContainer?: DefineElement<T>
): RefObject<T | null> {
    const [containerEl, setContainerEl] = useDerivedState<T | null>(prev => {
        if (container) {
            return typeof container === 'function' ? container() : container
        }
        return prev || null
    }, [container])

    useEffect(() => {
        let _container = effectContainer || defaultContainer
        if (typeof _container === 'undefined') {
            _container = document.body as T
        }
        if (_container) {
            const el = typeof _container === 'function' ? _container() : _container
            setContainerEl(el)
        }
    }, [effectContainer, defaultContainer])

    return containerEl
}

/**
 * 使用外部类，该方法可避免`StrictMode`下，React渲染行为与外部类实例生命周期不同步的问题
 */
export function useExternalClass<T>(setup: () => T, cleanup?: (instance: T) => void): RefObject<T> {
    const instance = useRef<T>(void 0)
    instance.current ||= setup()

    useUnmounted(() => {
        cleanup?.(instance.current!)
        instance.current = void 0
    })

    return instance as RefObject<T>
}

/**
 * 用法同{@link useEffect}，但StrictMode下不会执行两次
 */
export function useStrictEffect(effect: EffectCallback, deps?: DependencyList) {
    const hasRun = useRef(false)
    const prevDeps = useRef(deps as any[])
    const prevCleanup = useRef<(() => void) | void>(void 0)

    useEffect(() => {
        const isDepsChanged = !arrayShallowEqual(prevDeps.current, deps as any[])

        if (!hasRun.current || isDepsChanged) {
            prevCleanup.current?.()
            prevCleanup.current = effect()
            hasRun.current = true
            prevDeps.current = deps as any[]
        }
    })

    useUnmounted(() => {
        prevCleanup.current?.()
        prevCleanup.current = void 0
    })
}

/**
 * 用法同{@link useEffect}，但会排除首次渲染
 */
export function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
    const mounted = useRef(false)

    useStrictEffect(() => {
        if (!mounted.current) {
            mounted.current = true
            return
        }
        return effect()
    }, deps)
}

/**
 * 用法同{@link useMemo}，但StrictMode下不会执行两次
 */
export function useStrictMemo<T>(factory: () => T, deps: DependencyList) {
    const prevDeps = useRef<any[]>(void 0)
    const memoizedValue = useRef<T>(void 0)

    const isDepsChanged = prevDeps.current ? !arrayShallowEqual(prevDeps.current!, deps as any[]) : true
    if (isDepsChanged) {
        prevDeps.current = deps as any[]
        memoizedValue.current = factory()
    }

    return memoizedValue.current
}