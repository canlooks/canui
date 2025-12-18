import {Ref, ReactNode, ElementType, ComponentProps} from 'react'
import {Id, Obj} from '../types'

/**
 * 生成最简易的随机ID
 * @param namespace
 */
export function getEasyID(namespace = '') {
    return `${namespace}${Date.now()}${Math.random()}`
}

const randomIdAlphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-'

/**
 * 获取任意长度由随机字母组成的ID
 * @param length
 */
export function getShortID(length = 8) {
    const {length: alphabetLength} = randomIdAlphabet
    let id = ''
    while (length--) {
        id += randomIdAlphabet[Math.floor(Math.random() * alphabetLength)]
    }
    return id
}

/**
 * 拼接元素的类名
 * @param classes
 */
export function clsx(...classes: any[]) {
    const ret: string[] = []
    for (let i = 0, {length} = classes; i < length; i++) {
        const cls = classes[i]
        if (!cls) {
            continue
        }
        if (typeof cls === 'object') {
            if (Array.isArray(cls)) {
                cls.length && ret.push(clsx(...cls))
            } else {
                for (const k in cls) {
                    cls[k] && ret.push(k)
                }
            }
        } else {
            ret.push(cls)
        }
    }
    return ret.join(' ')
}

/**
 * 驼峰转分隔
 * @param str
 * @param separator
 */
export function humpToSegmented(str: string, separator = '-') {
    return str.replace(/([A-Z])/g, (_, $1, index) => {
        return index ? separator + $1.toLowerCase() : $1
    })
}

/**
 * 将某个值统一转换成数组或null
 * @param value
 */
export function toArray(value?: undefined | null): null
export function toArray<T>(value: T): T extends any[] ? T : T extends undefined | null ? null : T[]
export function toArray(value: any) {
    return isUnset(value)
        ? null
        : Array.isArray(value) ? value : [value]
}

/**
 * 判断某个值是否为已选中
 * @param value 需要判断的值
 * @param selectedValue 已选中的值，可能为undefined | V | V[]
 */
export function isSelected<V extends Id>(value: V | undefined, selectedValue: V | V[] | undefined) {
    return isUnset(value) || isUnset(selectedValue)
        ? false
        : Array.isArray(selectedValue)
            ? selectedValue.includes(value)
            : selectedValue === value
}

/**
 * 对象深复制
 */
export function cloneDeep<T>(target: T): T {
    if (typeof structuredClone === 'function') {
        return structuredClone(target)
    }
    if (!target || typeof target !== 'object') {
        return target
    }
    if (Array.isArray(target)) {
        return target.map(v => {
            return cloneDeep(v)
        }) as T
    }
    const res: any = {}
    for (const k in target) {
        res[k] = cloneDeep(target[k] as any)
    }
    return res
}

/**
 * 深度合并对象
 */
export function mergeDeep<T extends {}, U>(target: T, source: U): T & U
export function mergeDeep<T extends {}, U, V>(target: T, source: U, source2: V): T & U & V
export function mergeDeep<T extends {}, U, V, W>(target: T, source: U, source2: V, source3: W): T & U & V & W
export function mergeDeep<T extends {}, U, V, W, X>(target: T, source: U, source2: V, source3: W, source4: X): T & U & V & W & X
export function mergeDeep<T extends {}, U, V, W, X, Y>(target: T, source: U, source2: V, source3: W, source4: X, source5: Y): T & U & V & W & X & Y
export function mergeDeep<T extends {}, U, V, W, X, Y, Z>(target: T, source: U, source2: V, source3: W, source4: X, source5: Y, source6: Z): T & U & V & W & X & Y & Z
export function mergeDeep(target: object, ...sources: any[]): any
export function mergeDeep(target: any, ...sources: any[]) {
    for (let i = 0, {length} = sources; i < length; i++) {
        const source = sources[i]
        if (typeof source === 'object' && source) {
            for (const k in source) {
                const v = source[k]
                if (typeof v === 'object' && v) {
                    target[k] ||= Array.isArray(v) ? [] : {}
                    mergeDeep(target[k], v)
                } else {
                    target[k] = v
                }
            }
        }
    }
    return target
}

export function arrayShallowEqual(a: any[], b: any[]) {
    if (a === b) {
        return true
    }
    if (a.length !== b.length) {
        return false
    }
    let isEqual = true
    for (let i = 0, {length} = a; i < length; i++) {
        if (a[i] !== b[i]) {
            isEqual = false
            break
        }
    }
    return isEqual
}

