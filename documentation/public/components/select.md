# Select 选择器

## 示例

```tsx
import {Select} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Select
            style={{width: 200}}
            options={[
                {
                    label: '选项1',
                    value: 1
                },
                {
                    label: '选项2',
                    value: 2
                },
                {
                    label: '选项3',
                    value: 3
                }
            ]}
            defaultValue={1}
        />
    )
}
```
