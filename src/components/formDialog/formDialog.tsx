import {ReactElement, ReactNode, Ref, useImperativeHandle, useRef, useState} from 'react'
import {DialogCloseReason, Dialog, DialogProps} from '../dialog'
import {Obj} from '../../types'
import {cloneRef, setDefaultColumnKey, useControlled, useLoading} from '../../utils'
import {Form, FormItem, FormItemProps, FormProps, FormRef, FormValue} from '../form'

interface FormDialogItemProps<I = any> extends Omit<FormItemProps<I>, 'key'>, Obj {
    key?: string | number
}

export interface FormDialogProps<V extends FormValue> extends Omit<DialogProps, 'title'> {
    title?: ReactNode | ((value?: V) => ReactNode)

    formProps?: FormProps<V>
    formRef?: Ref<FormRef<V>>
    items?: (FormDialogItemProps | ((value?: V) => FormDialogItemProps))[]
    onFinish?(value: V): any
}

export interface FormDialogRef<V extends FormValue> extends HTMLDivElement {
    open(value?: V): Promise<V>
}

export const FormDialog = (<V extends FormValue>({
    ref,
    title,
    formProps,
    formRef,
    items,
    onFinish,
    ...props
}: FormDialogProps<V>) => {
    const dialogRef = useRef<FormDialogRef<V>>(null)
    const innerFormRef = useRef<FormRef<V>>(null)

    const resolvers = useRef<PromiseWithResolvers<V>>(void 0)

    const [innerOpen, setInnerOpen] = useControlled(props.defaultOpen, props.open)

    const onCloseHandler = (reason: DialogCloseReason) => {
        if (reason === 'confirmed') {
            return
        }
        props.onClose?.(reason)
        resolvers.current?.reject({
            type: 'canceled',
            value: innerFormRef.current!.getFormValue()
        })
        setInnerOpen(false)
    }

    useImperativeHandle(ref, () => {
        if (dialogRef.current) {
            dialogRef.current.open = value => {
                value
                    ? innerFormRef.current?.setFormValue(value)
                    : innerFormRef.current?.resetForm()
                setInnerOpen(true)
                setValue(value)
                const {promise} = resolvers.current = Promise.withResolvers()
                return promise
            }
        }
        return dialogRef.current!
    })

    const [value, setValue] = useState<V>()

    const confirmHandler = () => {
        innerFormRef.current!.submit().then()
    }

    const [innerLoading, finishHandler] = useLoading(async (value: V) => {
        formProps?.onFinish?.(value)
        resolvers.current?.resolve(value)
        await onFinish?.(value)
        setInnerOpen(false)
    }, props.confirmLoading)

    const renderItems = () => {
        if (items?.length) {
            return items.map((item, i) => {
                const itemProps = typeof item === 'function' ? item(value) : item
                return (
                    <FormItem
                        {...itemProps}
                        key={setDefaultColumnKey(itemProps, i)}
                    />
                )
            })
        }
        return props.children
    }

    return (
        <Dialog
            {...props}
            title={typeof title === 'function' ? title(value) : title}
            ref={dialogRef}
            open={innerOpen.current}
            onClose={onCloseHandler}
            onConfirm={confirmHandler}
            confirmLoading={innerLoading.current}
        >
            <Form
                {...formProps}
                ref={cloneRef(formRef, innerFormRef)}
                onFinish={finishHandler}
            >
                {renderItems()}
            </Form>
        </Dialog>
    )
}) as <V extends FormValue>(props: FormDialogProps<V>) => ReactElement