import {ReactElement, memo, useEffect, useMemo} from 'react'
import {SvgViewer} from './svgViewer'
import mime from 'mime'
import {Placeholder} from '../../components/placeholder'
import {Button} from '../../components/button'
import {iframeStyle} from './documentViewer.style'
import {useDerivedState, useLoading} from '../../utils'
import {PdfViewer} from './pdfViewer'
import {Icon} from '../../components/icon'
import {Gallery} from '../../components/gallery'
import {faDownload} from '@fortawesome/free-solid-svg-icons/faDownload'

// 各类型的文件预览组件都继承的属性
export type DocumentViewerBaseProps = {
    src?: string
    filename?: string
    onError?(e: any): void
    /** 是否将文件名设置成页面的标题，默认为true */
    setDocumentTitle?: boolean
}

export interface DocumentViewerProps extends DocumentViewerBaseProps {
    /** mimeType与后缀名至少提供一个 */
    type?: string
    extension?: string
}

export const DocumentViewer = memo(({
    src,
    filename,
    onError,
    type,
    extension,
    setDocumentTitle = true
}: DocumentViewerProps) => {
    const mimeType = useMemo(() => {
        if (!src) {
            return null
        }
        if (type) {
            return type
        }
        if (extension) {
            return mime.getType(extension)
        }
        if (filename) {
            const [ext] = filename.match(/\.([^\\/.])+$/) || [null]
            return ext && mime.getType(ext)
        }
        return null
    }, [src, type, extension, filename])

    const downloadHandler = () => {
        if (src) {
            const a = document.createElement('a')
            a.href = src
            a.download = filename || 'download'
            a.click()
        }
    }

    const empty = (
        <Placeholder
            description="该文件暂不支持预览"
            extra={
                <Button
                    variant="outlined"
                    prefix={<Icon icon={faDownload}/>}
                    onClick={downloadHandler}
                >
                    下载
                </Button>
            }
        />
    )

    if (!mimeType) {
        return empty
    }

    const childProps = {src, filename, onError, setDocumentTitle}

    // pdf
    if (mimeType === 'application/pdf') {
        return <PdfViewer {...childProps}/>
    }

    // office文档
    if (mimeType.includes('officedocument')
        || {
            'application/msword': true,
            'application/vnd.ms-powerpoint': true,
            'application/vnd.ms-excel': true
        }[mimeType]
    ) {
        return <iframe css={iframeStyle} src={'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(src!)}/>
    }

    // svg
    if (mimeType === 'image/svg+xml') {
        return <SvgViewer {...childProps}/>
    }

    // image
    if (mimeType.includes('image/')) {
        return <Gallery src={src} open showClose={false}/>
    }

    return empty
}) as any as {
    (props: DocumentViewerProps): ReactElement
    Svg: typeof SvgViewer
    Pdf: typeof PdfViewer
}

DocumentViewer.Svg = SvgViewer
DocumentViewer.Pdf = PdfViewer

/**
 * 将文件名同步至页面标题
 */
export function useDocumentTitle({filename, setDocumentTitle}: Pick<DocumentViewerBaseProps, 'filename' | 'setDocumentTitle'>) {
    useEffect(() => {
        if (filename && setDocumentTitle) {
            document.title = filename
        }
    }, [filename, setDocumentTitle])
}

/**
 * 获取文件内容
 */
export function useBlob({src, onError}: DocumentViewerBaseProps) {
    // src改变会清空data
    const [blob, setBlob] = useDerivedState<Blob | undefined>(void 0, [src])

    const [loading, getBlob] = useLoading(async () => {
        try {
            const res = await fetch(src!)
            if (!res.ok) {
                onError?.(res)
                return
            }
            setBlob(await res.blob())
        } catch (e) {
            onError?.(e)
        }
    }, true)

    useEffect(() => {
        src && getBlob()
    }, [src])

    return {blob: blob.current, loading: loading.current}
}