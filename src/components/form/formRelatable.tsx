import {useRef, useEffect, ReactNode} from 'react'
import {FormRef, FormValue, useFormContext, useFormValueContext} from './form'
import {cloneDeep} from '../../utils'

export type FormRelatableProps<V extends FormValue> = {
    shouldUpdate(prevValue: V, nextValue: V): boolean
    children(formValue: V, formInstance: FormRef<V>): ReactNode
}

export function FormRelatable<V extends FormValue>(props: FormRelatableProps<V>) {
    const {formRef} = useFormContext()
    const {formValue} = useFormValueContext<V>()
    const prevFormValue = useRef<V>(void 0)

    useEffect(() => {
        prevFormValue.current = cloneDeep(formValue)
    }, [formValue])

    const childrenBackup = useRef<ReactNode>(void 0)

    if (!prevFormValue.current || props.shouldUpdate(prevFormValue.current, formValue as V)) {
        childrenBackup.current = props.children(formValue as V, formRef!.current as any)
    }

    return childrenBackup.current
}