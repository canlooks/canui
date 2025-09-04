# Breadcrumb 面包屑

## 示例

```tsx
import {Breadcrumb, Icon} from '@canlooks/can-ui'
import {faUser} from '@fortawesome/free-solid-svg-icons'

export default function Index() {
    return (
        <Breadcrumb
            items={[
                {label: 'Home'},
                {label: 'Components'},
                {label: 'Me', icon: <Icon icon={faUser}/>}
            ]}
        />
    )
}
```

## Props

| 属性        | 类型                                  | 默认值   | 说明  |
|-----------|-------------------------------------|-------|-----|
| items     | [ButtonProps](/components/button#Props)[] | -     |     |
| separator | ReactNode                           | '/'   | 分隔符 |
| readOnly  | boolean                             | false |     |