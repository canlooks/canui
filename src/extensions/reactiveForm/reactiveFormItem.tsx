import {Model, ModelProps, RC, useReactor} from '@canlooks/reactive/react'
import {FieldProps, FormItem, FormItemProps, FormItemRef} from '../../components/form'
import {cloneElement, isValidElement, ReactElement, useRef} from 'react'
import {cloneRef} from '../../utils'
import {useReactiveFormContext} from './reactiveForm'

export interface ReactiveFormItemProps<I = any> extends Omit<ModelProps, 'children'>, Omit<FormItemProps<I>, 'initialValue' | 'dependencies'> {
    dependencies?(): any
}

export const ReactiveFormItem = RC(<I = any>({
    refer,
    postValue,
    dependencies,
    ...props
}: ReactiveFormItemProps) => {
    if (refer && (typeof props.children === 'function' || isValidElement(props.children))) {
        return (
            <Model refer={refer} postValue={postValue}>
                <InnerFormItem<I> {...props} dependencies={dependencies}/>
            </Model>
        )
    }
    return <FormItem {...props}/>
}) as <I = any>(props: ReactiveFormItemProps<I>) => ReactElement

interface InnerFormItemProps<I> extends Omit<ReactiveFormItemProps<I>, 'refer'>, FieldProps<I> {
}

function InnerFormItem<I>({
    dependencies,
    checked,
    value,
    onChange,
    ...props
}: InnerFormItemProps<I>) {
    const formItemRef = useRef<FormItemRef>(null)

    useReactor(() => dependencies?.(), () => {
        formItemRef.current!.validate().then()
    })

    const context = useReactiveFormContext()

    const fieldProps = {
        checked,
        value,
        onChange(e: any) {
            (props.children as any).props?.onChange?.(e)
            onChange?.(e)
            context.onChange?.()
        }
    }

    return (
        <FormItem
            {...props}
            ref={cloneRef(formItemRef, props.ref)}
            _fieldValue={checked ?? value}
        >
            {(_, styleProps, key) => {
                return typeof props.children === 'function'
                    ? props.children(fieldProps, styleProps, key)
                    : cloneElement(props.children as any, {
                        key,
                        ...fieldProps,
                        ...styleProps
                    })
            }}
        </FormItem>
    )
}