import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {menuListPadding} from '../menuItem/menuItem.style'

export const classes = defineInnerClasses('calendar', [
    'head',
    'headSide',
    'headControl',
    'headCenter',
    'headButton',
    'body',
    'dateItem',
    'monthItem',
    'yearItem',
    'foot'
])

export const style = defineCss(({divider, text, spacing}) => css`
    @layer reset {
        .${classes.head} {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid ${divider};
            padding: 0 ${menuListPadding}px;
            position: relative;

            .${classes.headSide} {
                z-index: 1;
            }

            .${classes.headControl} {
                color: ${text.placeholder};
            }

            .${classes.headCenter} {
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                inset: 0;

                .${classes.headButton} {
                    font-weight: bold;
                    color: ${text.primary};
                }
            }
        }

        .${classes.body} {
            padding: ${spacing[3]}px ${spacing[4]}px;
            display: grid;
            place-items: center;

            &[data-view-type=date] {
                font-size: ${13 / 14}em;
                grid-template-columns: repeat(7, 36px);
                grid-template-rows: repeat(7, 36px);

                .${classes.dateItem} {
                    width: 24px;
                    height: 24px;

                    &:not([data-variant=filled]) {
                        color: ${text.primary};
                        border-color: ${text.disabled};

                        &[data-other-month=true] {
                            color: ${text.placeholder};
                        }
                    }

                    &:disabled {
                        width: 100%;
                        border-radius: 0;
                    }
                }
            }

            &[data-view-type=month], &[data-view-type=year] {
                grid-template-columns: repeat(3, 84px);
                grid-template-rows: repeat(4, 63px);

                .${classes.monthItem},
                .${classes.yearItem} {
                    width: 72px;
                    padding-inline: 0;

                    &:not([data-variant=filled]) {
                        color: ${text.primary};
                    }
                }
            }
        }

        &[data-size=small] {
            .${classes.body} {
                &[data-view-type=date] {
                    grid-template-columns: repeat(7, 30px);
                    grid-template-rows: repeat(7, 30px);
                }

                &[data-view-type=month], &[data-view-type=year] {
                    grid-template-columns: repeat(3, 70px);
                    grid-template-rows: repeat(4, 52.5px);

                    .${classes.monthItem},
                    .${classes.yearItem} {
                        width: 60px;
                    }
                }
            }
        }

        &[data-size=large] {
            .${classes.body} {
                &[data-view-type=date] {
                    font-size: 1em;
                    grid-template-columns: repeat(7, 42px);
                    grid-template-rows: repeat(7, 42px);

                    .${classes.dateItem} {
                        width: 32px;
                        height: 32px;
                    }
                }

                &[data-view-type=month], &[data-view-type=year] {
                    grid-template-columns: repeat(3, 98px);
                    grid-template-rows: repeat(4, 73.5px);
                }
            }
        }

        .${classes.foot} {
            height: 41px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-top: 1px solid ${divider};
        }
    }
`)