import {ReactNode, cloneElement, isValidElement, useEffect, useImperativeHandle, useMemo, useRef, ElementType, Ref} from 'react'
import {FormRef, FormSharedProps, FormValue, useFormContext, useFormStyleContext, useFormValueContext} from './form'
import {ColorPropsValue, MergeProps, Size} from '../../types'
import {FieldPath, clsx, getValueOnChange, queryDeep, stringifyField, useDerivedState, toArray, getRandomId, isUnset, useStrictMemo} from '../../utils'
import {DescriptionItem, DescriptionItemProps} from '../descriptions'
import {classes} from './form.style'
import {Collapse} from '../transitionBase'

export type FormItemRules<I = any, R = FormRef> = {
    message?: ReactNode
    required?: boolean
    pattern?: RegExp
    validator?(fieldValue: I | undefined, formValue: any, formRef: R | null): any
}

export type FieldProps<I = any> = {
    checked?: boolean
    value?: I
    onChange?(e: any): void
}

export type StyleProps = {
    size?: Size
    color?: ColorPropsValue
}

export type FormItemChildren<T extends ReactNode = ReactNode, I = any> = T | ((fieldProps: FieldProps<I>, styleProps: StyleProps, key: string) => T)

export interface FormItemOwnProps<I = any> extends FormSharedProps {
    ref?: Ref<FormItemRef>
    wrapperRef?: Ref<HTMLDivElement>
    field?: FieldPath
    initialValue?: I
    rules?: FormItemRules<I> | FormItemRules<I>[]
    required?: boolean
    error?: boolean
    helperText?: ReactNode
    dependencies?: FieldPath[]
    /**
     * 若`children`为`function`类型时，
     * 第三个参数`key`主要用于强制重渲染，在没有{@link initialValue}时非常有用
     */
    children?: FormItemChildren
    noStyle?: boolean

    /** @private 内部使用，强制指定字段值 */
    _fieldValue?: I
}

export type FormItemProps<I = any, C extends ElementType = 'div'> = MergeProps<FormItemOwnProps<I>, DescriptionItemProps<C>>

export type FieldError = null | { message: ReactNode }

export type FormItemRef = {
    validate(): Promise<boolean>
    error: FieldError
    reset(): void
    /** @private */
    reset(currentFormValue: FormValue, initialFormValue?: FormValue): void
    isTouched(): boolean
}

