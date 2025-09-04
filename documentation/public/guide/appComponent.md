# 入口组件

## <App\/>

通常使用`<App/>`组件作为入口组件，该组件定义了[全局方法](globalMethods)与顶层样式，也便于[自定义主题](theme)

如果你使用`npx create-canlooks`脚手架程序创建项目，你会得到类似这样的代码：

```tsx no-preview
import {App} from '@canlooks/can-ui'

export default function Root() {
    return (
        <App>
            {/*your top component here*/}
        </App>
    )
}
```

## Props

`<App/>`组件继承了`<div/>`元素的所有属性，此外还有以下属性：

| 属性        | 类型                           | 默认值   | 说明                                           |
|-----------|------------------------------|-------|----------------------------------------------|
| theme     | [ThemeDefinition](theme)     | -     | 传递给[<ThemeProvider\/>](theme)组件的属性           |
| fill      | boolean                      | true  | <App\/>组件是否填满父元素，component为`null`或`false`时无效 |
| children  | ReactNode                    | -     | 子组件                                          |
| component | ElementType \| null \| false | 'div' | 使用特定的组件渲染，若指定为`null`或`false`则不会渲染组件          |
