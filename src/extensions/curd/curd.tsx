import {ComponentClass, ComponentType, ReactNode} from 'react'
import {Curd, CurdBaseProps, CurdColumn} from '../../components/curd'
import {DataGrid, DataGridProps, RowType} from '../../components/dataGrid'
import {FormValue} from '../../components/form'
import {Id} from '../../types'

/**
 * @example
 * ```ts
 * @CURD()
 * class ExampleComponent extends React.Component {
 *     @CURD.Column({title: '姓名'})
 *     username!: string
 *
 *     @CURD.Column({title: '性别'})
 *     gender(row: RowType) {
 *         return row.gender === 'male' ? '男' : '女'
 *     }
 *
 *     @CURD.OnCreate()
 *     onCreate(formValue: FormValue) {
 *
 *     }
 * }
 * ```
 */

/**
 * -------------------------------------------------------------------
 * 类修饰器
 */

export function CURD<R extends RowType, F extends FormValue = FormValue>(props?: CurdBaseProps<R, F>): <T extends ComponentClass>(target: T) => T {
    return commonClassDecorator(Curd, props)
}

export function DATA_GRID<R extends RowType, V extends Id = Id>(props?: DataGridProps<R, V>): <T extends ComponentClass>(target: T) => T {
    return commonClassDecorator(DataGrid, props)
}

function commonClassDecorator(Component: ComponentType, props: any): <T extends ComponentClass>(target: T) => T {
    return (target: any): any => {
        return class extends target {
            private _columns: CurdColumn<any>[] = []
            private readonly _methods?: CurdBaseProps<any, any>

            constructor(props: any) {
                super(props)
                const property_columnConfig = prototype_property_columnConfig.get(target.prototype)
                if (property_columnConfig) {
                    for (const [, columnConfig] of property_columnConfig) {
                        this._columns.push(columnConfig)
                    }
                }
                this._methods = prototype_methods.get(target.prototype)
                if (this._methods) {
                    for (const key in this._methods) {
                        this._methods[key as keyof CurdBaseProps<any, any>] = this._methods[key as keyof CurdBaseProps<any, any>].bind(this)
                    }
                }
            }

            render() {
                return (
                    <Component
                        columns={this._columns}
                        {...props}
                        {...this._methods}
                        {...this.props}
                    />
                )
            }
        }
    }
}

/**
 * -------------------------------------------------------------------
 * 属性修饰器 - columns
 */

const prototype_property_columnConfig = new WeakMap<Object, Map<string, CurdColumn<any>>>()

type ColumnDecorator = (prototype: Object, property: string, descriptor?: TypedPropertyDescriptor<any>) => void

CURD.Column = DATA_GRID.Column = Column

export function Column(title: ReactNode): ColumnDecorator
export function Column(params?: CurdColumn): ColumnDecorator
export function Column(a?: any) {
    return (prototype: Object, property: string, descriptor?: TypedPropertyDescriptor<any>) => {
        const params = a && typeof a === 'object' ? a : {title: a}
        const columnConfig = Object.assign(setColumnConfig(prototype, property), params)
        if (typeof descriptor?.value === 'function') {
            columnConfig.render = descriptor.value
        }
    }
}

/**
 * 对应CurdColumn['hideInTable']属性
 */
Column.Hide = Hide

export function Hide(): ColumnDecorator
export function Hide(prototype: Object, property: string, descriptor?: TypedPropertyDescriptor<any>): void
export function Hide(a?: any, b?: string) {
    return typeof b === 'undefined'
        ? setColumnConfigValue('hideInTable')
        : setColumnConfigValue('hideInTable')(a, b)
}

Column.Sort = Sort

export function Sort<R extends RowType>(compareFn?: (a: R, b: R) => number): ColumnDecorator
export function Sort(prototype: Object, property: string, descriptor?: TypedPropertyDescriptor<any>): void
export function Sort(a?: any, b?: string) {
    return typeof b === 'undefined'
        ? setColumnConfigValue('sorter', a)
        : setColumnConfigValue('sorter')(a, b)
}

Column.Filter = Filter

export function Filter(config?: CurdColumn['filter']): ColumnDecorator
export function Filter(prototype: Object, property: string, descriptor?: TypedPropertyDescriptor<any>): void
export function Filter(a?: any, b?: string) {
    return typeof b === 'undefined'
        ? setColumnConfigValue('filter', a)
        : setColumnConfigValue('filter')(a, b)
}

Column.Form = Form

export function Form(config?: CurdColumn['form']): ColumnDecorator
export function Form(prototype: Object, property: string, descriptor?: TypedPropertyDescriptor<any>): void
export function Form(a?: any, b?: string) {
    return typeof b === 'undefined'
        ? setColumnConfigValue('form', a)
        : setColumnConfigValue('form')(a, b)
}

