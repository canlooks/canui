import {ReactNode, memo, useState} from 'react'
import {Dialog, DialogProps} from '../dialog'
import {StatusIcon} from '../status'
import {getRandomId} from '../../utils'

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
                const key = getRandomId()
                setStacks(o => {
                    return [
                        ...o,
                        {
                            ...props,
                            key,
                            type,
                            onConfirm: async () => {
                                await props.onConfirm?.(...args)
                                resolve()
                            },
                            onCancel: () => {
                                props.onCancel?.(...args)
                                reject()
                            },
                            onClosed: () => {
                                props.onClosed?.()
                                setStacks(stacks => stacks.filter(stack => stack.key !== key))
                            }
                        }
                    ]
                })
            })
        }
    }

    methods.info = defineMethod('info')
    methods.success = defineMethod('success')
    methods.warning = defineMethod('warning')
    methods.error = defineMethod('error')
    methods.confirm = defineMethod('confirm')

    return stacks.map(p => {
        return <AppDialogStack {...p} key={p.key}/>
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
    return (
        <Dialog
            width={360}
            maskClosable={false}
            icon={<StatusIcon status={type}/>}
            showCancel={type === 'confirm'}
            showClose={false}
            confirmText={type === 'confirm' ? void 0 : '知道了'}
            defaultOpen
            {...props}
        >
            {content}
        </Dialog>
    )
})