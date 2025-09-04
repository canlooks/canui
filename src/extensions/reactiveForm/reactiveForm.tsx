import {RC} from '@canlooks/reactive/react'
import {Form, FormProps, FormRef} from '../../components/form'
import {createContext, ReactElement, Ref, useContext, useImperativeHandle, useMemo, useRef} from 'react'
import {ReactiveFormItem} from './reactiveFormItem'

export type ReactiveFormPropsRef = Pick<FormRef, 'submit' | 'getFormErrors' | 'getFieldError' | 'resetForm' | 'resetField' | 'isFormTouched' | 'isFieldTouched'>

export interface ReactiveFormProps extends Omit<FormProps, 'ref' | 'initialValue' | 'onChange' | 'onFinish' | 'items'> {
    ref?: Ref<ReactiveFormPropsRef>
    onChange?(): void
    onFinish?(): void
}

const ReactiveFormContext = createContext<Pick<ReactiveFormProps, 'onChange'>>({})

export function useReactiveFormContext() {
    return useContext(ReactiveFormContext)
}

export const ReactiveForm = RC(({
    ref,
    onChange,
    onFinish,
    ...props
}: ReactiveFormProps) => {
    const innerFormRef = useRef<FormRef>(null)

    useImperativeHandle(ref, () => ({
        submit: innerFormRef.current!.submit,
        getFormErrors: innerFormRef.current!.getFormErrors,
        getFieldError: innerFormRef.current!.getFieldError,
        resetForm: innerFormRef.current!.resetForm,
        resetField: innerFormRef.current!.resetField,
        isFormTouched: innerFormRef.current!.isFormTouched,
        isFieldTouched: innerFormRef.current!.isFieldTouched
    }))

    return (
        <ReactiveFormContext value={useMemo(() => ({onChange}), [onChange])}>
            <Form {...props} ref={innerFormRef} onFinish={() => onFinish?.()}/>
        </ReactiveFormContext>
    )
}) as {
    (props: ReactiveFormProps): ReactElement
    Item: typeof ReactiveFormItem
}

ReactiveForm.Item = ReactiveFormItem

/** Alias {@link ReactiveForm} */
export const RF = ReactiveForm