import {ReactNode, memo, useState} from 'react'
import {Dialog, DialogProps} from '../dialog'
import {StatusIcon} from '../status'

export interface AppDialogProps extends Omit<DialogProps, 'content' | 'onConfirm' | 'onCancel'> {
    content?: ReactNode
    onConfirm?(...args: any[]): any
    onCancel?(...args: any[]): any
}

export class AppDialogMethods {
    async info(props: AppDialogProps, ...args: any[]) {
    }

    async success(props: AppDialogProps, ...args: any[]) {
    }

    async warning(props: AppDialogProps, ...args: any[]) {
    }

    async error(props: AppDialogProps, ...args: any[]) {
    }

    async confirm(props: AppDialogProps, ...args: any[]) {
    }
}

export const AppDialog = memo(({methods}: { methods: AppDialogMethods }) => {
    const [stacks, setStacks] = useState<StackProps[]>([])

    const defineMethod = (type: keyof AppDialogMethods) => {
        return (props: AppDialogProps, ...args: any[]) => {
            return new Promise<void>((resolve, reject) => {
                setStacks(o => [
                    ...o,
                    {
                        ...props,
                        type,
                        async onConfirm() {
                            await props.onConfirm?.(...args)
                            resolve()
                        },
                        onCancel() {
                            props.onCancel?.(...args)
                            reject()
                        },
                        onClosed() {
                            props.onClosed?.()
                            setStacks(_o => {
                                _o.splice(o.length, 1)
                                return [..._o]
                            })
                        }
                    }
                ])
            })
        }
    }

    methods.info = defineMethod('info')
    methods.success = defineMethod('success')
    methods.warning = defineMethod('warning')
    methods.error = defineMethod('error')
    methods.confirm = defineMethod('confirm')

    return stacks.map((p, i) => {
        return <AppDialogStack key={i} {...p} />
    })
})

/**
 * ----------------------------------------------------------------------
 * Item部分
 */

interface StackProps extends AppDialogProps {
    type: keyof AppDialogMethods
}

const AppDialogStack = memo(({
    type,
    content,
    ...props
}: StackProps) => {
    const [open, setOpen] = useState(true)

    return (
        <Dialog
            width={360}
            maskClosable={false}
            icon={<StatusIcon status={type}/>}
            showCancel={type === 'confirm'}
            showClose={false}
            confirmText={type === 'confirm' ? void 0 : '知道了'}
            {...props}
            open={open}
            onClose={reason => {
                props.onClose?.(reason)
                setOpen(false)
            }}
        >
            {content}
        </Dialog>
    )
})