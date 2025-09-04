# FormDialog 表单对话框

## 示例

```tsx
import {Button, FormDialog, Input} from '@canlooks/can-ui'

export default function Index() {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>打开表单对话框</Button>
            <FormDialog
                open={open}
                onClose={() => setOpen(false)}
                title="对话框标题"
                items={[
                    {field: 'name', label: '姓名', children: <Input autoFocus/>},
                ]}
            />
        </>
    )
}
```

## Props

`<FormDialog/>`组件继承了`<Dialog/>`组件的所有属性，此外还有如下属性：

| 属性        | 类型                                                | 默认值 | 说明                |
|-----------|---------------------------------------------------|-----|-------------------|
| formProps | [FormProps](/components/form#FormProps)           | -   | 传递给`<Form/>`组件的属性 |
| formRef   | [FormRef](/components/form#FormRef)               | -   |                   |
| items     | [FormItemProps](/components/form#FormItemProps)[] | -   |                   |
| onFinish  | (formValue) => void                               | -   |                   |
