import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('slidable-actions', [
    'content',
    'actions',
    'actionsLeft',
    'actionsRight',
    'actionItem',
    'actionItemButton',
    'actionItemIcon'
])

export const style = defineCss(({background}) => css`
    position: relative;
    overflow: hidden;

    .${classes.content} {
        touch-action: pan-y;
        position: relative;
        z-index: 1;
    }

    .${classes.actions} {
        position: absolute;
        inset: 0;

        .${classes.actionsLeft}, .${classes.actionsRight} {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;

            .${classes.actionItem} {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                color: ${background.content};
                position: absolute;
                top: 0;

                .${classes.actionItemButton} {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 0 18px;
                    border-radius: 0;
                }

                .${classes.actionItemIcon} {
                    display: flex;
                }
            }
        }

        .${classes.actionsLeft} {
            right: 100%;

            .${classes.actionItem} {
                align-items: flex-end;
                right: 0;
            }
        }

        .${classes.actionsRight} {
            left: 100%;

            .${classes.actionItem} {
                align-items: flex-start;
                left: 0;
            }
        }
    }

    &:not([data-dragging=true]) {
        .${classes.content}, .${classes.actionItem} {
            transition: translate .25s ease-out;
        }
    }
`)