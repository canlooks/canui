# Loading 加载中

## LoadingIndicator

```tsx
import {LoadingIndicator} from '@canlooks/can-ui'

export default function () {
    return <LoadingIndicator/>
}
```

### LoadingIndicatorProps

| 属性    | 类型     | 默认值       | 说明 |
|-------|--------|-----------|----|
| size  | number | -         | 尺寸 |
| width | number | -         | 粗细 |
| color | string | 'primary' |    |

## Loading

```tsx
import {Loading} from '@canlooks/can-ui'

export default function () {
    return (
        <Loading
            open
            progress={46}
        >
            <div style={{height: 150}}/>
        </Loading>
    )
}
```

### LoadingProps

| 属性             | 类型                                              | 默认值       | 说明                    |
|----------------|-------------------------------------------------|-----------|-----------------------|
| text           | ReactNode                                       | '加载中...'  |                       |
| progress       | number                                          | -         | 若指定该字段会显示进度条          |
| color          | string                                          | 'primary' |                       |
| indicatorProps | [LoadingIndicatorProps](#LoadingIndicatorProps) | -         |                       |
| progressProps  | [ProgressProps](/components/progress)           | -         | 传递至`<Progress/>`组件的属性 |
