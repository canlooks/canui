import {ElementType} from 'react'
import {cloneRef, clsx} from '../../utils'
import {Id, OverridableComponent, OverridableProps} from '../../types'
import {Global} from '@emotion/react'
import {classes, globalGrabbingStyle, style} from './sortableItem.style'
import {useSortable, UseSortableInput} from '@dnd-kit/react/sortable'

export type SortableItemOwnProps = {
    id: Id
    index: number
    disabled?: boolean
    sortableArguments?: UseSortableInput
    noStyle?: boolean
}

export type SortableItemProps<C extends ElementType = 'div'> = OverridableProps<SortableItemOwnProps, C>

export const SortableItem = (
    ({
        component: Component = 'div',
        id,
        index,
        disabled,
        sortableArguments,
        noStyle,
        ...props
    }: SortableItemProps) => {
        const {ref, isDragging} = useSortable({
            ...sortableArguments,
            id,
            index,
            disabled
        })

        // TODO 换成新的@dnd-kit后，是否还需要手动处理touchmove事件

        // const preventDefaultCallback = useRef<(e: TouchEvent) => void>(void 0)
        //
        // const removeListener = () => {
        //     if (preventDefaultCallback.current) {
        //         removeEventListener('touchmove', preventDefaultCallback.current)
        //         preventDefaultCallback.current = void 0
        //     }
        //     removeEventListener('pointerup', onPointerUp)
        // }
        //
        // const onPointerUp = useCallback(removeListener, [])
        //
        // const syncOnTouchStart = useSync(props.onTouchStart)
        //
        // const onTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        //     syncOnTouchStart.current?.(e)
        //     addEventListener('touchmove', preventDefaultCallback.current = e => {
        //         e.cancelable && e.preventDefault()
        //     }, {passive: false})
        //     addEventListener('pointerup', onPointerUp)
        // }, [])
        //
        // useEffect(() => removeListener, [])

        return (
            <>
                <Component
                    {...props}
                    ref={cloneRef(ref, props.ref)}
                    css={style}
                    className={clsx(classes.root, props.className)}
                    // onTouchStart={disabled ? void 0 : onTouchStart}
                    data-no-style={noStyle}
                    data-dragging={isDragging}
                    data-draggable={!disabled}
                />
                {/*TODO 测试新的@dnd-kit是否还需要手动处理grab样式*/}
                {!noStyle && isDragging && <Global styles={globalGrabbingStyle}/>}
            </>
        )
    }
) as OverridableComponent<SortableItemOwnProps>