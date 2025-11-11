import {css} from '@emotion/react'
import {defineInnerClasses, defineCss, responsiveStyles} from '@'
import Color from 'color'
import {classes as buttonClasses} from '@/components/button/button.style'

export const classes = defineInnerClasses('layout', [
    'contentWrap',
    'sideLeft',
    'sideRight',
    'header',
    'menuButton',
    'title',
    'footer',
    'copyright',
    'sideMenuTitle',
    'segmentedLabel',
    'categoryDivider',
    'tabs',
    'searchInput',
    'searchButton',
    'pageContent',
    'content',
    'pageFooter',
    'navigation'
])

export const headerHeight = 60
export const navigationMarginTop = 40

export const style = defineCss(({background, text, colors, divider}) => [
    css`
        background-image: linear-gradient(90deg, ${background.body} 50%, ${background.content} 50%);

        .${classes.contentWrap} {
            padding: 0 24px;
            max-width: 1536px;
            margin: 0 auto;
        }

        .${classes.sideLeft} {
            position: sticky;
            top: 0;

            .${classes.title} {
                font-size: ${18 / 14}em;
                font-weight: bold;
                color: ${text.disabled};

                > span {
                    color: transparent;
                    background: linear-gradient(90deg, ${colors.primary.main}, ${colors.secondary.main});
                    background-clip: text;
                }
            }

            .${classes.footer} {
                border-top: 1px solid ${divider};
            }

            .${classes.copyright} {
                color: ${text.disabled};
            }

            .${classes.sideMenuTitle} {
                margin: 42px 0 14px;
                padding-left: 12px;
                
                 > p {
                     margin: 0;
                 }
                
                .${classes.segmentedLabel} {
                    color: ${text.secondary};
                }
            }
            
            .${classes.categoryDivider} {
                color: ${text.disabled};
                margin: 15px 0 9px;
            }
        }

        .${classes.sideRight} {
            background: ${background.content};
            box-shadow: -30px 0 30px rgba(0, 0, 0, .03);

            .${classes.header} {
                background-color: ${Color(background.content).alpha(.8).string()};
                backdrop-filter: blur(9px);
                border-bottom: 1px solid ${divider};
                position: sticky;
                top: 0;
                z-index: 500;

                .${classes.menuButton} {
                    width: 32px;
                    height: 32px;
                    padding: 0;
                    display: none;
                }

                .${classes.tabs} {
                    height: calc(100% + 1px);

                    &::after {
                        display: none;
                    }
                }

                .${buttonClasses.root} {
                    padding: 0 9px;
                }
            }

            .${classes.content} {
                min-width: 0;
                flex: 1;
                
                .${classes.pageFooter} {
                    border-top: 1px solid ${divider};
                }
            }

            .${classes.navigation} {
                width: 240px;
                margin-top: ${navigationMarginTop}px;
                position: sticky;
                top: ${headerHeight + navigationMarginTop}px;
            }
        }

        .${classes.header} {
            height: ${headerHeight}px;
            align-items: center;
        }
    `,
    responsiveStyles({
        lg: css`
            .${classes.sideRight} {
                .${classes.navigation} {
                    display: none;
                }
            }
        `,
        md: css`
            background-image: none;
            background-color: ${background.content};

            .${classes.sideLeft} {
                display: none !important;
            }

            .${classes.sideRight} {
                box-shadow: none;

                .${classes.header} {
                    padding: 0 !important;

                    .${classes.menuButton} {
                        display: flex;
                    }
                }

                .${classes.pageContent} {
                    padding: 0 !important;
                }
            }
        `,
        sm: css`
            .${classes.sideRight} {
                .${classes.searchInput} {
                    display: none;
                }

                .${classes.searchButton} {
                    display: flex !important;
                }
            }
        `
    })
])