export type OverflowEdge = 'top' | 'bottom' | 'left' | 'right'

/**
 * 判断元素是否完全在目标容器内，用于Popper组件
 * @param target 目标元素
 * @param container 容器
 * @returns 'top' | 'bottom' | 'left' | 'right' | false
 */
export function isElementOverflowed(target: Element, container?: Element): OverflowEdge | false {
    const {left, top, right, bottom} = target.getBoundingClientRect()
    const judge = (containerBounding: Pick<DOMRectReadOnly, 'top' | 'bottom' | 'left' | 'right'>) => {
        if (left < containerBounding.left) {
            return 'left'
        }
        if (top < containerBounding.top) {
            return 'top'
        }
        if (right > containerBounding.right) {
            return 'right'
        }
        if (bottom > containerBounding.bottom) {
            return 'bottom'
        }
        return false
    }
    if (container) {
        return judge(container.getBoundingClientRect())
    }
    const vWidth = window.innerWidth || document.documentElement.clientWidth
    const vHeight = window.innerHeight || document.documentElement.clientHeight
    return judge({left: 0, top: 0, right: vWidth, bottom: vHeight})
}

/**
 * 下一个事件循环
 * @param callback
 */
export function nextTick(callback?: () => void): Promise<void> {
    return new Promise(resolve => {
        queueMicrotask(() => {
            callback?.()
            resolve()
        })
    })
}

/**
 * 克隆Ref
 * @param refs
 */
export function cloneRef<T>(...refs: (Ref<T> | undefined)[]): (ref: T | null) => void {
    return (r: T | null) => {
        refs.forEach(ref => {
            if (ref) {
                if (typeof ref === 'function') {
                    ref(r)
                } else {
                    ref.current = r
                }
            }
        })
    }
}

/**
 * 判断变量是否为undefined或null
 * @param it
 */
export function isUnset(it: any): it is undefined | null {
    return typeof it === 'undefined' || it === null
}

/**
 * 判断变量是否为Promise
 * @param it
 */
export function isPromise<T>(it: any): it is Promise<T> {
    return it instanceof Promise || typeof it?.then === 'function'
}

/**
 * 获取promise的状态
 * @param promise
 */
export function getPromiseState(promise: Promise<any>): Promise<'pending' | 'fulfilled' | 'rejected'>
export function getPromiseState(promise: Promise<any>) {
    const s = Symbol()
    return Promise.race([promise, s]).then(res => {
        return res === s ? 'pending' : 'fulfilled'
    }).catch(() => 'rejected')
}

/**
 * 判断表单控件是否为空值
 * @param value
 */
export function isNoValue(value: any) {
    if (isUnset(value)) {
        return true
    }
    if (Array.isArray(value) || typeof value === 'string') {
        return !value.length
    }
    return false
}

/**
 * 将节点用某个分隔符拼接起来，通常用于渲染多选项
 * @param arr
 * @param callback
 * @param separator
 */
export function joinNodes<T>(arr: T[], callback: (item: T, index: number) => ReactNode, separator: ReactNode = ' / ') {
    return arr.flatMap((item, index) => {
        return index > 0
            ? [separator, callback(item, index)]
            : callback(item, index)
    })
}

/**
 * 修复数字输入框的值，包括最大值最小值限制，以及小数点精度
 * @param value
 * @param param
 */
export type FixInputNumberParam = {
    min?: number
    max?: number
    precision?: number
}

export function fixInputNumber(value: string, {
    min = -Infinity,
    max = Infinity,
    precision
}: FixInputNumberParam) {
    let num = +value
    if (isNaN(num)) {
        return ''
    }
    num = Math.max(
        min,
        Math.min(max, num)
    )
    if (typeof precision === 'number') {
        return num.toFixed(precision)
    }
    return num + ''
}

/**
 * 判断某个元素是否为另一个元素的子元素
 * @param target
 * @param container
 */
export function isChildOf(target: Element | null, container?: Element | null) {
    if (!container) {
        return false
    }
    while (target) {
        if (target === container) {
            return true
        }
        target = target.parentElement
    }
    return false
}

/**
 * 从某个元素开始，一直向上查找
 * @param target
 * @param callback 返回true表示找到，会停止递归
 */
