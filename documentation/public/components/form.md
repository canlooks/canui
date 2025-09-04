# Form 表单

## 基础示例

```tsx
import {Form, Input, RadioGroup} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Form labelWidth="20%" style={{width: '300px'}}>
            <Form.Item field="name" label="姓名">
                <Input placeholder="请输入姓名"/>
            </Form.Item>
            <Form.Item field="gender" label="性别">
                <RadioGroup
                    items={[
                        {label: '男', value: 'male'},
                        {label: '女', value: 'female'}
                    ]}
                />
            </Form.Item>
            <Form.Item
                field="phone"
                label="电话"
                rules={{
                    required: true,
                    pattern: /^1\d{10}$/,
                    message: '电话输入不正确'
                }}
            >
                <Input placeholder="请输入电话"/>
            </Form.Item>
        </Form>
    )
}
```

## 关联字段

```tsx
import {Form, Input, RadioGroup} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Form labelWidth="30%" style={{width: '300px'}}>
            <Form.Item
                field="needPassword"
                label="需要密码"
                initialValue={0}
            >
                <RadioGroup
                    items={[
                        {label: '是', value: 1},
                        {label: '否', value: 0}
                    ]}
                />
            </Form.Item>
            <Form.Relatable shouldUpdate={(prev, next) => prev.needPassword !== next.needPassword}>
                {({needPassword}) => !!needPassword && (
                    <>
                        <Form.Item field="password" label="密码">
                            <Input type="password" placeholder="请输入密码"/>
                        </Form.Item>
                        <Form.Item
                            field="confirmPassword"
                            label="确认密码"
                            dependencies={['password']}
                            rules={{
                                validator: (confirmPassword: string, {password}: any) => {
                                    if (confirmPassword !== password) {
                                        throw '两次密码输入不一致'
                                    }
                                }
                            }}
                        >
                            <Input type="password" placeholder="请再次输入密码"/>
                        </Form.Item>
                    </>
                )}
            </Form.Relatable>
        </Form>
    )
}
```

## FormProps

`FormProps`继承了[DescriptionsProps](/components/descriptions)的所有属性，此外还有如下属性：

| 属性           | 类型                                           | 默认值    | 说明                                                                              |
|--------------|----------------------------------------------|--------|---------------------------------------------------------------------------------|
| wrapperRef   | Ref<HTMLDivElement>                          | -      | 最外层元素的ref，默认ref属性已经被[FormRef](#FormRef)取代                                       |
| requiredMark | ReactNode                                    | '*'    | 必填字段的标记                                                                         |
| component    | ElementType                                  | 'form' | 自定义渲染组件                                                                         |
| initialValue | Object                                       | -      | 初始值                                                                             |
| onChange     | (field, value, formValue) => void            | -      | 值变化回调                                                                           |
| onFinish     | (formValue) => void                          | -      | 提交完成后回调                                                                         |
| items        | [FormItemProps](#FormItemProps)[]            | -      |                                                                                 |
| variant      | 'plain' \| 'grid'                 \| 'table' | 'grid' | 指定为`grid`或`table`时会渲染`<Descriptions/>`组件；<br/>指定为`plain`时不渲染外层组件，直接渲染`children` |
| columnCount  | ResponsiveProps                              | 3      |                                                                                 |

## FormItemProps

| 属性           | 类型                                                                                                                                   | 默认值   | 说明                                             |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------|-------|------------------------------------------------|
| field        | Id \| Id[]                                                                                                                           | -     | 字段键名                                           |
| initialValue | any                                                                                                                                  | -     |                                                |
| rules        | {<br/>message?: ReactNode,<br/>required?: boolean,<br/>pattern?: RegExp,<br/>validator?(fieldValue, formValue, formRef): any<br/>}[] | -     |                                                |
| required     | boolean                                                                                                                              | false | 是否显示必填标记                                       |
| error        | boolean                                                                                                                              | false | 该字段是否存在错误                                      |
| helperText   | ReactNode                                                                                                                            | -     | 提示文字                                           |
| dependencies | Id[] \| Id[][]                                                                                                                       | -     | 依赖其他字段，若依赖的字段发生变化，该字段也会重新执行`validate`操作        |
| children     | ReactNode \| (fieldProps, styleProps) => ReactNode                                                                                   | -     |                                                |
| noStyle      | boolean                                                                                                                              | -     | 是否禁用默认样式，若指定为`true`则不会渲染`<DescriptionItem/>`组件 |

## FormRef

| 方法             | 类型                              | 说明                                       |
|----------------|---------------------------------|------------------------------------------|
| submit         | (): Promise<FormValue \| null>  |                                          |
| getFieldValue  | (field: Id \| Id[]): FieldValue |                                          |
| getFormValue   | (): FormValue                   |                                          |
| getFieldError  | (field): FieldError             | 获取单个字段的错误                                |
| getFormErrors  | (): { \[field]: FieldError }    | 获取所有字段的错误                                |
| setFormValue   | (formValue: FormValue): void    | 全量覆盖表单值                                  |
| mergeFormValue | (formValue: FormValue): void    | 合并表单值                                    |
| setFieldValue  | (field, value): void            |                                          |
| resetForm      | (): void                        | 重置整个表单<br/>注意：执行改方法前请确保指定了`initialValue` |
| resetField     | (field): void                   | 重置某个字段<br/>注意：执行改方法前请确保指定了`initialValue` |
| isFormTouched  | (): boolean                     | 判断该表单是否被改动过                              |
| isFieldTouched | (field): boolean                | 判断某个字段是否被改动过                             |
