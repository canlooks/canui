# Segmented 段落选择器

## 示例

```tsx
import {Segmented} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Segmented
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

## SegmentedProps

| 属性             | 类型                                                                     | 默认值                | 说明                   |
|----------------|------------------------------------------------------------------------|--------------------|----------------------|
| options        | [SegmentedOptionProps](#SegmentedOptionProps)[]                        | -                  |                      |
| orientation    | 'horizontal'                                             \| 'vertical' | 'horizontal'       |                      |
| size           | 'small' \| 'medium'                           \| 'large'               | 'medium'           |                      |
| labelKey       | string                                                                 | 'label'            | `option`中用做`label`的键 |
| primaryKey     | string                                                                 | 'value'            | `option`中用做主键的键      |
| fullWidth      | boolean                                                                | false              | 是否占满整行               |
| indicatorColor | string                                                                 | background.content | 指示器的颜色               |
| defaultValue   |                                                                        | -                  |                      |
| value          |                                                                        | -                  |                      |
| onChange       | (value) => void                                                        | -                  |                      |
| readOnly       | boolean                                                                | false              |                      |
| disabled       | boolean                                                                | false              |                      |

## SegmentedOptionProps

| 属性          | 类型                                                                     | 默认值   | 说明          |
|-------------|------------------------------------------------------------------------|-------|-------------|
| orientation | 'horizontal'                                             \| 'vertical' | -     |             |
| prefix      | ReactNode                                                              | -     | 前缀，通常用于渲染图标 |
| suffix      | ReactNode                                                              | -     | 后缀          |
| value       | string \| number                                                       | -     |             |
| label       | ReactNode                                                              | -     |             |
| disabled    | boolean                                                                | false |             |