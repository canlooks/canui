import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('descriptions', [
    'item',
    'label',
    'colon',
    'content',
    'col',
    'labelCol',
    'contentCol',
    'vertical',
    'verticalColWrap'
])

export const tableStyle = defineCss(({divider, spacing, background}) => css`
    width: 100%;
    border-collapse: collapse;

    td {
        padding: 0;
        border: 1px solid ${divider};
    }

    .${classes.col} {
        &:not([data-disable-padding=true]) {
            padding: 12px ${spacing[5]}px;

            &[data-size=small] {
                padding: 7px ${spacing[4]}px;
            }
            
            &[data-size=large] {
                padding: 17px ${spacing[6]}px;
            }
        }
    }

    .${classes.labelCol} {
        background-color: ${background.fixed};
    }

    .${classes.vertical} {
        vertical-align: top;
    }

    .${classes.verticalColWrap} {
        height: 100%;
        display: flex;
        flex-direction: column;

        .${classes.labelCol} {
            flex: 1;
            border-bottom: 1px solid ${divider};
        }
    }
`)

export const gridItemStyle = defineCss(({spacing, text}) => css`
    display: flex;
    gap: ${spacing[1]}px 0;

    &[data-label-placement=top] {
        flex-direction: column;
    }

    &[data-label-placement=bottom] {
        flex-direction: column-reverse;
    }

    &[data-label-placement=right] {
        flex-direction: row-reverse;
    }

    &:not([data-disable-margin=true]) {
        &[data-label-placement=left], &[data-label-placement=right] {
            margin-bottom: ${spacing[4]}px;

            &[data-size=small] {
                margin-bottom: ${spacing[2]}px;
            }

            &[data-size=large] {
                margin-bottom: ${spacing[6]}px;
            }
        }
        
        &[data-label-placement=top], &[data-label-placement=bottom] {
            margin-bottom: ${spacing[5]}px;

            &[data-size=small] {
                margin-bottom: ${spacing[3]}px;
            }

            &[data-size=large] {
                margin-bottom: ${spacing[7]}px;
            }
        }
    }

    .${classes.label} {
        display: flex;
        align-items: center;
        color: ${text.disabled};

        .${classes.colon} {
            margin-left: 1px;
        }
    }

    .${classes.content} {
        flex: 1;
    }

    &[data-label-placement=left], &[data-label-placement=right] {
        &[data-size=small] {
            .${classes.label} {
                max-height: 24px;
            }
        }

        &[data-size=medium] {
            .${classes.label} {
                max-height: 32px;
            }
        }

        &[data-size=large] {
            .${classes.label} {
                max-height: 40px;
            }
        }
    }

    &[data-label-placement=left] {
        .${classes.label} {
            text-align: right;
            justify-content: flex-end;
            
            + .${classes.content} {
                margin-left: ${spacing[3]}px;
            }
        }
    }

    &[data-label-placement=right] {
        .${classes.content} {
            text-align: right;
            justify-content: flex-end;
        }

        .${classes.label} + .${classes.content} {
            margin-right: ${spacing[3]}px;
        }
    }
`)