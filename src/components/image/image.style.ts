import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import Color from 'color'

export const classes = defineInnerClasses('image', [
    'img',
    'skeleton',
    'mask',
    'previewButton'
])

export const style = defineCss(({background, easing, spacing}) => {
    const maskBg = Color(background.content).alpha(.9).string()

    return css`
        @layer reset {
            display: inline-flex;
            position: relative;
            overflow: hidden;

            .${classes.img} {
                width: inherit;
                height: inherit;
            }

            &[data-error=true] {
                .${classes.img} {
                    opacity: 0;
                }
            }

            .${classes.skeleton} {
                height: 100%;
                position: absolute;
                inset: 0;
            }

            .${classes.mask} {
                background-color: ${maskBg};
                position: absolute;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity .25s ${easing.easeOut};

                .${classes.previewButton} {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    gap: ${spacing[2]}px;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
            }

            &:hover {
                .${classes.mask} {
                    opacity: 1;
                }
            }
        }
    `
})