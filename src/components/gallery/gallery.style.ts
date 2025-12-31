import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('image-preview', [
    'button',
    'control',
    'swap',
    'counter',
    'galleryContainer',
    'galleryWrapper',
    'imageItem',
    'image'
])

export const style = defineCss(({spacing, easing, breakpoints}) => css`
    @layer reset {
        .${classes.control} {
            display: flex;
            gap: ${spacing[4]}px;
            position: absolute;
            top: ${spacing[10]}px;
            right: ${spacing[10]}px;
            z-index: 1;
        }

        .${classes.swap} {
            width: 100%;
            height: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 ${spacing[8]}px;
            position: absolute;
            top: 50%;
            left: 0;
            z-index: 1;
        }

        .${classes.counter} {
            line-height: 40px;
            padding: 0 24px;
            border-radius: 1000em;
            color: #ffffff;
            background-color: rgba(0, 0, 0, .3);
            position: absolute;
            bottom: ${spacing[10]}px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
        }

        .${classes.button} {
            background-image: none !important;
            background-color: rgba(0, 0, 0, .4);
            transition: background-color .25s ${easing.easeOut};

            &:hover {
                background-color: rgba(0, 0, 0, .3);
            }

            &:active {
                transition: background-color 0s;
                background-color: rgba(0, 0, 0, .5);
            }

            &:last-of-type {
                margin-left: ${spacing[4]}px;
            }
        }

        .${classes.galleryContainer} {
            &, .${classes.galleryWrapper}, .${classes.imageItem}, .${classes.image} {
                width: 100%;
                height: 100%;
            }

            overflow: hidden;
            position: relative;

            .${classes.galleryWrapper} {
                &, .${classes.imageItem} {
                    position: absolute;
                    top: 0;
                }

                &[data-transition=true] {
                    transition: left .4s ${easing.ease};
                }

                &[data-transition=bounce] {
                    transition: left .25s ${easing.bounce};
                }

                .${classes.imageItem} {
                    padding: 90px;

                    .${classes.image} {
                        object-fit: contain;
                    }
                }
            }
        }

        @media (max-width: ${breakpoints.sm}px) {
            .${classes.control}, .${classes.swap}, .${classes.button} {
                display: none;
            }

            .${classes.galleryContainer} .${classes.galleryWrapper} {
                .${classes.imageItem} {
                    padding: 0;
                }
            }
        }
    }
`)
