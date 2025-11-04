import React, {Dispatch, ReactElement, ReactNode, Ref, RefObject, SetStateAction, createContext, useContext, useImperativeHandle, useMemo, useRef, ElementType} from 'react'
import {Obj, OverridableProps, Size} from '../../types'
import {FieldPath, clsx, cloneDeep, mergeDeep, queryDeep, stringifyField, useSync, useSyncState} from '../../utils'
import {classes, style} from './form.style'
import {FieldError, FormItem, FormItemProps, FormItemRef} from './formItem'
import {FormRelatable} from './formRelatable'
import {Descriptions, DescriptionsProps, DescriptionsSharedProps} from '../descriptions'
import {GridOwnProps} from '../grid'

export type FormValue = Obj

// Form, Item与styleContext共享的属性
export type FormSharedProps = {
    /** 必填字段的标记，默认为`*` */
    requiredMark?: ReactNode
    /** variant为"grid"或"table"时会渲染Descriptions组件，并传递variant属性，默认为`grid` */
    variant?: 'plain' | 'grid' | 'table'
    size?: Size
}

interface FormOwnProps<V extends FormValue = FormValue> extends FormSharedProps, DescriptionsSharedProps, GridOwnProps {
    ref?: Ref<FormRef<V>>
    /** 最外层元素的ref，默认{@link ref}属性已经被{@link FormRef}取代 */
    wrapperRef?: Ref<HTMLFormElement>
    initialValue?: V
    onChange?(field: FieldPath, value: any, formValue: V): void
    onFinish?(value: V): void
    items?: (FormItemProps & Obj)[]
    descriptionsProps?: DescriptionsProps
}

export type FormProps<V extends FormValue = FormValue, C extends ElementType = 'form'> = OverridableProps<FormOwnProps<V>, C>

type FormContext<V extends FormValue> = {
    inForm?: boolean
    itemsContainer?: Map<string, FormItemRef>
    formRef?: RefObject<FormRef<V> | null>
}

const FormContext = createContext<FormContext<any>>({})

export function useFormContext<V extends FormValue>(): FormContext<V> {
    return useContext(FormContext)
}

type FormValueContext<V extends FormValue> = {
    formValue?: V
    setFieldValue?(field: FieldPath, value: any, silent?: boolean): void
}

const FormValueContext = createContext<FormValueContext<any>>({})

export function useFormValueContext<V extends FormValue>(): FormValueContext<V> {
    return useContext(FormValueContext)
}

const FormStyleContext = createContext<FormSharedProps>({})

export function useFormStyleContext() {
    return useContext(FormStyleContext)
}

export type FormRef<V extends FormValue = FormValue> = {
    /** 存在校验不通过的字段时会得到`null` */
    submit(): Promise<V | null>

    getFieldValue<T = any>(field: FieldPath): T
    getFormValue(): V
    getFieldError(field: FieldPath): FieldError | undefined
    getFormErrors(): { [p: string]: FieldError }

    setFormValue: Dispatch<SetStateAction<V>>
    mergeFormValue(value: Partial<V>): void
    setFieldValue(field: FieldPath, value: any): void

    resetForm(): void
    resetField(field: FieldPath): void

    isFormTouched(): boolean
    isFieldTouched(field: FieldPath): boolean
}