export const FormItem: <I = any, C extends ElementType = 'div'>(props: FormItemProps<I, C>) => ReactNode = ({
    ref,
    wrapperRef,
    field,
    initialValue,
    label = '',
    rules,
    required,
    error,
    helperText,
    dependencies,
    children,
    noStyle,
    requiredMark,
    variant,
    size,
    _fieldValue,
    ...props
}: FormItemProps) => {
    const context = useFormStyleContext()

    requiredMark ??= context.requiredMark ?? '*'
    variant ??= context.variant ?? 'grid'
    size ??= context.size

    const {formValue, setFieldValue} = useFormValueContext()
    const {itemsContainer, formRef} = useFormContext()

    const shouldValidate = useRef(false)
    const isTouched = useRef(false)

    const [innerError, setInnerError] = useDerivedState(error)
    const [innerHelperText, setInnerHelperText] = useDerivedState<ReactNode | undefined>(helperText)

    const stringField = !isUnset(field) ? stringifyField(field) : void 0

    /**
     * --------------------------------------------------------------------
     * 重置与初始化
     */

    const reset = (currentFormValue = formValue, initialFormValue = {}) => {
        // formRef的resetForm()方法会传入新的formValue，其他情况使用当前的formValue
        shouldValidate.current = isTouched.current = false
        if (!isUnset(field) && currentFormValue) {
            if (typeof initialValue !== 'undefined') {
                queryDeep(currentFormValue, field, () => initialValue)
            } else if (typeof initialFormValue !== 'undefined') {
                const initialFieldValue = queryDeep(initialFormValue, field)
                queryDeep(currentFormValue, field, () => initialFieldValue)
            }
        }
        setInnerError(false)
    }

    useMemo(reset, [stringField])

    /**
     * --------------------------------------------------------------------
     * 字段值
     */

    const fieldValue = useMemo(() => {
        if (typeof _fieldValue !== 'undefined') {
            return _fieldValue
        }
        if (!isUnset(field) && formValue) {
            return queryDeep(formValue, field)
        }
    }, [formValue, field, _fieldValue])

    /**
     * --------------------------------------------------------------------
     * 校验
     */

    const rulesArr = toArray(rules)

    const validate = async () => {
        if (error) {
            return false
        }
        const defaultMessage = `请输入${label}`
        const promises: Promise<any>[] = []
        let invalid = false
        rulesArr?.some(r => {
            if (
                (r.required && (isUnset(fieldValue) || fieldValue === '')) ||
                (r.pattern && typeof fieldValue === 'string' && !r.pattern.test(fieldValue))
            ) {
                setInnerError(true)
                setInnerHelperText(r.message || defaultMessage)
                return invalid = true
            }
            if (r.validator) {
                promises.push(
                    (async () => {
                        try {
                            await r.validator!(fieldValue, formValue, formRef?.current || null)
                            setInnerError(false)
                        } catch (e) {
                            setInnerError(invalid = true)
                            setInnerHelperText(
                                typeof e === 'string' || typeof e === 'number' || isValidElement(e) ? e
                                    : e instanceof Error ? e.message
                                        : r.message || defaultMessage
                            )
                        }
                    })()
                )
            }
            return false
        })
        await Promise.all(promises)
        if (!invalid) {
            setInnerError(false)
        }
        return !invalid
    }

    /**
     * --------------------------------------------------------------------
     * 自动校验与依赖更新
     */

    const dependencyValues = useMemo(() => {
        return formValue && dependencies?.map(d => queryDeep(formValue, d))
    }, [formValue, ...dependencies || []])

    useStrictMemo(() => {
        if (!shouldValidate.current) {
            // 跳过首次渲染
            shouldValidate.current = true
            return
        }
        validate().then()
    }, [fieldValue, ...dependencyValues || []])

    /**
     * --------------------------------------------------------------------
     * 挂载formItemRef
     */

    const formItemRef = useRef<FormItemRef>(void 0)

    formItemRef.current = {
        validate,
        reset,
        error: innerError.current ? {message: innerHelperText.current} : null,
        isTouched: () => isTouched.current
    }

    useImperativeHandle(ref, () => formItemRef.current!)

    useEffect(() => {
        if (typeof stringField === 'undefined' || !itemsContainer) {
            return
        }
        itemsContainer.set(stringField, formItemRef.current!)
        return () => {
            itemsContainer.delete(stringField)
        }
    })

    /**
     * --------------------------------------------------------------------
     * 渲染部分
     */

    const isRequired = useMemo(() => {
        return required ?? rulesArr?.some(r => r.required)
    }, [rules, required])

    const [randomKey] = useDerivedState<string>(prev => {
        // fieldValue变为undefined时，需要更新key以强制重渲染组件
        return !prev || typeof fieldValue === 'undefined' ? getRandomId() : prev
    }, [fieldValue])

    const renderedChildren = useMemo(() => {
        if (typeof children === 'function') {
            return children(
                !isUnset(field)
                    ? {
                        ...typeof fieldValue === 'boolean'
                            ? {checked: fieldValue}
                            : {value: fieldValue},
                        onChange(e) {
                            isTouched.current = true
                            setFieldValue?.(field, getValueOnChange(e, fieldValue))
                        }
                    }
                    : {},
                {
                    ...size && {size},
                    ...innerError.current && {color: 'error'}
                },
                randomKey.current
            )
        }
        if (isValidElement(children)) {
            const {props: childProps} = children as any
            return cloneElement(children as any, {
                key: children.key ?? randomKey.current,
                ...!isUnset(field) && {
                    ...typeof fieldValue === 'boolean'
                        ? {checked: childProps.checked ?? fieldValue}
                        : {value: childProps.value ?? fieldValue},
                    onChange(e) {
                        childProps.onChange?.(e)
                        isTouched.current = true
                        setFieldValue?.(field, getValueOnChange(e, fieldValue))
                    }
                },
                ...size && {size},
                ...innerError.current && {color: 'error'}
            })
        }
        return children
    }, [children, fieldValue, size, innerError.current, randomKey.current])

    if (noStyle || variant === 'plain') {
        return renderedChildren
    }

    return (
        <DescriptionItem
            {...props}
            ref={wrapperRef}
            className={clsx(classes.item, props.className)}
            label={!!label &&
                <>
                    {isRequired && !!requiredMark &&
                        <span className={classes.requiredMark}>{requiredMark}</span>
                    }
                    {label}
                </>
            }
        >
            {renderedChildren}
            <Collapse in={innerError.current || !!helperText}>
                <div className={classes.helperText}>{innerHelperText.current}</div>
            </Collapse>
        </DescriptionItem>
    )
}