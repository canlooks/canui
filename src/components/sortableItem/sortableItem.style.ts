import {css} from '@emotion/react'
import {defineInnerClasses} from '../../utils'

export const classes = defineInnerClasses('sortable-item')

export const style = css`
    @layer reset {
        &:not([data-no-style=true]) {
            &[data-draggable=true] {
                cursor: grab;

                &:active {
                    cursor: grabbing;
                }
            }
        }
    }
`

export const globalGrabbingStyle = css`
    * {
        cursor: grabbing;
    }
`