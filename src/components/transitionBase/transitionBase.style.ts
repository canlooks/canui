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
        transition-property: opacity;
        transition-timing-function: ${easing.easeOut};

        &,
        &.appear,
        &.enter {
            opacity: 0;
        }

        &.appear-active,
        &.enter-active,
        &.enter-done,
        &.exit {
            opacity: 1;
        }

        &.exit-active,
        &.exit-done {
            opacity: 0;
        }
    }
`)

export const sweepingStyle = defineCss(({easing}) => css`
    @layer reset {
        transition-property: opacity, width, height;

        &.appear-active,
        &.enter-active,
        &.enter-done {
            transition-timing-function: ${easing.easeOut}, ${easing.bounce}, ${easing.bounce};
        }

        &.exit-active,
        &.exit-done {
            transition-timing-function: ${easing.easeOut};
        }
    }
`)

export function useGrowAndCollapseStyle({orientation, _mode}: Required<Pick<TransitionBaseProps<any>, 'orientation' | '_mode'>>) {
    return useCss(({easing}) => {
        let transformMethod = _mode === 'grow'
            ? 'scale'
            : orientation === 'vertical'
                ? 'scaleY'
                : 'scaleX'

        return css`
            @layer reset {
                transition-property: opacity, transform;
                ${_mode === 'collapse' ? `transform-origin: ${orientation === 'vertical' ? 'top' : 'left'};` : ''}
                &,
                &.appear,
                &.enter {
                    transform: ${transformMethod}(0);
                }

                &.appear-active,
                &.enter-active,
                &.enter-done,
                &.exit {
                    transform: scale(1);
                }

                &.exit-active,
                &.exit-done {
                    transform: ${transformMethod}(0);
                }

                &.appear-active,
                &.enter-active {
                    transition-timing-function: ${easing.easeOut}, ${easing.bounce};
                }

                &.exit-active {
                    transition-timing-function: ${easing.easeOut};
                }
            }
        `
    }, [orientation, _mode])
}

export function useSlideStyle({direction, offset}: Required<Pick<TransitionBaseProps<any>, 'direction' | 'offset'>>) {
    return useCss(({easing}) => {
        const transformMethod = direction === 'up' || direction === 'down' ? 'translateY' : 'translateX'
        let offsetValue = typeof offset === 'number' ? `${offset}px` : offset
        if (direction === 'down' || direction === 'right') {
            offsetValue = '-' + offsetValue
        }

        return css`
            @layer reset {
                transition-property: opacity, transform;

                &,
                &.appear,
                &.enter {
                    pointer-events: none;
                    transform: ${transformMethod}(${offsetValue});
                }

                &.appear-active,
                &.enter-active,
                &.enter-done,
                &.exit {
                    pointer-events: inherit;
                    transform: translate(0);
                }

                &.exit-active,
                &.exit-done {
                    pointer-events: none;
                    transform: ${transformMethod}(${offsetValue});
                }

                &.appear-active,
                &.enter-active {
                    transition-timing-function: ${easing.easeOut}, ${easing.bounce};
                }

                &.exit-active {
                    transition-timing-function: ${easing.easeOut};
                }
            }
        `
    }, [direction, offset])
}