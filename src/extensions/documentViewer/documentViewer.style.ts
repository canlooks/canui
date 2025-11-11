import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as loadingClasses} from '../../components/loading/loading.style'

export const classes = defineInnerClasses('document-viewer', [
    'svgViewer',
    'svgToolbar',
    'svgTitle',
    'svgIcon',
    'svgToolbarRight',
    'svgDivider',
    'svgContainer',
    'svgContent',
    'object'
])

export const iframeStyle = css`
    width: 100%;
    height: 100%;
    border: none;
    display: block;
`

export const svgStyle = defineCss(({spacing, background, divider, text, colors, easing}) => css`
    @layer reset {
        .${loadingClasses.container} {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .${classes.svgToolbar} {
            padding: ${spacing[3]}px ${spacing[8]}px;
            background: ${background.content};
            border-bottom: 1px solid ${divider};
            display: flex;
            align-items: center;
            justify-content: space-between;

            .${classes.svgTitle} {
                display: flex;
                align-items: center;
                gap: ${spacing[2]}px;
                color: ${text.primary};

                .${classes.svgIcon} {
                    color: ${colors.primary.main};
                }
            }

            .${classes.svgToolbarRight} {
                display: flex;
                gap: ${spacing[2]}px;
            }

            .${classes.svgDivider} {
                padding: ${spacing[2]}px 0;
            }
        }

        .${classes.svgContainer} {
            width: 100%;
            flex: 1;
            background-color: ${background.body};
            overflow: hidden;
        }

        .${classes.svgContent}, .${classes.object} {
            width: 100%;
            height: 100%;
        }

        .${classes.object} {
            pointer-events: none;
            user-select: none;
            transition: rotate .4s ${easing.easeOut};
        }
    }
`)