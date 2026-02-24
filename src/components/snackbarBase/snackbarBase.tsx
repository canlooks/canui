import React, {ReactNode, isValidElement, memo, useRef, useState} from 'react'
import {Collapse, Slide, TransitionBaseProps} from '../transitionBase'
import {BlockPlacement, ColorPropsValue, DefineElement} from '../../types'
import {clsx, getRandomId, useColor, useContainer, useUnmounted} from '../../utils'
import {classes, style} from './snackbarBase.style'
import {TransitionGroup} from 'react-transition-group'
import {StatusIcon, statusMapToIconDefinition} from '../status'
import {Button} from '../button'
import {createPortal} from 'react-dom'
import {Icon} from '../icon'
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark'

export interface SnackbarBaseProps extends TransitionBaseProps<HTMLDivElement> {
    variant?: 'filled' | 'outlined'
    color?: ColorPropsValue
    icon?: ReactNode
    title?: ReactNode
    content?: ReactNode
    showClose?: ReactNode
    placement?: BlockPlacement
    /** 自动关闭的延迟，为0表示不自动关闭，默认为`3000(ms)` */
    duration?: number
    onAutoClose?(): void
    onCloseButtonClick?(e: React.MouseEvent<HTMLButtonElement>): void
}

export class SnackbarBaseMethods<P extends SnackbarBaseProps = SnackbarBaseProps> {
    async info(content: ReactNode): Promise<void>
    async info(props: P): Promise<void>
    async info(_: any) {
    }

    async success(content: ReactNode): Promise<void>
    async success(props: P): Promise<void>
    async success(_: any) {
    }

    async warning(content: ReactNode): Promise<void>
    async warning(props: P): Promise<void>
    async warning(_: any) {
    }

    async error(content: ReactNode): Promise<void>
    async error(props: P): Promise<void>
    async error(_: any) {
    }
}

// placement对应stacks的index
const placementToIndex = {
    topLeft: 0,
    leftTop: 0,
    top: 1,
    topRight: 2,
    rightTop: 2,
    bottomLeft: 3,
    leftBottom: 3,
    bottom: 4,
    bottomRight: 5,
    rightBottom: 5
}

export const SnackbarBase = memo(({
    methods,
    useTo,
    max = useTo === 'message' ? 5 : 4,
    container,
    effectContainer
}: {
    methods: SnackbarBaseMethods
    useTo: 'message' | 'notification'
    // 最大堆栈数
    max?: number
    container?: DefineElement<HTMLElement>
    effectContainer?: DefineElement<HTMLElement>
}) => {
    const [stacks, setStacks] = useState<SnackbarBaseItemProps[][]>([])

    const timers = useRef<any[]>([])

    const isUnmounted = useUnmounted()

    const defineMethod = (type: keyof SnackbarBaseMethods) => (props: ReactNode | SnackbarBaseProps) => new Promise<void>(resolve => {
        const propsObject = typeof props === 'object' && !isValidElement(props)
            ? props as SnackbarBaseProps
            : {content: props}
        const {
            placement = useTo === 'message' ? 'top' : 'topRight',
            duration = useTo === 'message' ? 3000 : 5000,
            ...restProps
        } = propsObject

        const index = placementToIndex[placement]
        let id = getRandomId()

        const onCloseButtonClick = () => {
            !isUnmounted.current && setStacks(o => {
                o[index] = o[index].filter(s => s.id !== id)
                return [...o]
            })
        }

        setStacks(o => {
            const targetStack = o[index] ||= []
            targetStack.push({
                ...restProps,
                id,
                type,
                useTo,
                resolve,
                placement,
                onCloseButtonClick
            })
            if (o[index].length > max) {
                o[index].shift()
            }
            o[index] = [...o[index]]
            return [...o]
        })
        if (duration) {
            timers.current.push(
                setTimeout(() => {
                    restProps.onAutoClose?.()
                    onCloseButtonClick()
                }, duration)
            )
        }
    })
    methods.info = defineMethod('info')
    methods.success = defineMethod('success')
    methods.warning = defineMethod('warning')
    methods.error = defineMethod('error')

    const css = style()

    const containerEl = useContainer(container, effectContainer)

    return containerEl.current && createPortal(
        stacks.flatMap((stack, i) => stack
            ? <TransitionGroup
                key={i}
                css={css}
                className={classes.root}
                data-place={i}
                data-use-to={useTo}
            >
                {stack.map(p =>
                    <SnackbarBaseItem {...p} key={p.id}/>
                )}
            </TransitionGroup>
            : []
        ),
        containerEl.current
    )
})

/**
 * ----------------------------------------------------------------------
 * Item部分
 */

// placement对应的动画方向
const placementToDirection: any = {
    topLeft: 'right',
    leftTop: 'right',
    top: 'down',
    topRight: 'left',
    rightTop: 'left',
    bottomLeft: 'right',
    leftBottom: 'right',
    bottom: 'up',
    bottomRight: 'left',
    rightBottom: 'left'
}

interface SnackbarBaseItemProps extends Omit<SnackbarBaseProps, 'duration' | 'onAutoClose'> {
    id: string
    type: keyof SnackbarBaseMethods
    useTo: 'message' | 'notification'
    resolve(): void
}

export const SnackbarBaseItem = memo(({
    id,
    type,
    useTo,
    resolve,

    variant = 'outlined',
    color = 'primary',
    icon,
    title,
    content,
    showClose = useTo === 'notification',
    placement,
    onCloseButtonClick,
    ...props
}: SnackbarBaseItemProps) => {
    const onExited = () => {
        props.onExited?.()
        resolve()
    }

    const colorValue = useColor(color)

    const renderedIcon = icon ?? (
        variant === 'outlined'
            ? <StatusIcon status={type}/>
            : <Icon icon={statusMapToIconDefinition[type]}/>
    )

    const closeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        onCloseButtonClick?.(e)
    }

    return (
        <Collapse
            in={props.in}
            className={classes.itemWrap}
            onExited={onExited}
        >
            <Slide
                direction={placementToDirection[placement]}
                {...props}
                className={clsx(classes.item, props.className)}
                style={{
                    backgroundColor: variant === 'filled' ? colorValue : void 0,
                    ...props.style
                }}
                data-variant={variant}
                data-use-to={useTo}
            >
                {!!renderedIcon &&
                    <div className={classes.icon}>
                        {renderedIcon}
                    </div>
                }
                {!!(title || content) &&
                    <div className={classes.text}>
                        {!!title &&
                            <div className={classes.title}>{title}</div>
                        }
                        {!!content &&
                            <div className={classes.content}>{content}</div>
                        }
                    </div>
                }
                {showClose &&
                    <Button
                        variant="text"
                        shape="circular"
                        color="text.disabled"
                        size="small"
                        className={classes.close}
                        onClick={closeHandler}
                    >
                        <Icon icon={faXmark}/>
                    </Button>
                }
            </Slide>
        </Collapse>
    )
})