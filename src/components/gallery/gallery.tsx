import {memo, ReactNode, useRef} from 'react'
import {Modal, ModalProps} from '../modal'
import {cloneRef, clsx, edgeBounce, toArray, useControlled, useDraggable, useSync} from '../../utils'
import {classes, style} from './gallery.style'
import {Button, ButtonProps} from '../button'
import {Tooltip} from '../tooltip'
import {Icon} from '../icon'
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark'
import {faExpand} from '@fortawesome/free-solid-svg-icons/faExpand'
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import {faAngleRight} from '@fortawesome/free-solid-svg-icons/faAngleRight'
import {faArrowRotateLeft} from '@fortawesome/free-solid-svg-icons/faArrowRotateLeft'
import {faArrowRotateRight} from '@fortawesome/free-solid-svg-icons/faArrowRotateRight'
import {faMagnifyingGlassPlus} from '@fortawesome/free-solid-svg-icons/faMagnifyingGlassPlus'
import {faMagnifyingGlassMinus} from '@fortawesome/free-solid-svg-icons/faMagnifyingGlassMinus'
import {ImageItem, ImageItemRef} from './imageItem'

export interface ImagePreviewProps extends ModalProps {
    src?: string | string[]

    defaultIndex?: number
    index?: number
    onIndexChange?(index: number): void

    defaultOpen?: boolean
    onOpenChange?(open: boolean): void

    /** 是否渲染旋转按钮，默认为`true` */
    showRotation?: boolean
    /** 是否渲染放大缩小按钮，默认为`true` */
    showZoom?: boolean
    /** 是否渲染关闭按钮，默认为`true`*/
    showClose?: boolean
    /** 自定义渲染控制按钮 */
    renderControl?: ReactNode
    /** 拖拽至最边缘时，是否允许弹性溢出，默认为`true` */
    allowEdgeBounce?: boolean
    /** 元素弹性移动距离，默认为24 */
    bounceElementTranslate?: number
    /** 手指弹性拖拽距离，默认为240 */
    bounceDragDistance?: number
    /** 滑动生效的速度，默认为450 (px/s) */
    effectiveSpeed?: number
}

const commonControlProps: ButtonProps = {
    className: classes.button,
    shape: 'circular',
    size: 'large',
    color: 'text'
}

const DOUBLE_CLICK_DELAY = 300

