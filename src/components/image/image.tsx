import React, {CSSProperties, ReactNode, memo, ReactElement, useRef, ComponentProps} from 'react'
import {DivProps} from '../../types'
import {classes, style} from './image.style'
import {clsx, cloneRef, useControlled, useDerivedState} from '../../utils'
import {Gallery, ImagePreviewProps} from '../gallery'
import {Icon} from '../icon'
import {Skeleton} from '../skeleton'
import {faEye} from '@fortawesome/free-regular-svg-icons/faEye'

export interface ImageProps extends DivProps {
    src?: string
    fallback?: string
    onLoad?: ComponentProps<'img'>['onLoad']
    onError?: ComponentProps<'img'>['onError']
    renderLoading?: ReactNode

    alt?: string
    width?: string | number
    height?: string | number
    objectFit?: CSSProperties['objectFit']
    objectPosition?: CSSProperties['objectPosition']
    imgProps?: ComponentProps<'img'>

    actions?: ReactNode
    previewable?: boolean
    previewProps?: ImagePreviewProps
    onPreview?(e: React.MouseEvent<HTMLDivElement>): void
}

export const Image = memo(({
    src,
    fallback,
    onLoad,
    onError,
    renderLoading,
    alt = '',
    width,
    height,
    objectFit = 'cover',
    objectPosition = 'center',
    imgProps,
    actions,
    previewable = true,
    previewProps,
    onPreview,
    ...props
}: ImageProps) => {
    const imgRef = useRef<HTMLImageElement>(null)

    const [loading, setLoading] = useDerivedState(() => {
        return renderLoading !== false && renderLoading !== null
    }, [src])

    const loadHandler = (e: React.SyntheticEvent<HTMLImageElement>) => {
        imgProps?.onError?.(e)
        onLoad?.(e)
        setLoading(false)
    }

    const [failed, setFailed] = useDerivedState(() => !src, [src])

    const errorHandler = (e: React.SyntheticEvent<HTMLImageElement>) => {
        imgProps?.onError?.(e)
        onError?.(e)
        setFailed(true)
        setLoading(false)
    }

    const [previewOpen, setPreviewOpen] = useControlled(!!previewProps?.defaultOpen, previewProps?.open, previewProps?.onOpenChange)

    const previewHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        onPreview?.(e)
        if (e.defaultPrevented) {
            return
        }
        setPreviewOpen(true)
    }

    const renderedActions = (() => {
        if (typeof actions === 'undefined' && previewable) {
            return (
                <div className={classes.previewButton} onClick={previewHandler}>
                    <Icon icon={faEye}/>
                    <div>预览</div>
                </div>
            )
        }
        return actions
    })()

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-error={failed.current}
        >
            {props.children}
            <img
                alt={alt}
                width={width}
                height={height}
                {...imgProps}
                ref={cloneRef(imgRef, imgProps?.ref)}
                className={clsx(classes.img, imgProps?.className)}
                src={failed.current ? fallback : src}
                style={{
                    objectFit,
                    objectPosition,
                    ...imgProps?.style
                }}
                onLoad={loadHandler}
                onError={errorHandler}
            />
            {loading.current &&
                (renderLoading ?? <Skeleton className={classes.skeleton}/>)
            }
            {!!renderedActions && !failed.current &&
                <div className={classes.mask}>
                    {renderedActions}
                </div>
            }
            {previewable && src &&
                <Gallery
                    src={[src]}
                    {...previewProps}
                    open={previewOpen.current}
                    onOpenChange={setPreviewOpen}
                />
            }
        </div>
    )
}) as any as {
    (props: ImageProps): ReactElement
    Gallery: typeof Gallery
}

Image.Gallery = Gallery