import {css} from '@emotion/react'
import {defineInnerClasses} from '../../utils'

export const classes = defineInnerClasses('sortable-item')
// TODO 测试新的@dnd-kit是否还需要手动处理grab样式
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