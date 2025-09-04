# Checkbox 选择框

## 示例

```tsx
import {Checkbox} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Checkbox label="选择"/>
    )
}
```

### CheckboxGroup

```tsx
import {CheckboxGroup} from '@canlooks/can-ui'

export default function Index() {
    return (
        <CheckboxGroup
            items={[
                {
                    label: '选项1',
                    value: 1
                },
                {
                    label: '选项2',
                    value: 2
                }
            ]}
        />
    )
}
```