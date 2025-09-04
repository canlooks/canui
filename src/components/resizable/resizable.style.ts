import {css} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {Handle, ResizableProps} from './resizable'
import Color from 'color'

export const classes = defineInnerClasses('resizable', [
    'container',
    'edge',
    'corner'
])

export const handleCursors: {[P in Handle]?: string} = {
    t: 'n-resize',
    r: 'e-resize',
    b: 's-resize',
    l: 'w-resize',
    tl: 'nw-resize',
    tr: 'ne-resize',
    bl: 'sw-resize',
    br: 'se-resize'
}

export function useStyle({variant, handleSize, handleColor}: Required<Pick<ResizableProps, 'variant' | 'handleSize' | 'handleColor'>>) {
    const color = useColor(handleColor)

    return useCss(({divider, easing}) => {
        const ret = [
            css`
                position: relative;

                .${classes.container} {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    z-index: 0;
                }

                .${classes.edge}, .${classes.corner} {
                    touch-action: none;
                    position: absolute;
                    -webkit-tap-highlight-color: transparent;
                }

                .${classes.edge} {
                    z-index: 1;
        
                    &[data-handle=t], &[data-handle=b] {
                        width: 100%;
                        height: ${handleSize}px;
                        left: 0;
                        cursor: ${handleCursors.t};
                    }
                    
                    &[data-handle=l], &[data-handle=r] {
                        width: ${handleSize}px;
                        height: 100%;
                        top: 0;
                        cursor: ${handleCursors.l};
                    }
                }

                .${classes.corner} {
                    width: ${handleSize}px;
                    height: ${handleSize}px;
                    z-index: 2;

                    &[data-handle=tl] {
                        cursor: ${handleCursors.tl};
                    }
        
                    &[data-handle=tr] {
                        cursor: ${handleCursors.tr};
                    }
        
                    &[data-handle=bl] {
                        cursor: ${handleCursors.bl};
                    }
        
                    &[data-handle=br] {
                        cursor: ${handleCursors.br};
                    }
                }

                &:has([data-dragging=true]) {
                    .${classes.edge}, .${classes.corner} {
                        cursor: inherit;
                    }
                }
            `
        ]

        const linkEdge = (hoverStyle: string, type: 'hover' | 'active') => {
            let style = ''
            const fn = (handle: Handle) => {
                style += `
                    &:has(.${classes.corner}[data-handle=${handle}]:${type}),
                    &:has(.${classes.corner}[data-handle=${handle}][data-dragging=true]) {
                        .${classes.edge} {
                            &[data-handle=${handle[0]}], &[data-handle=${handle[1]}] {
                                ${hoverStyle}
                            }
                        }
                    }
                `
            }
            fn('tl')
            fn('tr')
            fn('bl')
            fn('br')
            return style
        }

        if (variant === 'mouse') {
            const hoverStyle = `
                &:before {
                    transition: background-color 1s ${easing.easeOut};
                    background-color: ${color};
                }
            `

            ret.push(css`
                .${classes.edge} {
                    &:before {
                        content: '';
                        position: absolute;
                    }

                    &:hover, &[data-dragging=true] {
                        ${hoverStyle}
                    }

                    &[data-handle=t], &[data-handle=b] {
                        &:before {
                            width: 100%;
                            height: 1px;
                            top: 50%;
                            left: 0;
                        }
                    }

                    &[data-handle=t] {
                        top: ${-handleSize / 2}px;
                    }
                    
                    &[data-handle=b] {
                        bottom: ${-handleSize / 2}px;
                    }

                    &[data-handle=l], &[data-handle=r] {
                        &:before {
                            width: 1px;
                            height: 100%;
                            top: 0;
                            left: 50%;
                        }
                    }

                    &[data-handle=l] {
                        left: ${-handleSize / 2}px;
                    }
                    
                    &[data-handle=r] {
                        right: ${-handleSize / 2}px;
                    }
                }

                .${classes.corner} {
                    &[data-handle=tl] {
                        top: ${-handleSize / 2}px;
                        left: ${-handleSize / 2}px;
                    }

                    &[data-handle=tr] {
                        top: ${-handleSize / 2}px;
                        right: ${-handleSize / 2}px;
                    }

                    &[data-handle=bl] {
                        bottom: ${-handleSize / 2}px;
                        left: ${-handleSize / 2}px;
                    }

                    &[data-handle=br] {
                        bottom: ${-handleSize / 2}px;
                        right: ${-handleSize / 2}px;
                    }
                }

                ${linkEdge(hoverStyle, 'hover')}
            `)
        } else {
            // variant === 'touch'
            const hoverColor = Color(color).alpha(.2).string()
            const hoverStyle = `
                background-color: ${hoverColor};

                &:before {
                    background-color: #ffffff;
                }
            `

            ret.push(css`
                .${classes.edge}, .${classes.corner} {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;

                    &:active, &[data-dragging=true] {
                        ${hoverStyle}
                    }
                }

                &[data-handle-position=outside] {
                    .${classes.edge} {
                        &[data-handle=t] {
                            top: ${-handleSize}px;
                        }
        
                        &[data-handle=b] {
                            bottom: ${-handleSize}px;
                        }
        
                        &[data-handle=l] {
                            left: ${-handleSize}px;
                        }
        
                        &[data-handle=r] {
                            right: ${-handleSize}px;
                        }
                    }

                    .${classes.corner} {
                        &[data-handle=tl] {
                            top: ${-handleSize}px;
                            left: ${-handleSize}px;
                        }
        
                        &[data-handle=tr] {
                            top: ${-handleSize}px;
                            right: ${-handleSize}px;
                        }
        
                        &[data-handle=bl] {
                            bottom: ${-handleSize}px;
                            left: ${-handleSize}px;
                        }
        
                        &[data-handle=br] {
                            bottom: ${-handleSize}px;
                            right: ${-handleSize}px;
                        }
                    }
                }

                &[data-handle-position=inside] {
                    .${classes.edge} {
                        &[data-handle=t] {
                            top: 0;
                        }
        
                        &[data-handle=b] {
                            bottom: 0;
                        }
        
                        &[data-handle=l] {
                            left: 0;
                        }
        
                        &[data-handle=r] {
                            right: 0;
                        }
                    }

                    .${classes.corner} {
                        &[data-handle=tl] {
                            top: 0;
                            left: 0;
                        }
        
                        &[data-handle=tr] {
                            top: 0;
                            right: 0;
                        }
        
                        &[data-handle=bl] {
                            bottom: 0;
                            left: 0;
                        }
        
                        &[data-handle=br] {
                            bottom: 0;
                            right: 0;
                        }
                    }
                }

                .${classes.edge} {
                    overflow: hidden;
                    
                    &:before {
                        content: '';
                        background-color: ${divider};
                        border-radius: 2px;
                    }
    
                    &[data-handle=t], &[data-handle=b] {
                        &:before {
                            width: 40px;
                            height: 3px;
                        }
                    }
    
                    &[data-handle=l], &[data-handle=r] {
                        &:before {
                            width: 3px;
                            height: 40px;
                        }
                    }
                }
    
                .${classes.corner} {
                    &:before {
                        content: '';
                        width: ${Math.sqrt(handleSize * handleSize)}px;
                        height: 3px;
                        background-color: ${divider};
                        border-radius: 2px;
                    }
    
                    &[data-handle=tl], &[data-handle=br] {
                        &:before {
                            transform: rotate(-45deg);
                        }
                    }
    
                    &[data-handle=tr], &[data-handle=bl] {
                        &:before {
                            transform: rotate(45deg)
                        }
                    }
                }

                ${linkEdge(hoverStyle, 'active')}
            `)
        }
        return ret
    }, [variant, handleSize, color])
}