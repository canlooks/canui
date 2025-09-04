# Radio 单选框

## 示例

```tsx
import {Radio} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Radio label="选择"/>
    )
}
```

## RadioGroup

```tsx
import {RadioGroup} from '@canlooks/can-ui'

export default function Index() {
    return (
        <RadioGroup
            defaultValue={1}
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