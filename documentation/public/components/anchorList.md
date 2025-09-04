# AnchorList 锚点列表

## 示例

```tsx
import {AnchorList} from '@canlooks/can-ui'

export default function Index() {
    return (
        <AnchorList
            style={{width: '100%'}}
            anchors={[
                {id: 'anchor1', label: '锚点1'},
                {id: 'anchor2', label: '锚点2', active: true},
                {id: 'anchor2-1', label: '锚点2-1', level: 1},
                {id: 'anchor2-2', label: '锚点2-2', level: 1},
                {id: 'anchor3', label: '锚点3'},
            ]}
        />
    )
}
```

**锚点中的`active`状态通常无需手动设置，若滚动元素中有对应id的元素，会根据滚动位置自动计算。**

## Props

| 属性               | 类型                                                                                     | 默认值       | 说明           |
|------------------|----------------------------------------------------------------------------------------|-----------|--------------|
| anchors          | {<br/>id: string,<br/> label: string,<br/> level: number,<br/> active: boolean<br/>}[] | -         | 锚点列表         |
| renderAnchorItem | (item: AnchorItem, active: boolean) => void                                            | -         | 渲染锚点的方法      |
| indent           | number                                                                                 | 24        | 缩进           |
| scroller         | Element                                                                                | document  | 滚动元素         |
| routeMode        | 'history' \| 'location'                                                                | 'history' | 路由跳转模式       |
| offset           | number                                                                                 | 0         | 目标元素距离顶部的偏移量 |
| scrollBehavior   | 'auto' \| 'instant'                          \| 'smooth'                               | 'auto'    |              |