export const Form = (
    ({
        component: Component = 'form',
        ref,
        wrapperRef,
        initialValue,
        onChange,
        onFinish,
        items,
        descriptionsProps,
        requiredMark,
        variant,
        // 以下属性从DescriptionsSharedProps继承
        labelWidth,
        labelPlacement = 'left',
        colon = ':',
        size,
        disableMargin,
        disablePadding,
        // 以下属性从GridOwnProps继承
        inline,
        columnCount = 1,
        gap,
        columnGap,
        rowGap,
        ...props
    }: FormProps) => {
        const {inForm, formRef: parentFormRef} = useFormContext()

        const renderChildren = () => {
            return variant === 'plain'
                ? props.children
                : <Descriptions
                    {...descriptionsProps}
                    size={size}
                    labelWidth={labelWidth}
                    colon={colon}
                    labelPlacement={labelPlacement}
                    disableMargin={disableMargin}
                    disablePadding={disablePadding}
                    variant={variant as any}
                    inline={inline}
                    columnCount={columnCount}
                    gap={gap}
                    columnGap={columnGap}
                    rowGap={rowGap}
                    items={items as any}
                    itemComponent={FormItem}
                >
                    {props.children}
                </Descriptions>
        }

        /**
         * ------------------------------------------------------------------------
         * 嵌套在另个一个form中，值取最顶层的form，当前组件仅做样式处理
         */

        if (inForm) {
            useImperativeHandle(ref, () => parentFormRef!.current!)

            const context = useFormStyleContext()

            requiredMark ??= context.requiredMark ?? '*'
            variant ??= context.variant ?? 'grid'
            size ??= context.size

            return (
                <FormStyleContext value={
                    useMemo(() => ({
                        requiredMark, variant, size
                    }), [
                        requiredMark, variant, size
                    ])
                }>
                    {renderChildren()}
                </FormStyleContext>
            )
        }

        requiredMark ??= '*'
        variant ??= 'grid'

        /**
         * ------------------------------------------------------------------------
         * 表单值
         */

        const [formValue, setFormValue] = useSyncState(() => initialValue ? cloneDeep(initialValue) : {})

        const syncOnChange = useSync(onChange)

        /**
         * 设置某个字段的值
         * @param field
         * @param value
         * @param silent 为true时不会触发onChange回调
         */
        const setFieldValue = (field: FieldPath, value: any, silent?: boolean) => {
            setFormValue(({...newValue}) => {
                queryDeep(newValue, field, () => value)
                return newValue
            })
            !silent && syncOnChange.current?.(field, value, formValue.current)
        }

        /**
         * ------------------------------------------------------------------------
         * 挂载ref
         */

        const itemsContainer = useRef(new Map<string, FormItemRef>())

        const submitHandler = async (e?: React.FormEvent<HTMLFormElement>) => {
            e?.preventDefault()
            try {
                await Promise.all(
                    [...itemsContainer.current].map(async ([, item]) => {
                        return await item.validate() || Promise.reject()
                    })
                )
                onFinish?.(formValue.current)
                return formValue.current
            } catch (e) {
                return null
            }
        }

        const formRef = useRef<FormRef>(null)

        formRef.current = {
            submit: submitHandler,
            getFieldValue: field => queryDeep(formValue.current, field),
            getFormValue: () => formValue.current,
            getFieldError: field => itemsContainer.current.get(stringifyField(field))?.error,
            getFormErrors: () => {
                const errorObj: { [p: string]: FieldError } = {}
                for (const [field, item] of itemsContainer.current) {
                    if (item.error) {
                        errorObj[field] = item.error
                    }
                }
                return errorObj
            },
            setFormValue,
            mergeFormValue: value => {
                setFormValue(o => mergeDeep({...o}, value))
            },
            setFieldValue: (field, value) => setFieldValue(field, value, true),
            resetForm: () => {
                const newValue = initialValue ? cloneDeep(initialValue) : {}
                for (const [, item] of itemsContainer.current) {
                    item.reset(newValue)
                }
                setFormValue(newValue)
            },
            resetField: field => {
                itemsContainer.current.get(stringifyField(field))?.reset(formValue.current, initialValue)
                setFormValue(o => ({...o}))
            },
            isFormTouched: () => [...itemsContainer.current].some(([, item]) => item.isTouched),
            isFieldTouched: field => !!itemsContainer.current.get(stringifyField(field))?.isTouched
        }

        useImperativeHandle(ref, () => formRef.current!)

        return (
            <Component
                {...props}
                ref={wrapperRef}
                css={style}
                className={clsx(classes.root, props.className)}
                onSubmit={submitHandler}
            >
                <FormContext value={
                    useMemo(() => ({
                        inForm: true,
                        itemsContainer: itemsContainer.current, formRef
                    }), [])
                }>
                    <FormStyleContext value={
                        useMemo(() => ({
                            requiredMark, variant, size
                        }), [
                            requiredMark, variant, size
                        ])
                    }>
                        <FormValueContext value={
                            useMemo(() => ({
                                formValue: formValue.current, setFieldValue
                            }), [formValue.current])
                        }>
                            {renderChildren()}
                        </FormValueContext>
                    </FormStyleContext>
                </FormContext>
            </Component>
        )
    }
) as {
    <V extends FormValue, C extends ElementType = 'form'>(props: FormProps<V, C>): ReactElement
    Item: typeof FormItem
    Relatable: typeof FormRelatable
}

Form.Item = FormItem
Form.Relatable = FormRelatable