/**
 * 通用设置prototype_property_columnConfig的方法
 * @param prototype 
 * @param property 
 */
function setColumnConfig(prototype: Object, property: string) {
    let property_columnConfig = prototype_property_columnConfig.get(prototype)
    !property_columnConfig && prototype_property_columnConfig.set(prototype, property_columnConfig = new Map<string, CurdColumn<any>>())

    let columnConfig = property_columnConfig.get(property)
    !columnConfig && property_columnConfig.set(property, columnConfig = {field: property})

    return columnConfig
}

/**
 * 设置单个columnConfig的值
 * @param key 
 * @param value 
 */
function setColumnConfigValue<K extends keyof CurdColumn>(key: K, value: CurdColumn[K] = true): ColumnDecorator {
    return (prototype: Object, property: string) => {
        const columnConfig = setColumnConfig(prototype, property)
        columnConfig[key] = value
    }
}

/**
 * -------------------------------------------------------------------
 * 方法修饰器
 */

type MethodDecorator = (prototype: Object, property: string, descriptor: TypedPropertyDescriptor<any>) => void

const prototype_methods = new WeakMap<Object, CurdBaseProps<any, any>>()

CURD.LoadRows = DATA_GRID.LoadRows = LoadRows

export function LoadRows(): MethodDecorator
export function LoadRows(prototype: Object, property: string, descriptor: TypedPropertyDescriptor<any>): void
export function LoadRows(a?: any, b?: any, c?: any) {
    return typeof c === 'undefined'
        ? setMethods('loadRows')
        : setMethods('loadRows')(a, b, c)
}

CURD.OnReload = DATA_GRID.OnReload = OnReload

export function OnReload(): MethodDecorator
export function OnReload(prototype: Object, property: string, descriptor: TypedPropertyDescriptor<any>): void
export function OnReload(a?: any, b?: any, c?: any) {
    return typeof c === 'undefined'
        ? setMethods('onReload')
        : setMethods('onReload')(a, b, c)
}

CURD.OnFilter = DATA_GRID.OnFilter = OnFilter

export function OnFilter(): MethodDecorator
export function OnFilter(prototype: Object, property: string, descriptor: TypedPropertyDescriptor<any>): void
export function OnFilter(a?: any, b?: any, c?: any) {
    return typeof c === 'undefined'
        ? setMethods('onFilter')
        : setMethods('onFilter')(a, b, c)
}

CURD.OnCreate = DATA_GRID.OnCreate = OnCreate

export function OnCreate(): MethodDecorator
export function OnCreate(prototype: Object, property: string, descriptor: TypedPropertyDescriptor<any>): void
export function OnCreate(a?: any, b?: any, c?: any) {
    return typeof c === 'undefined'
        ? setMethods('onCreate')
        : setMethods('onCreate')(a, b, c)
}

CURD.OnUpdate = DATA_GRID.OnUpdate = OnUpdate

export function OnUpdate(): MethodDecorator
export function OnUpdate(prototype: Object, property: string, descriptor: TypedPropertyDescriptor<any>): void
export function OnUpdate(a?: any, b?: any, c?: any) {
    return typeof c === 'undefined'
        ? setMethods('onUpdate')
        : setMethods('onUpdate')(a, b, c)
}

CURD.OnDelete = DATA_GRID.OnDelete = OnDelete

export function OnDelete(): MethodDecorator
export function OnDelete(prototype: Object, property: string, descriptor: TypedPropertyDescriptor<any>): void
export function OnDelete(a?: any, b?: any, c?: any) {
    return typeof c === 'undefined'
        ? setMethods('onDelete')
        : setMethods('onDelete')(a, b, c)
}

CURD.RowToForm = DATA_GRID.RowToForm = RowToForm

export function RowToForm(): MethodDecorator
export function RowToForm(prototype: Object, property: string, descriptor: TypedPropertyDescriptor<any>): void
export function RowToForm(a?: any, b?: any, c?: any) {
    return typeof c === 'undefined'
        ? setMethods('rowToForm')
        : setMethods('rowToForm')(a, b, c)
}

/**
 * 通用设置prototype_methods的方法
 * @param key 
 */
function setMethods(key: keyof CurdBaseProps<any, any>) {
    return (prototype: Object, property: string, descriptor: TypedPropertyDescriptor<any>) => {
        let methods = prototype_methods.get(prototype)
        !methods && prototype_methods.set(prototype, methods = {})

        methods[key] = descriptor.value
    }
}