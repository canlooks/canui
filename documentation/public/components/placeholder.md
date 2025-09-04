# Placeholder 占位符

## 示例

```tsx
import {Flex, Placeholder} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Flex wrap="wrap" gap={12}>
            <Placeholder/>
            <Placeholder status="searching"/>
            <Placeholder status="success"/>
            <Placeholder status="error"/>
            <Placeholder status="warning"/>
            <Placeholder status="info" description="这是描述信息"/>
        </Flex>
    )
}
```

## Props

| 属性          | 类型                                                                   | 默认值     | 说明 |
|-------------|----------------------------------------------------------------------|---------|----|
| status      | 'empty' \| 'searching' \|'success' \| 'error' \| 'warning' \| 'info' | 'empty' |    |
| image       | ReactNode                                                            |         |
| title       | ReactNode                                                            |         |
| description | ReactNode                                                            |         |
| extra       | ReactNode                                                            |         |