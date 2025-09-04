import React, {ReactNode, memo, useEffect, useState} from 'react'
import {DivProps} from '../../types'
import {classes, style} from './dropArea.style'
import {clsx} from '../../utils'
import {Icon} from '../icon'
import {faInbox} from '@fortawesome/free-solid-svg-icons/faInbox'

export interface DropAreaProps extends Omit<DivProps, 'onDrop'> {
    description?: ReactNode
    onDrop?(files: FileList): void
}

export const DropArea = memo(({
    description = '点击选择文件，或将文件拖拽到这里',
    onDrop,
    ...props
}: DropAreaProps) => {
    const [draggingOver, setDraggingOver] = useState(false)

    useEffect(() => {
        const fn = (e: any) => e.preventDefault()
        document.body.addEventListener('dragenter', fn)
        document.body.addEventListener('dragover', fn)
        document.body.addEventListener('drop', fn)
        return () => {
            document.body.removeEventListener('dragenter', fn)
            document.body.removeEventListener('dragover', fn)
            document.body.removeEventListener('drop', fn)
        }
    }, [])

    const dropHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const {files} = e.dataTransfer
        files.length && onDrop?.(files)
        setDraggingOver(false)
    }

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-over={draggingOver}
            onDragEnter={e => {
                props.onDragEnter?.(e)
                setDraggingOver(true)
            }}
            onDragLeave={e => {
                props.onDragLeave?.(e)
                setDraggingOver(false)
            }}
            onDrop={dropHandler}
        >
            <Icon icon={faInbox} className={classes.icon}/>
            <div className={classes.description}>{description}</div>
        </div>
    )
})