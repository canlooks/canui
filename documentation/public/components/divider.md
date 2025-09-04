# Divider 分隔线

## 示例

```tsx
import {Divider, Flex} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Flex width="100%" gap={12}>
            <Divider style={{flex: 1}}>分割线</Divider>
            <Divider orientation="vertical"/>
            <Divider style={{flex: 1}}>分割线</Divider>
        </Flex>
    )
}
```

## Props

| 属性          | 类型                           | 默认值          | 说明                                      |
|-------------|------------------------------|--------------|-----------------------------------------|
| textAlign   | 'start' \| 'center' \| 'end' | 'center'     | 文字所在位置                                  |
| alignMargin | number \| string             | 36           | `textAlign`为`start`或`end`时有效，表示文字至边缘的距离 |
| orientation | 'horizontal' \| 'vertical'   | 'horizontal' | 分隔线方向                                   |
| margin      | number \| string             | 0            |                                         |
