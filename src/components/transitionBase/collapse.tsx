import {ElementType, ReactElement, useEffect, useRef, useState} from 'react'
import {TransitionBase, TransitionBaseProps} from './transitionBase'
import {cloneRef} from '../../utils'
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
     * 默认为0
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
    appear = true,
    orientation = 'vertical',
    collapsedSize = 0,
    ...props
}: CollapseProps) => {
    const innerRef = useRef<HTMLElement>(null)

    const getCollapsedSize = () => {
        return typeof collapsedSize === 'function' ? collapsedSize() : collapsedSize
    }

    const [size, setSize] = useState(() => {
        if (_in && !appear) {
            return 'auto'
        }
        return getCollapsedSize()
    })

    const [isEntered, setIsEntered] = useState(_in && !appear)

    const expand = () => {
        requestAnimationFrame(() => {
            innerRef.current && setSize(innerRef.current[orientation === 'vertical' ? 'scrollHeight' : 'scrollWidth'])
        })
    }

    const collapse = () => {
        setIsEntered(false)
        requestAnimationFrame(() => {
            setSize(getCollapsedSize())
        })
    }

    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            // 首次渲染
            initialized.current = true
            if (!appear) {
                // 若appear为false，则跳过首次动画
                return
            }
        }
        _in
            ? expand()
            : collapse()
    }, [_in])

    return (
        <TransitionBase
            {...props}
            appear={appear}
            orientation={orientation}
            in={_in}
            ref={cloneRef(ref, innerRef)}
            style={{
                [orientation === 'vertical' ? 'height' : 'width']: isEntered ? 'auto' : size,
                ...!isEntered ? {overflow: 'hidden'} : {},
                ...props.style
            }}
            onEntered={() => setIsEntered(true)}
        />
    )
}