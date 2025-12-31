import {classes} from './gallery.style'
import {Ref, useEffect, useImperativeHandle, useRef} from 'react'
import {clsx} from '../../utils'
import {Pinchable, PinchableProps, PinchableRef} from '../pinchable'

export interface ImageItemRef extends PinchableRef {
    isFit(): {
        top: boolean
        bottom: boolean
        left: boolean
        right: boolean
    }
}

interface ImageItemProps extends PinchableProps {
    ref?: Ref<ImageItemRef>
    src?: string
}

export function ImageItem({
    ref,
    src,
    ...props
}: ImageItemProps) {
    useImperativeHandle(ref, () => {
        if (pinchableRef.current) {
            pinchableRef.current.isFit = () => {
                const {x: pinchableX, y: pinchableY, width: pinchableWidth, height: pinchableHeight} = pinchableRef.current!.getBoundingClientRect()
                const {x: imgX, y: imgY, width: imgWidth, height: imgHeight} = imgRef.current!.getBoundingClientRect()

                return {
                    top: imgY >= pinchableY,
                    bottom: imgY + imgHeight <= pinchableY + pinchableHeight,
                    left: imgX >= pinchableX,
                    right: imgX + imgWidth <= pinchableX + pinchableWidth
                }
            }
        }
        return pinchableRef.current!
    })

    const pinchableRef = useRef<ImageItemRef>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    const fitSize = () => {
        const img = imgRef.current!
        const imgRatio = img.naturalWidth / img.naturalHeight
        const pinchableRatio = pinchableRef.current!.clientWidth / pinchableRef.current!.clientHeight

        if (imgRatio >= pinchableRatio) {
            img.style.width = '100%'
            img.style.height = 'auto'
        } else {
            img.style.width = 'auto'
            img.style.height = '100%'
        }
    }

    useEffect(() => {
        !imgRef.current!.complete && imgRef.current!.addEventListener('load', fitSize, {once: true})
    }, [])

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            imgRef.current!.complete && fitSize()
        })
        resizeObserver.observe(pinchableRef.current!)
        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    return (
        <Pinchable
            {...props}
            ref={pinchableRef}
            className={clsx(classes.imageItem, props.className)}
            allowEdgeBounce={false}
        >
            <img
                ref={imgRef}
                className={classes.image}
                src={src}
                draggable={false}
                alt=""
            />
        </Pinchable>
    )
}