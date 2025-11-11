import {css, keyframes} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('skeleton', [
    'children',
    'artical',
    'avatar',
    'text',
    'table'
])

export const style = defineCss(({spacing, mode, gray, borderRadius}) => css`
    @layer reset {
        display: flex;
        background-color: ${gray(.08)};
        position: relative;
        overflow: hidden;

        .${classes.children} {
            padding: ${spacing[1]}px ${spacing[4]}px;
            z-index: 1;
        }

        &:not(:has(.${classes.children})) {
            height: 1em;
        }

        &:not([data-variant=circular]):not(:first-of-type) {
            margin-top: 1em;
        }

        &[data-variant=rounded] {
            border-radius: ${borderRadius}px;
        }

        &[data-variant=circular] {
            display: inline-flex;
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }

        &[data-animation=true] {
            &::after {
                content: '';
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                background-image: linear-gradient(90deg, transparent, ${mode === 'light' ? '#ffffff' : gray(.2)}, transparent);
                animation: ${anim} 1.8s infinite;
            }
        }
    }
`)

const anim = keyframes`
    0% {
        left: -100%;
    }

    100% {
        left: 100%;
    }
`

export const articalStyle = defineCss(({spacing}) => css`
    @layer reset {
        display: flex;
        gap: ${spacing[4]}px;

        .${classes.text} {
            flex: 1
        }
    }
`)

export const tableStyle = defineCss(({spacing}) => css`
    @layer reset {
        width: 100%;
        border-spacing: ${spacing[4]}px;

        tr:first-of-type {
            .${classes.root} {
                height: 24px;
                margin-bottom: ${spacing[3]}px;
            }
        }

        td {
            padding: 0;

            &:last-of-type {
                width: 10%;
            }
        }
    }
`)