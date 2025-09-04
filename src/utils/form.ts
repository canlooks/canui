import {Id} from '../types'

/**
 * 从onChange回调中获取表单字段的值
 * @param e 
 * @param prevValue 传入当前的值作为参考
 */
export function getValueOnChange(e: any, prevValue?: any) {
    if (typeof e === 'object' && e !== null && typeof e.target === 'object' && e.target !== null) {
        return typeof prevValue === 'boolean' ? e.target.checked : e.target.value
    }
    return e
}

export type FieldPath = Id | Id[]

/**
 * 将name字段统一转换成字符串方便处理
 * @param field 
 */
export function stringifyField(field: FieldPath) {
    return Array.isArray(field) ? field.join('.') : field.toString()
}