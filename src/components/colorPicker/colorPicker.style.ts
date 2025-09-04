import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as inputBaseClasses} from '../inputBase/inputBase.style'
import {getTranparentBackground} from '../palette/palette.style'
import {popperStyleCallback} from '../popper/popper.style'

export const classes = defineInnerClasses('color-picker', [
    'inputBase',
    'block',
    'blockColor',
    'label',
])

export const style = defineCss(({spacing, borderRadius, divider, background}) => css`
    display: flex;
    align-items: center;
    gap: 12px;
    user-select: none;

    .${classes.inputBase} {
        cursor: pointer;
        padding: ${spacing[1]}px !important;
    
        .${inputBaseClasses.content} {
            display: flex;
            align-items: center;
        }
    
        .${classes.label} {
            line-height: 1;
            margin: 0 ${spacing[2]}px;
        }
    }

    .${classes.block} {
        width: 24px;
        height: 24px;
        border-radius: ${borderRadius}px;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        ${getTranparentBackground(background.body, background.content)}
        background-size: 50% 50%;

        .${classes.blockColor} {
            position: absolute;
            inset: 0;
        }

        &[data-selected=true] {
            &:after {
                content: '';
                position: absolute;
                inset: 4px;
                border-radius: inherit;
                border: 2px solid #ffffff;
            }
        }

        &[data-light=true] {
            border: 1px solid ${divider};

            &:after {
                border-color: #aaa;
            }
        }
    }
    
    &[data-size=small] {
        .${classes.block} {
            width: 16px;
            height: 16px;

            &:after {
                inset: 2px;
            }
        }
    }
    
    &[data-size=large] {
        .${classes.inputBase} {
            padding: ${spacing[2]}px !important;
        }
    
        .${classes.block} {
            width: 26px;
            height: 26px;
        }
    }

    &[data-shape=circular] {
        .${classes.block} {
            border-radius: 50%;
        }
    }
`)

export const colorPickerPopperStyle = defineCss(theme => [
    popperStyleCallback(theme),
    css`
        padding: ${theme.spacing[3]}px;
    `
])