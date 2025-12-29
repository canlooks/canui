import {SerializedStyles} from '@emotion/react'

export type ConfigurableValue<T extends string | SerializedStyles> = T | T[] | (() => T | T[])

export type ConfigMapping<T> = {
    [K in keyof T]?: keyof T[K]
}

export function cubed<Def extends Record<string, Record<string, ConfigurableValue<Value>>>, Value extends string | SerializedStyles>(
    definitions: Def,
    defaultProps?: ConfigMapping<Def>
) {
    return (props?: ConfigMapping<Def>) => {
        const resolvedValues: Value[] = []
        const assignedProps = {...defaultProps, ...props}

        for (const p in assignedProps) {
            const configurableValue = definitions[p][assignedProps[p]!.toString()]
            const value = typeof configurableValue === 'function' ? configurableValue() : configurableValue
            Array.isArray(value)
                ? resolvedValues.push(...value)
                : resolvedValues.push(value)
        }

        return resolvedValues
    }
}

export function cubedClasses<Def extends Record<string, Record<string, ConfigurableValue<string>>>>(
    definitions: Def,
    defaultProps?: ConfigMapping<Def>
) {
    return cubed<Def, string>(definitions, defaultProps)
}

export function cubedStyles<Def extends Record<string, Record<string, ConfigurableValue<SerializedStyles>>>>(
    definitions: Def,
    defaultProps?: ConfigMapping<Def>
) {
    return cubed<Def, SerializedStyles>(definitions, defaultProps)
}