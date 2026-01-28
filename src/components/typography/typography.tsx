import React, {CSSProperties, ComponentType, ReactNode, memo, useRef, useState, ElementType} from 'react'
import {ColorPropsValue, OverridableProps} from '../../types'
import {clsx, cloneRef, useUnmounted} from '../../utils'
import {useStyle, classes, editStyle} from './typography.style'
import {Button, ButtonProps} from '../button'
import {Tooltip} from '../tooltip'
import {Input, InputProps} from '../input'
import {TextareaProps, Textarea} from '../textarea'
import {Icon} from '../icon'
import {faCheck} from '@fortawesome/free-solid-svg-icons/faCheck'
import {faCopy} from '@fortawesome/free-regular-svg-icons/faCopy'
import {faPenToSquare} from '@fortawesome/free-regular-svg-icons/faPenToSquare'

export type TypographyOwnProps = {
    /** 默认为`text.primary` */
    color?: ColorPropsValue
    editable?: boolean
    onEditFinish?(text: string): void
    copyable?: boolean
    onCopy?(text: string): void
    editComponentProps?: InputProps | TextareaProps
    /** 超过该行数会显示省略号，0表示不省略，默认为`0` */
    ellipsisRows?: number
    wordBreak?: CSSProperties['wordBreak']
    expandable?: boolean
    expandButtonProps?: ButtonProps
}

export type TypographyProps<C extends ElementType = 'p'> = OverridableProps<TypographyOwnProps, C>

type TypographyComponent<C extends ElementType = 'p'> = (props: TypographyProps<C>) => ReactNode

export const Typography = memo(({
    component: Component = 'p',
    color = 'text.primary',
    editable,
    onEditFinish,
    copyable,
    onCopy,
    editComponentProps,
    ellipsisRows = 0,
    wordBreak = 'break-all',
    expandable,
    expandButtonProps,
    ...props
}: TypographyProps) => {
    /**
     * -------------------------------------------------------------------
     * 编辑
     */

    const [editing, setEditing] = useState(false)
    const [multipleRows, setMultipleRows] = useState(false)

    const [originHeight, setOriginHeight] = useState(0)

    const [defaultText, setDefaultText] = useState('')

    const innerRef = useRef<HTMLElement>(null)

    const editHandler = () => {
        const {height, lineHeight, marginTop, marginBottom} = getComputedStyle(innerRef.current!)
        const heightNum = parseFloat(height)
        setOriginHeight(heightNum + parseFloat(marginTop) + parseFloat(marginBottom))
        setDefaultText(innerRef.current!.innerText)
        setMultipleRows(heightNum >= parseFloat(lineHeight) * 2)
        setEditing(true)
    }

    const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
        setEditing(false)
        onEditFinish?.(e.target.value)
    }

    /**
     * -------------------------------------------------------------------
     * 复制
     */

    const [copied, setCopied] = useState(false)

    const unmounted = useUnmounted()

    const copyHandler = () => {
        if (copied) {
            return
        }
        const text = innerRef.current!.innerText
        navigator.clipboard.writeText(text).then()
        onCopy?.(text)
        setCopied(true)
        setTimeout(() => {
            !unmounted.current && setCopied(false)
        }, 3000)
    }

    /**
     * -------------------------------------------------------------------
     * 省略
     */

    const [expanded, setExpanded] = useState(false)

    const style = useStyle({color: color || 'text.primary'})

    const EditComponent: ComponentType<any> = multipleRows ? Textarea : Input

    return editing
        ? <div
            css={editStyle}
            className={classes.editWrap}
            style={{height: originHeight}}
        >
            <EditComponent
                {...editComponentProps}
                className={clsx(classes.editComponent, editComponentProps?.className)}
                autoFocus
                defaultValue={defaultText}
                onBlur={blurHandler}
                fullWidth={multipleRows ? true : void 0}
            />
        </div>
        : <Component
            data-component={typeof Component === 'string' ? Component : ''}
            {...props}
            ref={cloneRef(innerRef, props.ref)}
            css={style}
            className={clsx(classes.root, props.className)}
            data-ellipsis-rows={expanded ? '0' : ellipsisRows}
        >
            {ellipsisRows > 0
                ? <span
                    className={classes.text}
                    style={{
                        WebkitLineClamp: ellipsisRows > 1 ? ellipsisRows : void 0,
                        wordBreak
                    }}
                >
                    {props.children}
                </span>
                : props.children
            }

            {!expanded && expandable && ellipsisRows > 0 &&
                <Button
                    {...expandButtonProps as any}
                    className={clsx(classes.expand, classes.action, expandButtonProps?.className)}
                    variant="plain"
                    onClick={() => setExpanded(true)}
                >
                    展开
                </Button>
            }

            {editable &&
                <Tooltip title="编辑">
                    <Button
                        className={classes.action}
                        variant="plain"
                        onClick={editHandler}
                    >
                        <Icon icon={faPenToSquare}/>
                    </Button>
                </Tooltip>
            }

            {copyable && (
                copied
                    ? <div className={classes.copied}>
                        <Icon icon={faCheck}/>
                    </div>
                    : <Tooltip title="复制">
                        <Button
                            className={classes.action}
                            variant="plain"
                            onClick={copyHandler}
                        >
                            <Icon icon={faCopy}/>
                        </Button>
                    </Tooltip>
            )}
        </Component>
}) as any as TypographyComponent & {
    div: TypographyComponent<'div'>
    h1: TypographyComponent<'h1'>
    h2: TypographyComponent<'h2'>
    h3: TypographyComponent<'h3'>
    h4: TypographyComponent<'h4'>
    h5: TypographyComponent<'h5'>
    h6: TypographyComponent<'h6'>

    mark: TypographyComponent<'mark'>
    code: TypographyComponent<'code'>
    kbd: TypographyComponent<'kbd'>

    a: TypographyComponent<'a'>
    i: TypographyComponent<'i'>
    b: TypographyComponent<'b'>
    u: TypographyComponent<'u'>
    del: TypographyComponent<'del'>
}

Typography.div = memo((props: any) => <Typography {...props} component="div"/>)

Typography.h1 = memo((props: any) => <Typography {...props} component="h1"/>)
Typography.h2 = memo((props: any) => <Typography {...props} component="h2"/>)
Typography.h3 = memo((props: any) => <Typography {...props} component="h3"/>)
Typography.h4 = memo((props: any) => <Typography {...props} component="h4"/>)
Typography.h5 = memo((props: any) => <Typography {...props} component="h5"/>)
Typography.h6 = memo((props: any) => <Typography {...props} component="h6"/>)

Typography.mark = memo((props: any) => <Typography {...props} component="mark"/>)
Typography.code = memo((props: any) => <Typography {...props} component="code"/>)
Typography.kbd = memo((props: any) => <Typography {...props} component="kbd"/>)

Typography.a = memo((props: any) => <Typography {...props} component="a"/>)
Typography.i = memo((props: any) => <Typography {...props} component="i"/>)
Typography.b = memo((props: any) => <Typography {...props} component="b"/>)
Typography.u = memo((props: any) => <Typography {...props} component="u"/>)
Typography.del = memo((props: any) => <Typography {...props} component="del"/>)