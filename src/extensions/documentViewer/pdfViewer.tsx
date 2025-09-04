import {memo, useMemo} from 'react'
import {DocumentViewerBaseProps, useBlob, useDocumentTitle} from './documentViewer'
import {SkeletonCard} from '../../components/skeleton'
import {iframeStyle} from './documentViewer.style'

export interface PdfViewerProps extends DocumentViewerBaseProps, Omit<ComponentProps<'iframe'>, 'onError'> {}

export const PdfViewer = memo(({
    src,
    filename,
    onError,
    setDocumentTitle,
    ...props
}: PdfViewerProps) => {
    useDocumentTitle({filename, setDocumentTitle})

    const {blob, loading} = useBlob({src, onError})

    const data = useMemo(() => {
        if (blob) {
            const file = new File([blob], filename || '', {type: 'application/pdf'})
            return URL.createObjectURL(file)
        }
        return
    }, [blob])

    return loading
        ? <div style={{padding: 60}}>
            <SkeletonCard />
        </div>
        : <iframe {...props} css={iframeStyle} src={data} />
})