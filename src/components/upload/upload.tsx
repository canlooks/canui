import React, {Dispatch, ReactElement, ReactNode, SetStateAction, memo, useImperativeHandle, useRef, ComponentProps} from 'react'
import {DivProps} from '../../types'
import {classes, style} from './upload.style'
import {clsx, getRandomId, onDndDragEnd, useControlled, useDndSensors, mergeComponentProps} from '../../utils'
import {Button, ButtonProps} from '../button'
import {FileItem} from './fileItem'
import {TransitionGroup} from 'react-transition-group'
import {Collapse, Grow} from '../transitionBase'
import {ItemRef} from './itemStatus'
import {ImageItem} from './imageItem'
import {DndContext, DragEndEvent} from '@dnd-kit/core'
import {SortableContext} from '@dnd-kit/sortable'
import {SortableItem} from '../sortableItem'
import {DropArea} from './dropArea'
import {Icon} from '../icon'
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus'
import {faUpload} from '@fortawesome/free-solid-svg-icons/faUpload'

export type UploadStatus = 'default' | 'uploading' | 'success' | 'error'

export interface UploadFile<R = any, A extends any[] = any[]> extends File {
    id: string
    progress?: number
    status?: UploadStatus
    url?: string
    upload?(...args: A): Promise<R | undefined>
}

// UploadProps与ItemProps共享的属性
export interface UploadSharedProps<R = any, A extends any[] = any[]> {
    type?: 'file' | 'image'
    onUpload?(files: UploadFile<R, A>[], setProgress: Dispatch<SetStateAction<number>>, ...args: A): Promise<R>
}

export interface UploadProps<R = any, A extends any[] = any[]> extends UploadSharedProps<R, A>, Omit<DivProps, 'defaultValue' | 'onChange'> {
    inputProps?: ComponentProps<'input'>

    accept?: string
    max?: number

    /**
     * 是否显示"选择文件"按钮
     * {@link type}为"file"生效
     * 默认为true
     */
    showButton?: boolean
    buttonProps?: ButtonProps
    buttonText?: ReactNode
    /** {@link type}为"image"生效 */
    variant?: 'square' | 'circular'
    size?: number

    /** 是否支持“将文件拖拽到此处” */
    droppable?: boolean
    sortable?: boolean

    defaultValue?: UploadFile<R, A>[]
    value?: UploadFile<R, A>[]
    onChange?(value: UploadFile<R, A>[]): void
}

const markFileId = (files?: FileList | (File | UploadFile<any, any[]>)[]) => {
    if (files) {
        for (const file of files) {
            (file as UploadFile).id ||= getRandomId()
        }
    }
}

export interface UploadRef<R = any, A extends any[] = any[]> extends HTMLDivElement {
    upload(...args: A): Promise<R | undefined>
}

