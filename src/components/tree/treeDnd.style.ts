import {defineInnerClasses, useCss} from '../../utils'
import {css} from '@emotion/react'
import {classes} from './tree.style'
import Color from 'color'

export const treeDndClasses = defineInnerClasses('tree-dnd', [
    'levelBlock',
    'dragHandle',
    'mask',
    'predecessor',
    'sibling',
    'siblingPrev',
    'siblingNext',
    'child'
])

export function useStyle({indent}: {
    indent: number
}) {
    return useCss(({mode, spacing, gray, colors}) => css`
        .${classes.node} {
            position: relative;
            
            &[data-dragging=true] {
                background-color: ${Color(colors.primary.main).alpha(mode === 'light' ? .13 : .23).string()} !important;
            }
            
            &[data-active=true] {
                outline: 2px solid ${colors.primary.main};
            }
        }

        .${treeDndClasses.dragHandle} {
            width: 20px;
            margin-right: ${spacing[3]}px;
            text-align: center;
            color: ${gray(.12)};
            cursor: grab;
        }

        .${treeDndClasses.mask} {
            display: flex;
            position: absolute;
            inset: 0;
            z-index: 1;

            .${classes.indent}:after {
                display: none;
            }

            .${treeDndClasses.predecessor} {
                width: ${indent}px;
                position: relative;
                
                &:has(+ .${treeDndClasses.sibling}) {
                    width: 29px;
                }
                
                &[data-active=true] {
                    &:before, &:after {
                        content: '';
                        position: absolute;
                    }

                    &:before {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        border: 2px solid ${colors.primary.main};
                        left: 0;
                        bottom: -4px;
                    }

                    &:after {
                        width: calc(100% - 8px);
                        height: 2px;
                        background: ${colors.primary.main};
                        left: 8px;
                        bottom: -1px;
                    }
                    
                    & + .${treeDndClasses.sibling} {
                        &:after {
                            content: '';
                            width: 100%;
                            height: 2px;
                            background: ${colors.primary.main};
                            position: absolute;
                            left: 0;
                            bottom: -1px;
                        }
                    }
                }
            }
            
            .${treeDndClasses.sibling} {
                width: ${indent * 2}px;
                flex: 1;
                display: flex;
                flex-direction: column;
                position: relative;
                
                .${treeDndClasses.siblingPrev}, .${treeDndClasses.siblingNext} {
                    flex: 1;
                    position: relative;
                    
                    &[data-active=true] {
                        &:before, &:after {
                            content: '';
                            position: absolute;
                        }
                        
                        &:before {
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            border: 2px solid ${colors.primary.main};
                            left: 0;
                        }
                        
                        &:after {
                            width: calc(100% - 8px);
                            height: 2px;
                            background: ${colors.primary.main};
                            left: 8px;
                        }
                    }
                }

                .${treeDndClasses.siblingPrev} {
                    &:before {
                        top: -4px
                    }
                    
                    &:after {
                        top: -1px;
                    }
                }

                .${treeDndClasses.siblingNext} {
                    &:before {
                        bottom: -4px;
                    }
                    
                    &:after {
                        bottom: -1px;
                    }
                }

                .${treeDndClasses.child} {
                    width: calc(100% - ${indent * 2}px);
                    height: 50%;
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    
                    &[data-active=true] {
                        &:before, &:after {
                            content: '';
                            position: absolute;
                            bottom: -1px;
                        }
                        
                        &:before {
                            width: 8px;
                            height: 8px;
                            border-left: 2px solid ${colors.primary.main};
                            border-bottom: 2px solid ${colors.primary.main};
                            left: 0;
                            
                        }
                        
                        &:after {
                            width: calc(100% - 12px);
                            height: 2px;
                            background: ${colors.primary.main};
                            left: 12px;
                        }
                    }
                }
            }
        }
        
        .${treeDndClasses.levelBlock} {
            &[data-active=true] {
                outline: 1px dashed ${colors.primary.main};
            }
        }
    `, [indent])
}