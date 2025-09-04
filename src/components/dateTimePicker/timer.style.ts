import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {menuListPadding} from '../menuItem/menuItem.style'

export const classes = defineInnerClasses('timer', [
    'selectItem',
    'selectItemTitle',
    'selectItemBody',
    'timerItem'
])

export const style = defineCss(({divider}) => css`
    display: flex;
    padding-left: ${menuListPadding}px;
    
    .${classes.selectItem} {
        width: 56px;
        height: 351px;
        display: flex;
        flex-direction: column;
        margin-right: ${menuListPadding}px;
    
        .${classes.selectItemTitle} {
            line-height: 40px;
            padding-left: 12px;
            border-bottom: 1px solid ${divider};
        }
    
        .${classes.selectItemBody} {
            flex: 1;
            overflow: hidden;
            font-size: ${13 / 14}em;
    
            &:hover {
                overflow-y: auto;
            }
    
            .${classes.timerItem} {
                width: 56px;

                &[data-disabled=true] {
                    border-radius: 0;
                }
            }
        }
    }
`)