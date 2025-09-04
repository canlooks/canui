# Progress 进度条

## 示例

```tsx
import {Progress} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Flex width="100%" direction="column" gap={24}>
            <Progress value={23.45}/>
            <Flex>
                <Flex flex={1} justifyContent="center">
                    <Progress variant="circular" value={23.45}/>
                </Flex>
                <Flex flex={1} justifyContent="center">
                    <Progress variant="gauge" value={23.45}/>
                </Flex>
                <Flex flex={1} justifyContent="center">
                    <Progress variant="circular" indeterminate/>
                </Flex>
            </Flex>
            <Progress indeterminate/>
        </Flex>
    )
}
```

## Props

| 属性            | 类型                                                              | 默认值       | 说明                              |
|---------------|-----------------------------------------------------------------|-----------|---------------------------------|
| showInfo      | boolean                                                         | true      | 是否显示文字                          |
| renderInfo    | (value: number) => ReactNode                                    | -         |                                 |
| color         | string                                                          | 'primary' |                                 |
| status        | 'default' \| 'processing'    \| 'success' \| 'error'            | 'default' |                                 |
| variant       | 'linear' \| 'circular'                               \| 'gauge' | 'linear'  |                                 |
| gapDegree     | number                                                          | 90        | `variant`为`gauge`时有效，下方缺口的角度    |
| size          | number                                                          | 60        | `variant`为`circular`时有效，表示圆圈的大小 |
| barWidth      | number                                                          | 4         | 表示进度条粗细,或圆环的宽度                  |
| indeterminate | boolean                                                         | false     | 若为`true`，则会一直播放动画               |
| strokeLinecap | SVGAttributes<SVGCircleElement>['strokeLinecap']                | -         | 传递至`<circle/>`元素的属性             |
| value         | number                                                          | 0         | 百分比，0 - 100                     |