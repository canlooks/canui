import React, {ReactElement, Ref, memo, useEffect, useImperativeHandle, useMemo, useRef, useState, isValidElement} from 'react'
import {DialogCloseReason, Dialog, DialogProps} from '../dialog'
import {RowType} from '../dataGrid'
import {Form, FormItem, FormRef, FormValue} from '../form'
import {Curd, CurdBaseProps} from './curd'
import {cloneRef, columnsToFormItem, isUnset, useControlled, useLoading} from '../../utils'
import {Loading} from '../loading'
import {Button} from '../button'
import {classes, dialogStyle} from './curd.style'
import {PickerDialog, PickerDialogRef} from '../pickerDialog'
import {Id} from '../../types'
import {Icon} from '../icon'
import {faCopy} from '@fortawesome/free-regular-svg-icons/faCopy'

export type CurdDialogRef<R extends RowType = RowType, F extends FormValue = FormValue> = {
    open(activeRow?: R, initialFormValue?: F): Promise<F>
    selectSingle(): Promise<R>
    selectMultiple(selected?: Id[]): Promise<Id[]>
}

export interface CurdDialogProps<R extends RowType, F extends FormValue = FormValue> extends Omit<DialogProps, 'ref'> {
    ref?: Ref<CurdDialogRef<R, F>>
    onFinish?(value: F): any
    curdProps: CurdBaseProps<R, F>
}

export const CurdDialog = memo(<R extends RowType, F extends FormValue>({
    ref,
    onFinish,
    curdProps,
    ...props
}: CurdDialogProps<R, F>) => {
    const {
        columns, rowToForm, copyable, titleKey, formProps, formRef,
        dataName = '', createName = '添加', updateName = '编辑'
    } = curdProps

    /**
     * ----------------------------------------------------------------
     * ref与promise部分
     */

    const innerFormRef = useRef<FormRef<F>>(null)

    const openResolvers = useRef<PromiseWithResolvers<F>>(void 0)

    const [innerOpen, setInnerOpen] = useControlled(props.defaultOpen, props.open)

    const closeHandler = (reason: DialogCloseReason) => {
        if (reason === 'confirmed') {
            return
        }
        props.onClose?.(reason)
        openResolvers.current?.reject({
            type: 'canceled',
            value: innerFormRef.current!.getFormValue()
        })
        setInnerOpen(false)
    }

    const [selectMode, setSelectMode] = useState<'single' | 'multiple'>('single')

    const selectResolvers = useRef<PromiseWithResolvers<R>>(void 0)

    useImperativeHandle(ref, () => ({
        open(row, initialFormValue) {
            innerFormRef.current?.resetForm()
            handlingFormValue.current = initialFormValue
            setActiveRow(row)
            setInnerOpen(true)
            const {promise} = openResolvers.current = Promise.withResolvers()
            return promise
        },
        selectSingle() {
            isCopying.current = false
            setSelectMode('single')
            pickerDialogRef.current!.open().then()
            const {promise} = selectResolvers.current = Promise.withResolvers()
            return promise
        },
        selectMultiple(selected?: Id[]) {
            isCopying.current = false
            setSelectMode('multiple')
            return pickerDialogRef.current!.open(selected) as Promise<Id[]>
        }
    }))

    /**
     * ----------------------------------------------------------------
     * 表单项
     */

    const [activeRow, setActiveRow] = useState<R>()

    const handlingFormValue = useRef<F>(void 0)

    const [transforming, setFormValue] = useLoading(async (row?: R) => {
        const formValue = rowToForm && row ? await rowToForm(row) : row
        formValue && innerFormRef.current?.setFormValue(formValue as F)
    })

    useEffect(() => {
        if (!innerOpen.current) {
            return
        }
        if (handlingFormValue.current) {
            innerFormRef.current?.setFormValue(handlingFormValue.current)
        } else {
            setFormValue(activeRow)
        }
    }, [innerOpen.current, activeRow])

    const renderedFormItems = useMemo(() => {
        return columnsToFormItem(columns, activeRow)?.map(col => {
            if (isValidElement(col)) {
                return col
            }
            const {key, ...p} = col
            return <FormItem {...p} key={key}/>
        })
    }, [columns, activeRow])

    /**
     * ----------------------------------------------------------------
     * 结果处理与loading
     */

    const confirmHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
        props.onConfirm?.(e)
        await innerFormRef.current!.submit()
    }

    const [innerLoading, finishHandler] = useLoading(async (value: F) => {
        formProps?.onFinish?.(value)
        openResolvers.current?.resolve(value)
        await onFinish?.(value)
        setInnerOpen(false)
    }, props.confirmLoading)

    /**
     * ----------------------------------------------------------------
     * 复制
     */

    const isCopying = useRef(false)
    const pickerDialogRef = useRef<PickerDialogRef>(null)

    const onCopyButtonClick = () => {
        isCopying.current = true
        setSelectMode('single')
        pickerDialogRef.current!.open().then()
    }

    const toggleHandler = (checked: boolean, value: Id, row: R) => {
        if (isCopying.current) {
            const title = !isUnset(titleKey) ? row[titleKey] : void 0
            typeof title === 'string'
                ? setFormValue({
                    ...row,
                    [titleKey!]: `${title} - 副本`
                })
                : setFormValue(row)
        } else {
            // 处理selectSingle
            selectResolvers.current?.resolve(row)
        }
    }

    const rowTitle = activeRow && !isUnset(titleKey) ? activeRow[titleKey] : void 0

    return (
        <Dialog
            css={dialogStyle}
            width={600}
            title={activeRow
                ? `${updateName}${dataName}${rowTitle ? ' - ' + rowTitle : ''}`
                : <div className={classes.dialogTitle}>
                    <span>{createName}{dataName}</span>
                    {copyable &&
                        <Button
                            variant="plain"
                            prefix={<Icon icon={faCopy}/>}
                            onClick={onCopyButtonClick}
                        >
                            从已有{dataName || '数据'}复制
                        </Button>
                    }
                </div>
            }
            {...props}
            open={innerOpen.current}
            onClose={closeHandler}
            onConfirm={confirmHandler}
            confirmLoading={innerLoading.current}
        >
            <Loading open={transforming.current}>
                <Form
                    labelWidth="20%"
                    {...formProps}
                    ref={cloneRef(formRef, innerFormRef)}
                    onFinish={finishHandler}
                >
                    {renderedFormItems}
                </Form>
            </Loading>

            {copyable &&
                <PickerDialog
                    ref={pickerDialogRef}
                    multiple={selectMode === 'multiple'}
                    onToggle={toggleHandler}
                >
                    <Curd
                        {...curdProps}
                        variant="embeded"
                        copyable={false}
                        creatable={false}
                        updatable={false}
                        deletable={false}
                    />
                </PickerDialog>
            }
        </Dialog>
    )
}) as <R extends RowType, F extends FormValue>(props: CurdDialogProps<R, F>) => ReactElement