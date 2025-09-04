import {memo} from 'react'
import {classes, style} from './divider.style'
import {clsx} from '../../utils'
import {DivProps} from '../../types'

export interface DividerProps extends DivProps {
    textAlign?: 'start' | 'center' | 'end'
    /**
     * {@link textAlign}为`start`或`end`时有效，表示text至边缘的距离，默认为`36`
     */
    alignMargin?: number | string
    orientation?: 'horizontal' | 'vertical'
    /**
     * {@link orientation}为'horizontal'时表示上下边距；{@link orientation}为`vertical`时，表示左右边距
     */
    margin?: number | string
}

export const Divider = memo(({
    textAlign = 'center',
    alignMargin = 36,
    orientation = 'horizontal',
    margin,
    ...props
}: DividerProps) => {
    const styleProp = orientation === 'horizontal' ? 'width' : 'height'

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            style={{
                margin: typeof margin === 'number'
                    ? orientation === 'horizontal' ? `${margin}px 0` : `0 ${margin}px`
                    : margin,
                ...props.style
            }}
            data-orientation={orientation}
        >
            <div
                className={`${classes.line} ${classes.beforeLine}`}
                style={{
                    flex: !props.children || textAlign !== 'start' ? 1 : void 0,
                    [styleProp]: textAlign === 'start' ? alignMargin : void 0
                }}
            />

            {!!props.children &&
                <div className={classes.content}>{props.children}</div>
            }

            {!!props.children &&
                <div
                    className={`${classes.line} ${classes.afterLine}`}
                    style={{
                        flex: textAlign !== 'end' ? 1 : void 0,
                        [styleProp]: textAlign === 'end' ? alignMargin : void 0
                    }}
                />
            }
        </div>
    )
})