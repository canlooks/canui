# Button 按钮

## 示例

```tsx
import {Button, Flex} from '@canlooks/can-ui'

export default function Index() {
    const rowProps = {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    }

    return (
        <Flex width="100%" direction="column" gap={12}>
            <Flex {...rowProps}>
                <Button>按钮</Button>
                <Button variant="flatted">按钮</Button>
                <Button variant="outlined">按钮</Button>
                <Button variant="dashed">按钮</Button>
                <Button variant="ghost">按钮</Button>
                <Button variant="text">按钮</Button>
                <Button variant="plain">按钮</Button>
            </Flex>
            <Flex {...rowProps}>
                <Button color="success">按钮</Button>
                <Button color="warning">按钮</Button>
                <Button color="error">按钮</Button>
                <Button color="info">按钮</Button>
                <Button loading>按钮</Button>
            </Flex>
            <Flex {...rowProps}>
                <Button size="small">按钮</Button>
                <Button size="large">按钮</Button>
            </Flex>
            <Flex {...rowProps}>
                <Button shape="circular">钮</Button>
                <Button shape="rounded">按钮</Button>
            </Flex>
        </Flex>
    )
}
```

## Props

`<Button/>`组件继承了`<button/>`元素的所有属性，除此之外还有以下属性：

| 属性          | 类型                                                                                                        | 默认值          | 说明            |
|-------------|-----------------------------------------------------------------------------------------------------------|--------------|---------------|
| color       | string                                                                                                    | -            |               |
| shape       | 'square' \| 'circular' \| 'rounded'                                                                       | 'square'     | 形状            |
| size        | 'small' \| 'medium' \| 'large'                                                                            | 'medium'     | 尺寸            |
| variant     | 'flatted'                           \| 'filled' \| 'outlined' \| 'dashed' \| 'ghost' \| 'text' \| 'plain' | 'filled'     | 样式            |
| orientation | 'horizontal' \| 'vertical'                                                                                | 'horizontal' | 前后缀的排列方向      |
| prefix      | ReactNode                                                                                                 | -            |               |
| suffix      | ReactNode                                                                                                 | -            |               |
| loading     | boolean                                                                                                   | false        |               |
| readOnly    | boolean                                                                                                   | false        |               |
| icon        | ReactNode                                                                                                 | -            | prefix属性的别名   |
| label       | ReactNode                                                                                                 | -            | children属性的别名 |
