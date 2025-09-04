import {ReactNode, isValidElement, memo, useState} from 'react'
import {ActionSheet, ActionSheetProps} from '../actionSheet'
import {MenuItemProps} from '../menuItem'
import {Obj} from '../../types'

export interface AppActionSheetProps<A extends MenuItemProps & Obj> extends Omit<ActionSheetProps<A>, 'onAction' | 'onConfirm'> {
    onAction?(action: A, ...args: any[]): any
    onConfirm?(...args: any[]): any
}

export class AppActionSheetMethods {
    async confirm(title?: ReactNode, ...args: any[]): Promise<void>
    async confirm(props?: AppActionSheetProps<MenuItemProps>, ...args: any[]): Promise<void>
    async confirm() {
    }

    async open<A extends MenuItemProps & Obj>(props: AppActionSheetProps<A>, ...args: any[]): Promise<A>
    async open<A extends MenuItemProps & Obj>(props: AppActionSheetProps<A>, ...args: any[]) {
    }
}

export const AppActionSheet = memo(({methods}: { methods: AppActionSheetMethods }) => {
    const [stacks, setStacks] = useState<StackProps<MenuItemProps>[]>([])

    const defineMethods = (type: keyof AppActionSheetMethods) =>
        (params?: ReactNode | AppActionSheetProps<MenuItemProps>, ...args: any[]) =>
            new Promise<any>((resolve, reject) => {
                const props = typeof params !== 'object' || isValidElement(params)
                    ? {title: params} as AppActionSheetProps<MenuItemProps>
                    : params as AppActionSheetProps<MenuItemProps>
                setStacks(o => [
                    ...o,
                    {
                        ...props,
                        type,
                        onAction(action) {
                            props?.onAction?.(action, ...args)
                            resolve(action)
                        },
                        onConfirm() {
                            props?.onConfirm?.(...args)
                            resolve(void 0)
                        },
                        onCancel(e) {
                            props?.onCancel?.(e)
                            reject()
                        },
                        onClosed() {
                            props?.onClosed?.()
                            setStacks(_o => {
                                _o.splice(o.length, 1)
                                return [..._o]
                            })
                        }
                    }
                ])
            })

    methods.confirm = defineMethods('confirm')
    methods.open = defineMethods('open')

    return stacks.map((p, i) =>
        <AppActionSheetStack key={i} {...p}/>
    )
})

/**
 * ----------------------------------------------------------------------
 * Item部分
 */

interface StackProps<A extends MenuItemProps> extends ActionSheetProps<A> {
    type: keyof AppActionSheetMethods
}

const AppActionSheetStack = memo(<A extends MenuItemProps>({
    type,
    ...props
}: StackProps<A>) => {
    const [open, setOpen] = useState(true)

    return (
        <ActionSheet
            showConfirm={type === 'confirm'}
            {...props}
            open={open}
            onClose={reason => {
                props.onClose?.(reason)
                setOpen(false)
            }}
        />
    )
})