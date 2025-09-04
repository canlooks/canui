import {ReactElement, ReactNode, Ref, cloneElement, isValidElement, useImperativeHandle, useRef, useState} from 'react'
import {DialogCloseReason, Dialog, DialogProps} from '../dialog'
import {clsx, mergeComponentProps, toArray, useControlled} from '../../utils'
import {classes, style} from './pickerDialog.style'
import {OptionType, SelectionContext, SelectionContextBaseProps} from '../selectionContext'
import {Divider} from '../divider'
import {SelectedList, SelectedListProps} from '../selectedList'
import {Button} from '../button'
import {Id} from '../../types'
import {Icon} from '../icon'
import {faTrashCan} from '@fortawesome/free-regular-svg-icons/faTrashCan'

export type PickerDialogRef<V extends Id = Id> = {
    open(value?: V | V[]): Promise<V | V[]>
}

export interface PickerDialogProps<O extends OptionType<V>, V extends Id = Id> extends Omit<DialogProps, 'ref' | 'children' | 'onConfirm' | 'onToggle'>,
    Omit<SelectionContextBaseProps<O, V>, 'children'> {
    ref?: Ref<PickerDialogRef<V>>
    /** 默认的ref已被PickerDialogRef取代，需要dialogRef指向dialog元素 */
    dialogRef?: Ref<HTMLDivElement>

    multiple?: boolean
    children?: ReactNode | ((selectionProps: Omit<SelectionContextBaseProps<O, V>, 'children'> & { multiple?: boolean }) => ReactNode)

    showSelectedList?: boolean
    /** 已选列表的位置，默认为`right` */
    selectedListPlacement?: 'left' | 'right'
    selectedListProps?: SelectedListProps<V>
    selectedItemProps?: SelectedListProps<V>['itemProps']

    onConfirm?(value: V | V[]): void

    /** @alias {@link options} */
    rows?: O[]
    /** @alias {@link options} */
    nodes?: O[]
}

export const PickerDialog = (<O extends OptionType<V>, V extends Id = Id>({
    ref,
    dialogRef,
    multiple,
    children,
    showSelectedList = !!multiple,
    selectedListPlacement = 'right',
    selectedListProps,
    selectedItemProps,
    onConfirm,
    rows,
    nodes,
    // 以下属性从SelectionContextBaseProps继承
    options = rows ?? nodes,
    primaryKey = 'id',
    childrenKey = 'children',
    relation = 'dependent',
    integration = 'shallowest',
    disabled,
    clearable = !!multiple,
    onToggle,
    ...props
}: PickerDialogProps<O, V>) => {
    const resolvers = useRef<PromiseWithResolvers<V | V[]>>(void 0)

    useImperativeHandle(ref, () => ({
        open(value?: V | V[]) {
            _setInnerValue(value ?? null)
            setInnerOpen(true)
            const {promise} = resolvers.current = Promise.withResolvers()
            return promise
        }
    }))

    const [innerValue, _setInnerValue] = useState<null | V | V[]>(multiple ? [] : null)
    const setInnerValue = (value: null | V | V[]) => {
        _setInnerValue(value)
        // 单选模式，值每次改变都触发确认
        !multiple && confirmHandler(value)
    }

    const [innerOpen, setInnerOpen] = useControlled(props.defaultOpen, props.open)

    const closeHandler = (reason: DialogCloseReason) => {
        if (reason === 'confirmed') {
            return
        }
        props.onClose?.(reason)
        if (!open) {
            resolvers.current?.reject({
                type: 'canceled',
                value: innerValue
            })
        }
        setInnerOpen(false)
    }

    const confirmHandler = (value = innerValue) => {
        onConfirm?.(value!)
        resolvers.current?.resolve(value!)
        setInnerOpen(false)
    }

    const onExited = () => {
        _setInnerValue(null)
    }

    const renderChildren = () => {
        const selectionProps = {rows, nodes, options, primaryKey, relation, integration, disabled, multiple}
        return typeof children === 'function'
            ? children(selectionProps)
            : isValidElement(children)
                ? cloneElement(children, {
                    ...selectionProps,
                    ...children.props as any
                })
                : children
    }

    const selectedCount = toArray(innerValue)?.length || 0

    return (
        <SelectionContext
            {...{
                options,
                primaryKey,
                childrenKey,
                relation,
                integration,
                disabled,
                clearable,
                multiple
            }}
            value={innerValue as any}
            onChange={setInnerValue}
            onToggle={onToggle}
        >
            <Dialog
                {...mergeComponentProps<DialogProps>(
                    {
                        width: multiple ? '90%' : 1080,
                        footer: null,
                        maskClosable: false
                    },
                    props,
                    {
                        ref: dialogRef,
                        css: style,
                        className: classes.root,
                        open: innerOpen.current,
                        modalProps: mergeComponentProps(props.modalProps, {onExited})
                    }
                )}
                onClose={closeHandler}
                {...showSelectedList && {
                    [selectedListPlacement === 'left' ? 'prefix' : 'suffix']: (
                        <div className={classes.selectedArea}>
                            <Divider className={classes.count} textAlign="start">
                                <div>
                                    已选择<b>{selectedCount}</b>项
                                </div>
                                {clearable &&
                                    <Button
                                        prefix={<Icon icon={faTrashCan}/>}
                                        variant="plain"
                                        color="text.secondary"
                                        onClick={() => setInnerValue(multiple ? [] : null)}
                                    >
                                        清空
                                    </Button>
                                }
                            </Divider>
                            <SelectedList
                                itemProps={selectedItemProps}
                                {...selectedListProps}
                                className={clsx(classes.list, selectedListProps?.className)}
                            />
                            <Button
                                className={classes.confirm}
                                disabled={selectedCount === 0}
                                onClick={() => confirmHandler()}
                            >
                                确定
                            </Button>
                        </div>
                    )
                }}
            >
                {renderChildren()}
            </Dialog>
        </SelectionContext>
    )
}) as <O extends OptionType<V>, V extends Id = Id>(props: PickerDialogProps<O, V>) => ReactElement