export function findPredecessor(target: Element, callback: (parent: HTMLElement) => any) {
    while (target) {
        const {parentElement} = target
        if (!parentElement || callback(parentElement)) {
            return parentElement
        }
        target = parentElement
    }
    return null
}

/**
 * 监听某个元素的所有祖先元素的滚动事件
 * @param target
 * @param listener
 * @returns {() => void} 返回一个清除函数
 */
export function listenAllPredecessorsScroll(target: Element | Document, listener: (e: Event) => void): () => void {
    const disposers: Function[] = []
    if (target !== document) {
        findPredecessor(target as Element, parent => {
            if (parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth) {
                parent.addEventListener('scroll', listener)
                disposers.push(() => {
                    parent.removeEventListener('scroll', listener)
                })
            }
        })
    }
    document.addEventListener('scroll', listener)
    disposers.push(() => {
        document.removeEventListener('scroll', listener)
    })
    return () => disposers.forEach(disposer => disposer())
}

/**
 * 将数值限制在某个范围内
 */
export function range(value: number, min = -Infinity, max = Infinity) {
    return Math.max(min, Math.min(max, value))
}

/**
 * 对象深度查找，也可赋值
 * @param obj
 * @param keyPath
 * @param setValue
 * @param separator 分隔符，默认为`.`
 */
export function queryDeep<T = any>(obj: any, keyPath: PropertyKey | PropertyKey[], setValue?: (oldValue: any) => T, separator?: string): T
export function queryDeep<T = any>(obj: any, keyPath: PropertyKey | PropertyKey[], separator?: string, setValue?: (oldValue: any) => T): T
export function queryDeep(obj: any, keyPath: PropertyKey | PropertyKey[], a?: any, b?: any) {
    const setValue = typeof b === 'function' ? b
        : typeof a === 'function' ? a
            : void 0
    const separator = typeof b === 'string' ? b
        : typeof a === 'string' ? a
            : '.'

    if (Array.isArray(keyPath)) {
        let result: any = obj
        for (let i = 0, {length} = keyPath; i < length; i++) {
            if (typeof result !== 'object' || result === null) {
                result = void 0
                break
            }
            const k = keyPath[i]
            if (setValue) {
                if (i === length - 1) {
                    result[k] = setValue(result[k])
                } else if (!(k in result)) {
                    const nextKey = keyPath[i + 1]
                    result[k] = (typeof nextKey === 'string' && isNaN(+nextKey)) || typeof nextKey === 'symbol'
                        ? {}
                        : []
                }
            }
            result = result[k]
        }
        return result
    }

    if (typeof keyPath === 'string' && keyPath.includes(separator)) {
        return queryDeep(obj, keyPath.split(separator), setValue)
    }

    if (setValue) {
        obj[keyPath] = setValue(obj[keyPath])
    }
    return obj[keyPath]
}

/**
 * 过滤对象中值为undefined属性
 * @param obj
 * @param undefinedValue 可传入该值，用于替换undefined以删除其他属性
 */
export function filterProperties<T extends Record<string, any>>(obj: T, undefinedValue?: any): T {
    for (const k in obj) {
        if (obj[k] === undefinedValue) {
            delete obj[k]
        }
    }
    return obj
}

/**
 * 合并属性
 */

type ExtendableProps<T> = (T extends ElementType ? ComponentProps<T> : T) & Obj

export function mergeComponentProps<T>(...props: (Partial<ExtendableProps<T>> | null | false | undefined)[]): ExtendableProps<T>
export function mergeComponentProps(...props: any[]) {
    const {length} = props
    if (length <= 1) {
        return props[0]
    }

    const fn = (target: any, source: any) => {
        if (!source) {
            return
        }
        for (const p in source) {
            if (p in target) {
                switch (p) {
                    case 'css':
                        target.css = [...toArray(target.css), ...toArray(source.css)]
                        continue
                    case 'ref':
                        target.ref = cloneRef(target.ref, source.ref)
                        continue
                    case 'className':
                        target.className = clsx(target.className, source.className)
                        continue
                    case 'style':
                        target.style = {...source.style, ...target.style}
                        continue
                    default:
                        const v = source[p]
                        if (typeof v === 'function') {
                            target[p] = (...args: any[]) => {
                                target[p](...args)
                                v(...args)
                            }
                            continue
                        }
                }
            }
            target[p] = source[p]
        }
    }

    const merged = {...props[0]}
    for (let i = 1; i < length; i++) {
        fn(merged, props[i])
    }
    return merged
}