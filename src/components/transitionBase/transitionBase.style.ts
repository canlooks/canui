import {css} from '@emotion/react'
import {defineInnerClasses, defineCss, useCss} from '../../utils'
import {TransitionBaseProps} from './transitionBase'

export const classes = defineInnerClasses('transition-base')

export function useTransitionBaseStyle({timeout}: Required<Pick<TransitionBaseProps<any>, 'timeout'>>) {
    const timeoutIsNumber = typeof timeout === 'number'

    return useCss(() => css`
        @layer reset {
            ${timeoutIsNumber ? `transition-duration: ${timeout}ms;` : ''}
            
            &.appear-active {
                ${!timeoutIsNumber ? `transition-duration: ${timeout.appear}ms;` : ''}
            }

            &.enter-active {
                ${!timeoutIsNumber ? `transition-duration: ${timeout.enter}ms;` : ''}
            }

            &.exit-active {
                ${!timeoutIsNumber ? `transition-duration: ${timeout.exit}ms;` : ''}
            }
        }
    `, [timeout])
}

export const fadeStyle = defineCss(({easing}) => css`
    @layer reset {
        transition-property: opacity, transform, width, height;
        transition-timing-function: ${easing.easeOut}, ${easing.bounce}, ${easing.bounce}, ${easing.bounce};
        
        &.appear,
        &.exit,
        &.exit-done {
            opacity: 0;
        }
        
        &.appear-active,
        &.enter,
        &.enter-done {
            opacity: 1;
        }

        &.exit {
            transition-timing-function: ${easing.easeOut};
        }
    }
`)

export function useSweepingStyle({orientation}: Required<Pick<TransitionBaseProps, 'orientation'>>) {
    return useCss(() => css`
        @layer reset {
            &.appear,
            &.appear-active,
            &.enter-active,
            &.exit,
            &.exit-active,
            &.exit-done {
                overflow: hidden;
            }
            
            &.appear-active,
            &.enter-active,
            &.exit-active {
                transition-property: opacity, width, height;
            }
        }
    `, [orientation])
}

export function useGrowAndCollapseStyle({orientation, _mode}: Required<Pick<TransitionBaseProps, 'orientation' | '_mode'>>) {
    let transformMethod = _mode === 'grow'
        ? 'scale'
        : orientation === 'vertical'
            ? 'scaleY'
            : 'scaleX'

    return useCss(({easing}) => css`
        @layer reset {
            ${_mode === 'collapse' ? `transform-origin: ${orientation === 'vertical' ? 'top' : 'left'};` : ''}

            &.appear,
            &.exit,
            &.exit-done {
                transform: ${transformMethod}(0);
            }

            &.appear-active,
            &.enter,
            &.enter-done {
                transform: scale(1);
            }
        }
    `, [orientation, _mode])
}

export function useSlideStyle({direction, offset}: Required<Pick<TransitionBaseProps, 'direction' | 'offset'>>) {
    const transformMethod = direction === 'up' || direction === 'down' ? 'translateY' : 'translateX'
    let offsetValue = typeof offset === 'number' ? `${offset}px` : offset
    if (direction === 'down' || direction === 'right') {
        offsetValue = '-' + offsetValue
    }

    return useCss(() => css`
        @layer reset {
            transition-property: opacity, transform;

            &.appear,
            &.exit,
            &.exit-done {
                pointer-events: none;
                transform: ${transformMethod}(${offsetValue});
            }

            &.appear-active,
            &.enter,
            &.enter-done {
                pointer-events: inherit;
                transform: translate(0);
            }

            &.appear-active,
            &.enter-active,
            &.exit-active {
                transition-property: opacity, transform;
            }
        }
    `, [direction, offset])
}