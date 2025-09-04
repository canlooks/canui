import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('card')

export const style = defineCss(({spacing, mode, background, divider, boxShadow, gray}) => [
    css`
        padding: ${spacing[8]}px;
    `,
    ...[mode === 'light'
        ? css`
            background-color: ${background.content};

            &[data-bordered=true] {
                border: 1px solid ${divider};
            }

            &[data-elevation="1"] {
                box-shadow: ${boxShadow[2]};
            }

            &[data-elevation="2"] {
                box-shadow: ${boxShadow[3]};
            }

            &[data-elevation="3"] {
                box-shadow: ${boxShadow[4]};
            }

            &[data-elevation="4"] {
                box-shadow: ${boxShadow[5]};
            }

            &[data-elevation="5"] {
                box-shadow: ${boxShadow[6]};
            }
        `
        : css`
            &[data-elevation="0"] {
                background-color: ${gray(.1)};
            }

            &[data-elevation="1"] {
                background-color: ${gray(.14)};
            }

            &[data-elevation="2"] {
                background-color: ${gray(.2)};
            }

            &[data-elevation="3"] {
                background-color: ${gray(.26)};
            }

            &[data-elevation="4"] {
                background-color: ${gray(.34)};
            }

            &[data-elevation="5"] {
                background-color: ${gray(.45)};
            }
        `
    ]
])