# Image 图片

## 普通示例

```tsx
import {Image} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Image src="/logo.png" style={{width: 100, height: 100}}/>
    )
}
```

## 相册预览示例

```tsx
import {Flex, Gallery, Image} from '@canlooks/can-ui'

export default function Index() {
    const src1 = 'https://picsum.photos/seed/seed1/100'
    const src2 = 'https://picsum.photos/seed/seed2/100'
    const src3 = 'https://files.codelife.cc/wallhaven/full/gj/wallhaven-gj8v93.png'

    const [open, setOpen] = React.useState(false)
    const [index, setIndex] = React.useState(0)

    const previewHandler = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        e.preventDefault()
        setOpen(true)
        setIndex(index)
    }

    return (
        <>
            <Flex gap={12}>
                <Image src={src1} style={{width: 100, height: 100}} onPreview={e => previewHandler(e, 0)}/>
                <Image src={src2} style={{width: 100, height: 100}} onPreview={e => previewHandler(e, 1)}/>
                <Image src={src3} style={{width: 100, height: 100}} onPreview={e => previewHandler(e, 2)}/>
            </Flex>

            <Gallery
                open={open}
                onOpenChange={setOpen}
                index={index}
                onIndexChange={setIndex}
                src={[src1, src2, src3]}
            />
        </>
    )
}
```

## ImageProps

| 属性             | 类型                                      | 默认值  | 说明                                             |
|----------------|-----------------------------------------|------|------------------------------------------------|
| src            | string                                  | -    |                                                |
| fallback       | string                                  | -    | 加载失败时会自动加载fallback                             |
| renderLoading  | ReactNode                               | -    | 自定义渲染loading展位符，若指定为`false`或`null`会禁用loading功能 |
| objectFit      | CSSProperties['objectFit']              | -    |                                                |
| objectPosition | CSSProperties['objectPosition']         | -    |                                                |
| actions        | ReactNode                               | -    | 自定义渲染操作，默认为`预览`按钮                              |
| previewable    | boolean                                 | true | 是否可预览                                          |
| previewProps   | [ImagePreviewProps](#ImagePreviewProps) | -    | 传递至`<ImagePreview/>`组件的属性                      |
| onPreview      | (event) => void                         | -    | 点击预览按钮                                         |
| onLoad         | ImgHTMLAttributes['onLoad']             | -    | 传递至`<img/>`元素                                  |
| onError        | ImgHTMLAttributes['onError']            | -    | 传递至`<img/>`元素                                  |
| alt            | ImgHTMLAttributes['alt']                | -    | 传递至`<img/>`元素                                  |
| width          | ImgHTMLAttributes['width']              | -    | 传递至`<img/>`元素                                  |
| height         | ImgHTMLAttributes['height']             | -    | 传递至`<img/>`元素                                  |
| imgProps       | ImgHTMLAttributes                       | -    | 传递至`<img/>`元素                                  |

## ImagePreviewProps

`<ImagePreview/>`组件继承了`<Modal/>`组件的所有属性，此外还有如下属性：

| 属性                    | 类型                                                                                   | 默认值  | 说明                 |
|-----------------------|--------------------------------------------------------------------------------------|------|--------------------|
| src                   | string[]                                                                             | -    |                    |
| defaultIndex          | number                                                                               | 0    | 默认预览的图片下标（对应`src`） |
| index                 | number                                                                               | -    | 受控的预览下标            |
| onIndexChange         | (index) => void                                                                      | -    |                    |
| defaultOpen           | boolean                                                                              | -    |                    |
| onOpenChange          | (open) => void                                                                       | -    |                    |
| showRotate            | boolean                                                                              | true | 是否渲染旋转按钮           |
| showZoom              | boolean                                                                              | true | 是否渲染放大缩小按钮         |
| showClose             | boolean                                                                              | true | 是否渲染关闭按钮           |
| renderControl         | ReactNode                                                                            | -    | 自定义渲染控制按钮          |
| transformWrapperProps | [ReactZoomPanPinchProps](https://github.com/BetterTyped/react-zoom-pan-pinch#readme) | -    |                    |
