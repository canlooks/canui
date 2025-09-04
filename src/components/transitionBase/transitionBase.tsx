import {ElementType, ReactElement, useRef} from 'react'
import {CSSTransition} from 'react-transition-group'
import {TimeoutProps} from 'react-transition-group/Transition'
import {classes, fadeStyle, sweepingStyle, useGrowAndCollapseStyle, useSlideStyle, useTransitionBaseStyle} from './transitionBase.style'
import {SerializedStyles} from '@emotion/react'
import {clsx, cloneRef} from '../../utils'
import {OverridableProps} from '../../types'

export interface TransitionBaseOwnProps<T extends HTMLElement = HTMLElement> extends Omit<Partial<TimeoutProps<T>>, 'children'> {
    /** {@link _mode}"collapse"时生效，展开与收起的方向 默认为`vertical` */
    orientation?: 'vertical' | 'horizontal'
    /** {@link _mode}"slide"时生效，滑入的方向 */
    direction?: 'left' | 'right' | 'up' | 'down'
    /** {@link _mode}"slide"时生效，滑入前的偏移量 */
    offset?: string | number
    /** @private 内部使用，以下预设的过渡组件均继承该组件 */
    _mode?: '_sweeping' | 'collapse' | 'grow' | 'fade' | 'slide'
}

export type TransitionBaseProps<T extends HTMLElement = HTMLElement, C extends ElementType = 'div'> = OverridableProps<TransitionBaseOwnProps<T>, C>

export const TransitionBase = (({
    ref,
    component: Component = 'div',
    orientation = 'vertical',
    direction = 'down',
    offset = '100%',
    timeout = 300,
    appear = true,
    _mode,
    ...props
}: TransitionBaseProps) => {
    const cssArr: (SerializedStyles | (() => SerializedStyles))[] = [
        useTransitionBaseStyle({timeout})
    ]

    if (typeof _mode !== 'undefined') {
        cssArr.push(fadeStyle)
        switch (_mode) {
            case '_sweeping':
                cssArr.push(sweepingStyle)
                break
            case 'collapse':
            case 'grow':
                cssArr.push(useGrowAndCollapseStyle({orientation, _mode}))
                break
            case 'slide':
                cssArr.push(useSlideStyle({direction, offset}))
        }
    }

    const innerRef = useRef(null)

    return (
        <CSSTransition
            {...props}
            css={cssArr}
            nodeRef={innerRef}
            className={clsx(classes.root, props.className)}
            timeout={timeout}
            appear={appear}
        >
            <Component ref={cloneRef(ref, innerRef)}>
                {props.children}
            </Component>
        </CSSTransition>
    )
}) as <T extends HTMLElement = HTMLElement, C extends ElementType = 'div'>(props: TransitionBaseProps<T, C>) => ReactElement