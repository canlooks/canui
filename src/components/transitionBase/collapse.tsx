import { ElementType, ReactElement, useLayoutEffect, useRef, useState} from 'react'
import {TransitionBase, TransitionBaseProps} from './transitionBase'
import {cloneRef, useUpdateEffect} from '../../utils'
import {MergeProps} from '../../types'

export type CollapseOwnProps = {
    /**
     * 动画实现的方式
     * @enum {'sweeping'}: 通过修改width或height实现
     * @enum {'scaling'}: 通过transform实现
     * 默认为`sweeping`
     */
    transitionType?: 'sweeping' | 'scaling'
    /**
     * 设定折叠后的尺寸
     * {@link transitionType}为"`sweeping"`时有效
     * 默认为`0`
     */
    collapsedSize?: number | (() => number)
}

export type CollapseProps<T extends HTMLElement = HTMLElement, C extends ElementType = 'div'> = MergeProps<CollapseOwnProps, TransitionBaseProps<T, C>>

export const Collapse: <T extends HTMLElement = HTMLElement, C extends ElementType = 'div'>(props: CollapseProps<T, C>) => ReactElement = ({
    transitionType = 'sweeping',
    ...props
}: CollapseProps) => {
    const Component = transitionType === 'sweeping' ? Sweeping : TransitionBase

    return (
        <Component
            {...props}
            _mode={transitionType === 'sweeping' ? '_sweeping' : 'collapse'}
        />
    )
}

const Sweeping: <T extends HTMLElement = HTMLElement, C extends ElementType = 'div'>(props: CollapseProps<T, C>) => ReactElement = ({
    ref,
    in: _in = false,
    orientation = 'vertical',
    collapsedSize = 0,
    appear = true,
    ...props
}: CollapseProps) => {
    const innerRef = useRef<HTMLElement>(null)

    const styleProperty = orientation === 'vertical' ? 'height' : 'width'

    const getCollapsedSize = () => {
        return typeof collapsedSize === 'function' ? collapsedSize() : collapsedSize
    }

    const [size, setSize] = useState(() => !_in ? getCollapsedSize() : 'auto')

    const getFullSize = () => {
        const el = innerRef.current
        let size: number | undefined
        if (el) {
            el.style.transition = 'none'
            const originalSize = el.style[styleProperty]
            el.style[styleProperty] = 'auto'
            size = el[orientation === 'vertical' ? 'offsetHeight' : 'offsetWidth']
            el.style[styleProperty] = originalSize
            el.style.transition = ''
        }
        return size
    }

    const expand = (fromSize?: number) => {
        const fullSize = getFullSize()
        if (typeof fullSize !== 'undefined') {
            if (typeof fromSize !== 'undefined') {
                const el = innerRef.current!
                el.style[styleProperty] = fromSize + 'px'
            }
            requestAnimationFrame(() => {
                setSize(fullSize)
            })
        }
    }

    const getCurrentSize = () => {
        const el = innerRef.current
        if (el) {
            return el[orientation === 'vertical' ? 'offsetHeight' : 'offsetWidth']
        }
    }

    const collapse = () => {
        const currentSize = getCurrentSize()
        if (typeof currentSize !== 'undefined') {
            const el = innerRef.current!
            el.style[styleProperty] = currentSize + 'px'
            requestAnimationFrame(() => {
                setSize(getCollapsedSize())
            })
        }
    }

    useLayoutEffect(() => {
        if (_in && appear) {
            expand(getCollapsedSize())
        }
    }, [])

    useUpdateEffect(() => {
        _in
            ? expand()
            : collapse()
    }, [_in])

    return (
        <TransitionBase
            {...props}
            ref={cloneRef(ref, innerRef)}
            in={_in}
            orientation={orientation}
            appear={appear}
            style={{
                [styleProperty]: size,
                ...props.style
            }}
        />
    )
}