# Input 输入框

## 示例

```tsx
import {Input} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Flex width={300} gap={15} direction="column">
            <Input
                prefix={<Icon icon={faUser}/>}
                suffix="后缀"
                placeholder="请输入内容"
            />
            <Input variant="underlined" placeholder="请输入内容"/>
            <Input variant="plain" placeholder="请输入内容"/>
            <Input shape="rounded" placeholder="请输入内容"/>
        </Flex>
    )
}
```

## Props

`<Input/>`组件继承了`<input/>`元素的全部属性，此外还有如下属性：

| 属性             | 类型                                               | 默认值        | 说明                 |
|----------------|--------------------------------------------------|------------|--------------------|
| inputProps     | InputHTMLAttributes                              | -          | 传递至`<input/>`元素的属性 |
| widthAdaptable | boolean                                          | false      | 是否根据内容自动调整宽度       |
| variant        | 'outlined' \| 'underlined' \| 'plain'            | 'outlined' |                    |
| size           | 'small' \| 'medium'                   \| 'large' |            |                    |
| color          | string                                           | -          |                    |
| prefix         | ReactNode                                        | -          | 前缀                 |
| suffix         | ReactNode                                        | -          | 后缀                 |
| clearable      | boolean                                          | true       | 是否显示清空按钮           |
| onClear        | () => void                                       | -          |                    |
| loading        | boolean                                          | false      |                    |
