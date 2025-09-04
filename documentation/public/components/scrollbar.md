# Scrollbar 滚动条

## 示例

```tsx
import {Scrollbar} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Scrollbar style={{height: 200}}>
            <p>这里有很长很长的内容</p>
            <p>这里有很长很长的内容</p>
            <p>这里有很长很长的内容</p>
            <p>这里有很长很长的内容</p>
            <p>这里有很长很长的内容</p>
            <p>这里有很长很长的内容</p>
            <p>这里有很长很长的内容</p>
            <p>这里有很长很长的内容</p>
            <p>这里有很长很长的内容</p>
        </Scrollbar>
    )
}
```

## Props

| 属性       | 类型                   | 默认值       | 说明                                           |
|----------|----------------------|-----------|----------------------------------------------|
| variant  | 'contain' \| 'cover' | 'contain' | `contain`: 滚动条会挤压内容区域<br/>`cover` 滚动条会覆盖在内容上 |
| autoHide | boolean              | true      | 是否自动隐藏滚动条                                    |
| size     | string \| number     | '0.8em'   | 是否自动隐藏滚动条                                    |