import {defineInnerClasses, defineCss} from '@'
import {css, keyframes} from '@emotion/react'

export const classes = defineInnerClasses('code-block', [
    'previewScroller',
    'previewArea',
    'previewSkeleton',
    'codeArea',
    'scroller',
    'container',
    'highlighted',
    'copy',
    'copied',
    'textarea'
])

export const style = defineCss(({divider, background, borderRadius, colors, easing, gray}) => css`
    .${classes.previewScroller} {
        overflow-x: auto;
    }
    
    .${classes.previewArea} {
        padding: 30px 24px;
        border: 1px solid ${divider};
        border-radius: ${borderRadius}px;

        .${classes.previewSkeleton} {
            width: 40%;
            height: 40px;
        }
    }
    
    .${classes.codeArea} {
        background: ${background.body};
        border-radius: ${borderRadius}px;
        margin: 14px 0;
        position: relative;
    }
    
    .${classes.scroller} {
        overflow: auto;
        max-height: 600px;
    }
    
    .${classes.container} {
        min-width: 100%;
        line-height: 1.5;
        float: left;
        position: relative;
        
        &, * {
            font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace !important;
        }
    }
    
    .${classes.highlighted} {
        padding: 24px !important;
        margin: 0 !important;
        
        &, code {
            background: none !important;
            line-height: inherit !important;
        }
    }

    .${classes.copy}, .${classes.copied} {
        position: absolute;
        top: 3px;
        right: 9px;
        z-index: 1;
    }

    .${classes.copied} {
        color: ${colors.success.main};
        padding: 3px 0;
        animation: ${copiedAnimation} .3s ${easing.swing};
    }

    pre {
        margin: 0;
        padding: 24px;
    }

    .${classes.textarea} {
        background: none;
        border: none;
        resize: none;
        outline: none;
        padding: 24px;
        line-height: inherit;
        font-size: inherit;
        white-space: nowrap;
        overflow: hidden;
        position: absolute;
        inset: 0;
         color: transparent;
        caret-color: ${gray(1)};
    }
`)

const copiedAnimation = keyframes`
    0% {
        transform: scale(0);
    }
    
    100% {
        transform: scale(1);
    }
`