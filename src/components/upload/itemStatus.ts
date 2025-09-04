import {Dispatch, Ref, SetStateAction, useImperativeHandle, useState} from 'react'
import {UploadSharedProps, UploadFile, UploadStatus} from './upload'

export type ItemRef<R, A extends any[]> = {
    upload(...args: A): Promise<R | undefined>
    setStatus: Dispatch<SetStateAction<UploadStatus>>
    setProgress: Dispatch<SetStateAction<number>>
}

export interface ItemProps<R, A extends any[]> extends UploadSharedProps<R, A> {
    ref?: Ref<ItemRef<R, A>>
    file: UploadFile<R, A>
    onRemove(): void
}

export function useItemStatus<R, A extends any[]>(props: ItemProps<R, A>) {
    if (props.type === 'image') {
        props.file.url ||= URL.createObjectURL(props.file)
    }

    const upload = props.file.upload = async (...args) => {
        if (!props.onUpload) {
            return
        }
        try {
            setStatus('uploading')
            setProgress(0)
            const ret = await props.onUpload([props.file], setProgress, ...args)
            setStatus('success')
            setProgress(100)
            return ret
        } catch (e) {
            setStatus('error')
            throw e
        }
    }

    const [status, setStatus] = useState(props.file.status || 'default')
    props.file.status = status

    const [progress, setProgress] = useState(0)
    props.file.progress = progress

    useImperativeHandle(props.ref, () => ({upload, setStatus, setProgress}))

    return {status, progress}
}