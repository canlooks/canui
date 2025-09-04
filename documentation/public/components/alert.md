# Alert 提示框

## 示例

```tsx
import {Alert, Flex} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Flex width="100%" direction="column" gap={12}>
            <Alert status="info" title="这是一条信息提示" description="这里是消息的内容"/>
            <Alert status="success" title="这是一条信息提示" description="这里是消息的内容"/>
            <Alert status="warning" title="这是一条信息提示" description="这里是消息的内容" closable/>
            <Alert status="error" title="这是一条信息提示" description="这里是消息的内容"/>
            <Alert variant="filled" title="这是一条信息提示" description="这里是消息的内容"/>
            <Alert variant="outlined" title="这是一条信息提示" description="这里是消息的内容"/>
            <Alert loading title="这是一条信息提示" description="这里是消息的内容"/>
        </Flex>
    )
}
```

## Props

| 属性          | 类型                                                          | 默认值        | 说明       |
|-------------|-------------------------------------------------------------|------------|----------|
| variant     | 'filled' \| 'outlined' \| 'standard'                        | 'standard' | 样式       |
| status      | 'success' \| 'error'                 \| 'warning' \| 'info' | 'error'    | 状态       |
| color       | string                                                      | -          | 颜色       |
| showIcon    | boolean                                                     | true       | 是否显示图标   |
| icon        | ReactNode                                                   | -          | 图标       |
| title       | ReactNode                                                   | -          | 标题       |
| description | ReactNode                                                   | -          | 说明       |
| prefix      | ReactNode                                                   | -          | 前缀内容     |
| suffix      | ReactNode                                                   | -          | 后缀内容     |
| closable    | boolean                                                     | false      | 是否渲染关闭按钮 |
| onClose     | (e) => void                                                 | -          | 关闭回调     |
| loading     | boolean                                                     | false      | 加载状态     |
