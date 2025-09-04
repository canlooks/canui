# SlidableActions 滑动操作

## 示例

```tsx
import {SlidableActions} from '@canlooks/can-ui'

export default function Index() {
    return (
        <SlidableActions
            style={{width: 400}}
            leftActions={[
                {
                    label: '操作1',
                    color: 'warning'
                },
                {
                    label: '操作2',
                    color: 'info'
                }
            ]}
            rightActions={{
                label: '删除',
                color: 'error'
            }}
        >
            <MenuItem label="左右滑动显示更多操作"/>
        </SlidableActions>
    )
}
```

## Props

| 属性                     | 类型                                        | 默认值        | 说明              |
|------------------------|-------------------------------------------|------------|-----------------|
| leftActions            | [ActionType](#ActionType) \| ActionType[] | -          |                 |
| rightActions           | ActionType \| ActionType[]                | -          |                 |
| autoReturn             | boolean                                   | true       | 点击action后是否自动归位 |
| bounceElementTranslate | number                                    | 12         | 元素弹性移动距离        |
| bounceDragDistance     | number                                    | 240        | 手指弹性拖拽距离        |
| effectiveSpeed         | number                                    | 450 (px/s) | 滑动生效的速度         |
| disabled               | boolean                                   | false      |                 |

## ActionType

| 属性          | 类型                                      | 默认值       | 说明                  |
|-------------|-----------------------------------------|-----------|---------------------|
| color       | string                                  | 'default' |                     |
| label       | ReactNode                               | -         |                     |
| icon        | ReactNode                               | -         |                     |
| autoReturn  | boolean                                 | true      | 点击当前action后是否自动归位   |
| buttonProps | [ButtonProps](/components/button#Props) | -         | 传递至`<Button/>`组件的属性 |
