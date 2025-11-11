import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as avatarClasses} from './avatar.style'

export const classes = defineInnerClasses('avatar-group', [
    'wrap'
])

export const style = defineCss(({mode, easing}) => css`
    @layer reset {
        display: flex;
        justify-content: flex-start;

        .${classes.wrap} {
            display: flex;
            flex-direction: row-reverse;
        }

        &[data-hoverable=true] {
            .${classes.wrap} {
                cursor: pointer;

                &:hover {
                    .${avatarClasses.root} {
                        margin: 0;
                    }
                }
            }
        }

        .${avatarClasses.root} {
            position: relative;
            border: 1px solid ${mode === 'light' ? '#ffffff' : '#999999'};

            &:not(:last-of-type) {
                transition: margin .25s ${easing.easeOut};
                margin-left: -6px;
            }
        }
    }
`)