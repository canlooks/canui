import {defineInnerClasses, defineCss} from '../../utils'
import {css} from '@emotion/react'
import {classes as progressClasses} from '../progress/progress.style'

export const classes = defineInnerClasses('loading-mask', [
    'indicator',
    'text',
    'progress'
])

export const style = defineCss(({spacing, text}) => css`
    @layer reset {
        .${classes.indicator} {
            display: flex;
            gap: ${spacing[2]}px;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .${classes.text} {
                color: ${text.secondary};
            }
        }

        .${classes.progress} {
            width: calc(100% - 24px);
            max-width: 300px;

            .${progressClasses.track} {
                height: 4px;
            }
        }

        &[data-show-progress=true] .${classes.indicator} {
            flex-direction: row;
        }
    }
`)