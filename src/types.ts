import {ComponentProps, ComponentPropsWithRef, ElementType, ReactElement} from 'react'

/**
 * ----------------------------------------------------------------------------------
 * Helpers
 */

export type Id = string | number

export type Obj<T = any> = { [p: Id]: T }

export type ToRequired<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Omit<T, K>>

/**
 * ----------------------------------------------------------------------------------
 * Enums
 */

export type ThemeEasingName = 'linear' | 'ease' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'swing'

export type Status = 'success' | 'error' | 'warning' | 'info'

export type ColorPresets = 'primary' | 'secondary' | Status

export type TextColorPresets = 'primary' | 'secondary' | 'disabled' | 'placeholder' | 'inverse'

export type ColorPropsValue = ColorPresets | 'text' | 'text.primary' | 'text.secondary' | 'text.disabled' | 'text.placeholder' | 'text.inverse' | string

export type Size = 'small' | 'medium' | 'large'

export type CornerPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'

export type BlockPlacement = CornerPlacement | 'top' | 'bottom'

export type Placement = BlockPlacement | 'left' | 'right'

export type DefineElement<T = Element | null | undefined> = T | (() => T)

/**
 * ----------------------------------------------------------------------------------
 * Responsive
 */

export type Breakpoints =
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | string

export type ResponsiveValue<T = number> = {
    [P in Breakpoints]: T
}

export type ResponsiveProp<T = number> = T | ResponsiveValue<T>

/**
 * ----------------------------------------------------------------------------------
 * Override props
 */

export type DivProps = ComponentProps<'div'>

export type MergeProps<P, OverrideProps> = P & Omit<OverrideProps, keyof P>

export type OverridableProps<P, C extends ElementType> = { component?: C } & MergeProps<P, ComponentPropsWithRef<C>>

export type OverridableComponent<P, DefaultElement extends ElementType = 'div'> = <C extends ElementType = DefaultElement>(props: OverridableProps<P, C>) => ReactElement

export type SlotsAndProps<Default extends Record<string, any>> = {
    slots?: {
        [P in keyof Default]?: ElementType
    }
    slotProps?: {
        [P in keyof Default]?: Default[P] | Obj
    }
}

/**
 * ----------------------------------------------------------------------------------
 * Common select props
 */

export type SelectableSingleProps<T> = {
    multiple?: false
    defaultValue?: T
    value?: T
    onChange?(value: T): void
}

export type SelectableMultipleProps<T> = {
    multiple: true
    defaultValue?: T[]
    value?: T[]
    onChange?(value: T[]): void
}

export type SelectableProps<T> = {
    multiple?: boolean
    defaultValue?: T | T[]
    value?: T | T[]
    onChange?(value: T | T[]): void
}