export const Gallery = memo(({
    src,
    defaultIndex = 0,
    index,
    onIndexChange,
    defaultOpen = false,
    open,
    onOpenChange,
    showRotation = true,
    showZoom = true,
    showClose = true,
    renderControl,
    allowEdgeBounce = true,
    bounceElementTranslate = 24,
    bounceDragDistance = 240,
    effectiveSpeed = 450,
    ...props
}: ImagePreviewProps) => {
    const srcArr = useSync(toArray(src || [])!)

    const [innerOpen, setInnerOpen] = useControlled(defaultOpen, open, onOpenChange)

    const close = () => {
        setInnerOpen(false)
    }

    const [innerIndex, setInnerIndex] = useControlled(defaultIndex, index, onIndexChange)

    const maskRef = useRef<HTMLDivElement>(null)

    const wrapperRef = useRef<HTMLDivElement>(null)

    const imageItemRefs = useRef<ImageItemRef[]>([])
    imageItemRefs.current = []

    const imgRefs = useRef<HTMLImageElement[]>([])
    imgRefs.current = []

    /**
     * --------------------------------------------------------------
     * 左右滚动翻页
     */

    const dragDirection = useRef<'vertical' | 'horizontal'>(void 0)

    const draggableHandles = useDraggable({
        onDragStart() {
            maskRef.current!.style.transition = 'none'

            return {
                isFit: imageItemRefs.current[innerIndex.current].isFit(),
                startLeft: -innerIndex.current * wrapperRef.current!.offsetWidth
            }
        },
        onDrag({diff: [dx, dy], data: {isFit: {left, right, top, bottom}, startLeft}}) {
            if ((!left && dx > 0)
                || (!right && dx < 0)
                || (!top && dy > 0)
                || (!bottom && dy < 0)
            ) {
                // 图片超出边缘时，无需触发Gallery的滑动翻页，此时拖拽效果由Pinchable处理
                return
            }

            if (!dragDirection.current) {
                if (dx <= -5 || 5 <= dx) {
                    dragDirection.current = 'horizontal'
                    resetVerticalDrag()
                }
                if (dy <= -5 || 5 <= dy) {
                    dragDirection.current = 'vertical'
                }
            }

            if (dragDirection.current !== 'vertical') {
                // 处理横向拖动
                const min = -wrapperRef.current!.offsetWidth * (srcArr.current.length - 1)
                const max = 0
                const newLeft = edgeBounce(startLeft + dx, {min, max, allowEdgeBounce, bounceElementTranslate, bounceDragDistance})
                wrapperRef.current!.style.left = newLeft + 'px'
            }

            if (dragDirection.current !== 'horizontal') {
                // 处理纵向拖动
                const rate = 1 - Math.abs(dy) / 2 / wrapperRef.current!.offsetHeight
                imageItemRefs.current[innerIndex.current]!.style.transform = `translateY(${dy}px) scale(${rate})`
                maskRef.current!.style.opacity = rate.toString()
            }
        },
        onDragEnd({diff: [dx, dy], speed: [speedX, speedY], data: {isFit: {left, right, top, bottom}}}) {
            if (!dx && !dy) {
                return
            }
            resetVerticalDrag(true)
            if ((!left && dx > 0)
                || (!right && dx < 0)
                || (!top && dy > 0)
                || (!bottom && dy < 0)
            ) {
                // 图片超出边缘时，无需触发Gallery的滑动翻页，此时拖拽效果由Pinchable处理
                return
            }
            if (dragDirection.current === 'vertical') {
                if ((effectiveSpeed && speedY * 1000 >= effectiveSpeed)
                    || Math.abs(dy) > wrapperRef.current!.offsetHeight / 2
                ) {
                    close()
                }
            } else {
                const goPrev = () => {
                    innerIndex.current === 0
                        ? resetHorizontalDrag()
                        : goPrevLoop()
                }
                const goNext = () => {
                    innerIndex.current === srcArr.current.length - 1
                        ? resetHorizontalDrag()
                        : goNextLoop()
                }
                // 满足速度要求
                if (effectiveSpeed && speedX * 1000 >= effectiveSpeed) {
                    dx > 0 ? goPrev() : goNext()
                    return
                }
                // 拖拽距离达到一半
                const halfWidth = wrapperRef.current!.offsetWidth / 2
                if (dx >= halfWidth) {
                    goPrev()
                } else if (dx <= -halfWidth) {
                    goNext()
                } else {
                    resetHorizontalDrag()
                }
            }
            dragDirection.current = void 0
        },
        onClick: () => {
            setTimeout(() => {
                !doubleClicked.current && close()
            }, DOUBLE_CLICK_DELAY)
        }
    })

    const resetHorizontalDrag = () => {
        allowSlideTransition('bounce')
        wrapperRef.current!.style.left = -innerIndex.current * wrapperRef.current!.offsetWidth + 'px'
    }

    const resetVerticalDrag = (transition = false) => {
        const imageItem = imageItemRefs.current[innerIndex.current]!
        const mask = maskRef.current!

        if (transition) {
            imageItem.dataset.transition = 'true'
            // mask的css定义了transition，只需去掉style.transition即可实现过渡
            mask.style.transition = ''
        }
        imageItem.style.transform = ''
        mask.style.opacity = ''

    }

    const doubleClicked = useRef(false)

    const doubleClickHandler = () => {
        doubleClicked.current = true
        setTimeout(() => doubleClicked.current = false, DOUBLE_CLICK_DELAY)
    }

    const allowSlideTransition = (transitionType = 'true') => {
        if (wrapperRef.current) {
            wrapperRef.current.dataset.transition = transitionType
        }
    }

    const clearTransition = () => {
        if (wrapperRef.current) {
            wrapperRef.current.dataset.transition = ''
        }
        const imageItem = imageItemRefs.current[innerIndex.current]
        if (imageItem) {
            imageItem.dataset.transition = ''
        }
        maskRef.current!.style.transition = ''
    }

    const goPrevLoop = () => {
        allowSlideTransition()
        setInnerIndex(o => {
            imageItemRefs.current[o].reset()
            return (o + srcArr.current.length - 1) % srcArr.current.length
        })
    }

    const goNextLoop = () => {
        allowSlideTransition()
        setInnerIndex(o => {
            imageItemRefs.current[o].reset()
            return (o + 1) % srcArr.current.length
        })
    }

    /**
     * -----------------------------------------------------------------------------
     * 放大缩小与旋转
     */

    const rotateLeft = () => {
        imageItemRefs.current[innerIndex.current].rotateLeft()
    }

    const rotateRight = () => {
        imageItemRefs.current[innerIndex.current].rotateRight()
    }

    const zoomIn = () => {
        imageItemRefs.current[innerIndex.current].zoomIn()
    }

    const zoomOut = () => {
        imageItemRefs.current[innerIndex.current].zoomOut()
    }

    const reset = () => {
        imageItemRefs.current[innerIndex.current].reset()
    }

    const resetAll = () => {
        imageItemRefs.current.forEach(item => {
            item.reset(false)
        })
    }

    return (
        <Modal
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            open={innerOpen.current}
            onClosed={resetAll}
            maskProps={{
                ...props.maskProps,
                ref: cloneRef(maskRef, props.maskProps?.ref),
                children: (
                    <>
                        <div className={classes.control}>
                            {renderControl}
                            {showRotation &&
                                <>
                                    <Tooltip title="旋转-90°">
                                        <Button
                                            {...commonControlProps}
                                            onClick={rotateLeft}
                                        >
                                            <Icon icon={faArrowRotateLeft}/>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="旋转90°">
                                        <Button
                                            {...commonControlProps}
                                            onClick={rotateRight}
                                        >
                                            <Icon icon={faArrowRotateRight}/>
                                        </Button>
                                    </Tooltip>
                                </>
                            }
                            {showZoom &&
                                <>
                                    <Tooltip title="缩小">
                                        <Button
                                            {...commonControlProps}
                                            onClick={zoomOut}
                                        >
                                            <Icon icon={faMagnifyingGlassMinus}/>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="放大">
                                        <Button
                                            {...commonControlProps}
                                            onClick={zoomIn}
                                        >
                                            <Icon icon={faMagnifyingGlassPlus}/>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="适应屏幕">
                                        <Button
                                            {...commonControlProps}
                                            onClick={reset}
                                        >
                                            <Icon icon={faExpand}/>
                                        </Button>
                                    </Tooltip>
                                </>
                            }
                            {showClose &&
                                <Button
                                    {...commonControlProps}
                                    onClick={close}
                                >
                                    <Icon icon={faXmark}/>
                                </Button>
                            }
                        </div>
                        {srcArr.current.length > 1 &&
                            <>
                                <div className={classes.swap}>
                                    <Button
                                        {...commonControlProps}
                                        onClick={goPrevLoop}
                                    >
                                        <Icon icon={faAngleLeft}/>
                                    </Button>
                                    <Button
                                        {...commonControlProps}
                                        onClick={goNextLoop}
                                    >
                                        <Icon icon={faAngleRight}/>
                                    </Button>
                                </div>
                                <div className={classes.counter}>
                                    {innerIndex.current + 1} / {srcArr.current.length}
                                </div>
                            </>
                        }
                    </>
                )
            }}
        >
            {srcArr.current.length > 0 &&
                <div
                    className={classes.galleryContainer}
                    {...draggableHandles}
                    onDoubleClick={doubleClickHandler}
                >
                    <div
                        ref={wrapperRef}
                        className={classes.galleryWrapper}
                        style={{left: -innerIndex.current * 100 + '%'}}
                        onTransitionEnd={clearTransition}
                    >
                        {srcArr.current.map((src, i) =>
                            <ImageItem
                                key={i}
                                ref={r => {
                                    r && imageItemRefs.current.push(r)
                                }}
                                imgProps={{
                                    ref: r => {
                                        r && imgRefs.current.push(r)
                                    }
                                }}
                                style={{left: i * 100 + '%'}}
                                src={src}
                            />
                        )}
                    </div>
                </div>
            }
        </Modal>
    )
})