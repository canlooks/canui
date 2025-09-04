import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('form', [
    'item',
    'requiredMark',
    'helperText'
])

export const style = defineCss(({colors, spacing}) => css`
    .${classes.requiredMark} {
        color: ${colors.error.main};
        margin-right: ${spacing[1]}px;
    }

    .${classes.helperText} {
        font-size: ${13 / 14}em;
        color: ${colors.error.main};
    }

    .${classes.item} {
        &:not([data-disable-margin=true]) {
            &[data-label-placement=left], &[data-label-placement=right] {
                margin-bottom: ${spacing[6]}px;

                &[data-size=small] {
                    margin-bottom: ${spacing[4]}px;
                }

                &[data-size=large] {
                    margin-bottom: ${spacing[8]}px;
                }
            }

            &[data-label-placement=top], &[data-label-placement=bottom] {
                margin-bottom: ${spacing[7]}px;

                &[data-size=small] {
                    margin-bottom: ${spacing[5]}px;
                }

                &[data-size=large] {
                    margin-bottom: ${spacing[9]}px;
                }
            }
        }
    }
`)