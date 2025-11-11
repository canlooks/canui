import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as tagClasses} from '../tag/tag.style'

export const classes = defineInnerClasses('tree-select', [
    'contentWrap',
    'placeholder',
    'backfill',
    'backfillWrap',
    'arrow'
])

export const style = defineCss(({spacing, text, easing}) => css`
    @layer reset {
        cursor: pointer;
        position: relative;

        .${classes.contentWrap} {
            display: flex;
            align-items: center;
            gap: ${spacing[1]}px;
        }

        .${classes.placeholder} {
            flex: 1;
            color: ${text.placeholder};
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .${classes.backfill} {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-wrap: wrap;
            gap: ${spacing[1]}px;

            .${tagClasses.root} {
                min-width: 0;
            }

            .${tagClasses.content},
            .${classes.backfillWrap} {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }

        .${classes.arrow} {
            color: ${text.placeholder};
            transition: transform .25s ${easing.easeOut};

            &[data-open=true] {
                transform: rotate(180deg);
            }
        }
    }
`)