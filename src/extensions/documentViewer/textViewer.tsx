import {memo, useEffect} from 'react'
import {DocumentViewerBaseProps, useDocumentTitle} from './documentViewer'
import {SkeletonCard} from '../../components/skeleton'
import {useDerivedState, useLoading} from '../../utils'
import {TextFormatter} from '../textFormatter'

export interface TextViewerProps extends DocumentViewerBaseProps {

}

export const TextViewer = memo(({
    src,
    filename,
    onError,
    setDocumentTitle,
    ...props
}: TextViewerProps) => {
    useDocumentTitle({filename, setDocumentTitle})

    const [text, setText] = useDerivedState<string | undefined>(void 0, [src])

    const [loading, getText] = useLoading(async () => {
        try {
            const res = await fetch(src!)
            if (!res.ok) {
                onError?.(res)
                return
            }
            setText(await res.text())
        } catch (e) {
            onError?.(e)
        }
    }, true)

    useEffect(() => {
        src && getText()
    }, [src])

    return loading
        ? <div style={{padding: 60}}>
            <SkeletonCard />
        </div>
        : <TextFormatter text={text.current} />
})