export const Upload = memo(<R = any, A extends any[] = any[]>({
    inputProps,
    type = 'file',
    accept = type === 'image' ? 'image/*' : void 0,
    max = Infinity,
    showButton = true,
    buttonProps,
    buttonText = '选择文件',
    variant = 'square',
    sortable,
    droppable,

    defaultValue,
    value,
    onChange,
    onUpload,
    ...props
}: UploadProps<R, A>) => {
    const wrapperRef = useRef<UploadRef<R, A>>(null)

    const itemRefs = useRef(new Map<string, ItemRef<R, A> | null>())

    useImperativeHandle(props.ref, () => {
        wrapperRef.current!.upload = async (...args) => {
            for (const [, itemRef] of itemRefs.current) {
                itemRef?.setStatus('uploading')
                itemRef?.setProgress(0)
            }
            try {
                const ret = await onUpload?.(innerValue.current, progress => {
                    for (const [, itemRef] of itemRefs.current) {
                        itemRef?.setProgress(progress)
                    }
                }, ...args)
                for (const [, itemRef] of itemRefs.current) {
                    itemRef?.setStatus('success')
                    itemRef?.setProgress(100)
                }
                return ret
            } catch (e) {
                for (const [, itemRef] of itemRefs.current) {
                    itemRef?.setStatus('error')
                }
                throw e
            }
        }
        return wrapperRef.current!
    })

    const [innerValue, setInnerValue] = useControlled(defaultValue || [], value, value => {
        markFileId(value)
        onChange?.(value as UploadFile<R, A>[])
    })
    markFileId(innerValue.current)

    const innerInputRef = useRef<HTMLInputElement>(null)

    const buttonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        buttonProps?.onClick?.(e)
        innerInputRef.current!.click()
    }

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        changeFn(e.target.files)
        // 触发onChange后需要清空输入框的值，避免下次上传相同文件时不触发onChange
        e.target.value = ''
    }

    const changeFn = (files?: FileList | File[] | null) => {
        if (!files?.length) {
            return
        }
        if (max === 1) {
            setInnerValue([files[0]] as UploadFile<R, A>[])
        } else {
            const remain = max - innerValue.current.length
            remain > 0 && setInnerValue(o => {
                const newValue = [
                    ...o,
                    ...[...files].slice(0, remain) as UploadFile<R, A>[]
                ]
                return type === 'file' ? newValue : newValue.reverse()
            })
        }
    }

    const removeHandler = (id: string) => {
        setInnerValue(o => o.filter(f => f.id !== id))
    }

    const dragEndHandler = (e: DragEndEvent) => {
        const newValue = onDndDragEnd(e, innerValue.current)
        newValue && setInnerValue(newValue)
    }

    return (
        <div
            {...props}
            ref={wrapperRef}
            css={style}
            className={clsx(classes.root, props.className)}
            data-file-type={type}
            data-variant={variant}
            data-sortable={sortable}
        >
            <input
                type="file"
                accept={accept}
                multiple={max !== 1}
                {...mergeComponentProps<'input'>(
                    inputProps,
                    {
                        ref: innerInputRef,
                        className: classes.input,
                        onChange: inputChangeHandler
                    }
                )}
                data-hidden="true"
            />
            <DndContext sensors={useDndSensors()} onDragEnd={dragEndHandler}>
                <SortableContext items={innerValue.current} disabled={!sortable}>
                    {type === 'file'
                        ? <>
                            {droppable
                                ? <DropArea
                                    onClick={() => innerInputRef.current!.click()}
                                    onDrop={changeFn}
                                />
                                : showButton &&
                                <Button
                                    variant="outlined"
                                    prefix={<Icon icon={faUpload}/>}
                                    {...buttonProps}
                                    onClick={buttonClick}
                                >
                                    {buttonText}
                                </Button>
                            }
                            <TransitionGroup className={classes.files}>
                                {innerValue.current.map(file =>
                                    <SortableItem
                                        key={file.id}
                                        component={Collapse}
                                        className={classes.sortable}
                                        id={file.id}
                                    >
                                        <FileItem<R, A>
                                            ref={r => {
                                                r
                                                    ? itemRefs.current.set(file.id!, r)
                                                    : itemRefs.current.delete(file.id!)
                                            }}
                                            file={file}
                                            onRemove={() => removeHandler(file.id!)}
                                            onUpload={onUpload}
                                        />
                                    </SortableItem>
                                )}
                            </TransitionGroup>
                        </>
                        : <TransitionGroup className={classes.images}>
                            <Grow>
                                <div className={classes.imageWrap} data-clickable="true">
                                    <div className={classes.image} onClick={() => innerInputRef.current!.click()}>
                                        <Icon icon={faPlus}/>
                                    </div>
                                </div>
                            </Grow>
                            {innerValue.current.map(file =>
                                <SortableItem
                                    key={file.id}
                                    component={Collapse}
                                    className={classes.sortable}
                                    id={file.id}
                                    orientation="horizontal"
                                >
                                    <ImageItem<R, A>
                                        key={file.id}
                                        ref={r => {
                                            r
                                                ? itemRefs.current.set(file.id!, r)
                                                : itemRefs.current.delete(file.id!)
                                        }}
                                        type={type}
                                        file={file}
                                        onRemove={() => removeHandler(file.id!)}
                                        onUpload={onUpload}
                                    />
                                </SortableItem>
                            )}
                        </TransitionGroup>
                    }
                </SortableContext>
            </DndContext>
        </div>
    )
}) as any as {
    <R = any, A extends any[] = any[]>(props: UploadProps<R, A>): ReactElement
    DropArea: typeof DropArea
}

Upload.DropArea = DropArea