import {Dispatch, RefObject, SetStateAction, useEffect, useRef} from 'react'
import {useSync, useSyncState} from './hooks'

export type UseKeyboardReturn = {
    verticalIndex: RefObject<number>
    setVerticalIndex: Dispatch<SetStateAction<number>>
    horizontalIndex: RefObject<number>
    setHorizontalIndex: Dispatch<SetStateAction<number>>
}

export type CallbackInfo = {
    verticalIndex: number
    verticalCount: number
    horizontalIndex: number
    horizontalCount: number
}

export function useKeyboard({
    disabled,
    verticalCount,
    allowVertical,
    horizontalCount,
    allowHorizontal,
    open,
    setOpen,
    onEnter,
    onKeyDown
}: {
    disabled?: boolean
    verticalCount?: number | ((horizontalIndex: number) => number)
    allowVertical?: boolean
    horizontalCount?: number | ((verticalIndex: number) => number)
    allowHorizontal?: boolean
    open?: boolean
    setOpen?(open: boolean): void
    onEnter?(info: CallbackInfo, e: KeyboardEvent): void
    onKeyDown?(info: CallbackInfo, e: KeyboardEvent): void
}): UseKeyboardReturn {
    const [verticalIndex, setVerticalIndex] = useSyncState(-1)
    const [horizontalIndex, setHorizontalIndex] = useSyncState(0)

    const syncOnKeydown = useSync(onKeyDown)
    const syncOnEnter = useSync(onEnter)

    const vCount = typeof verticalCount === 'function' ? verticalCount(horizontalIndex.current) : verticalCount || 0
    const hCount = typeof horizontalCount === 'function' ? horizontalCount(verticalIndex.current) : horizontalCount || 0

    useEffect(() => {
        if (!open || disabled) {
            return
        }

        const _allowVertical = allowVertical && vCount > 0
        const _allowHorizontal = allowHorizontal && hCount > 0

        const keydown = (e: KeyboardEvent) => {
            syncOnKeydown.current?.({
                verticalCount: vCount,
                verticalIndex: verticalIndex.current,
                horizontalCount: hCount,
                horizontalIndex: horizontalIndex.current
            }, e)
            if (e.defaultPrevented) {
                return
            }
            if (e.key === 'Enter' || e.key === 'Escape') {
                e.preventDefault()
            } else if (_allowVertical && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                e.preventDefault()
            } else if (_allowHorizontal && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                e.preventDefault()
            }

            switch (e.key) {
                case 'ArrowUp':
                    _allowVertical && setVerticalIndex(o => o <= 0 ? vCount - 1 : o - 1)
                    break
                case 'ArrowDown':
                    _allowVertical && setVerticalIndex(o => (o + 1) % vCount)
                    break
                case 'ArrowLeft':
                    _allowHorizontal && setHorizontalIndex(o => o <= 0 ? hCount - 1 : o - 1)
                    break
                case 'ArrowRight':
                    _allowHorizontal && setHorizontalIndex(o => (o + 1) % hCount)
                    break
                case 'Enter':
                    syncOnEnter.current?.({
                        verticalCount: vCount,
                        verticalIndex: verticalIndex.current,
                        horizontalCount: hCount,
                        horizontalIndex: horizontalIndex.current
                    }, e)
                    break
                case 'Escape':
                    setOpen?.(false)
            }
        }
        // setTimeout是为了避免使用回车键打开弹框时，立即触发onEnter事件
        setTimeout(() => {
            addEventListener('keydown', keydown)
        })
        return () => {
            removeEventListener('keydown', keydown)
        }
    }, [open, disabled, vCount, hCount, allowVertical, allowHorizontal])

    return {
        verticalIndex, setVerticalIndex,
        horizontalIndex, setHorizontalIndex
    }
}

/**
 * 绑定ESC键，关闭遮罩层
 */
export function useEscapeClosable({escapeClosable, close}: {
    escapeClosable?: boolean
    close?(reason: 'escape'): void
}, onEscape?: (e: KeyboardEvent) => void) {
    const overlayRef = useRef<HTMLDivElement>(null)

    const syncOnEscape = useSync(onEscape)

    useEffect(() => {
        if (escapeClosable) {
            const keydown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    const {nextSibling} = overlayRef.current!
                    if (!nextSibling || (nextSibling as HTMLElement).dataset.open !== 'true') {
                        // 后面无元素，或后一个元素已关闭，才能关闭当前
                        e.preventDefault()
                        syncOnEscape.current?.(e)
                        close?.('escape')
                    }
                }
            }
            addEventListener('keydown', keydown)
            return () => {
                removeEventListener('keydown', keydown)
            }
        }
    }, [escapeClosable])

    return overlayRef
}