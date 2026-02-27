import {css} from '@emotion/react'
import {defineCss, defineInnerClasses} from '../../utils'
import {appStyleCallback} from '../app/app.style'
import {Theme, zIndex} from '../theme'

export const classes = defineInnerClasses('popper', [
    'popper',
])

export const style = defineCss(theme => {
    const {easing} = theme
    return [
        appStyleCallback(theme),
        css`
            @layer reset {
                position: absolute;
                top: 0;
                left: 0;
                z-index: ${zIndex.popper};
                transition-property: transform, opacity;
                
                &[data-animation=true] {
                    transition-duration: .25s;
                }

                &[data-open=true] {
                    transition-timing-function: ${easing.bounce}, ${easing.easeOut};
                    opacity: 1;
                    transform: scale(1);
                }

                &:not([data-open=true]) {
                    transition-timing-function: ${easing.easeIn};
                    opacity: 0;

                    &[data-variant=zoom] {
                        transform: scale(0);
                    }

                    &[data-variant=collapse] {
                        &[data-place-a=top], &[data-place-a=bottom] {
                            transform: scaleY(0);
                        }

                        &[data-place-a=left], &[data-place-a=right] {
                            transform: scaleX(0);
                        }
                    }
                }
            }
        `
    ]
})

/**
 *  通用弹框箭头样式
 * @param colorValue
 * @param arrowSize
 */
export const popperArrowStyle = (colorValue: string, arrowSize = 10) => css`
    [data-show-arrow=true]::before {
        content: '';
        position: absolute;
        width: ${arrowSize}px;
        height: ${arrowSize}px;
        background-color: ${colorValue};
    }

    &[data-place-a=top] {
        [data-show-arrow=true]::before {
            clip-path: polygon(50% 50%, 0 0, 100% 0);
            top: 100%;
            left: calc(50% - ${arrowSize / 2}px);
        }
    }

    &[data-place-a=bottom] {
        [data-show-arrow=true]::before {
            clip-path: polygon(50% 50%, 100% 100%, 0 100%);
            bottom: 100%;
            left: calc(50% - ${arrowSize / 2}px);
        }
    }

    &[data-place-a=left] {
        [data-show-arrow=true]::before {
            clip-path: polygon(50% 50%, 0 0, 0 100%);
            left: 100%;
            top: calc(50% - ${arrowSize / 2}px);
        }
    }

    &[data-place-a=right] {
        [data-show-arrow=true]::before {
            clip-path: polygon(50% 50%, 100% 100%, 100% 0);
            right: 100%;
            top: calc(50% - ${arrowSize / 2}px);
        }
    }

    &[data-place-b=Left] {
        [data-show-arrow=true]::before {
            left: 9px;
        }
    }

    &[data-place-b=Right] {
        [data-show-arrow=true]::before {
            left: auto;
            right: 9px;
        }
    }

    &[data-place-b=Top] {
        [data-show-arrow=true]::before {
            top: 9px;
        }
    }

    &[data-place-b=Bottom] {
        [data-show-arrow=true]::before {
            top: auto;
            bottom: 9px;
        }
    }
`

/**
 *  通用弹框样式
 */
export const popperStyleCallback = ({background, borderRadius, boxShadow}: Theme) => css`
    @layer reset {
        background-color: ${background.content};
        border-radius: ${borderRadius}px;
        box-shadow: ${boxShadow[0]};
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 4px;
    }
`

export const popperStyle = defineCss(popperStyleCallback)