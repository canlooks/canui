# 开始
## 安装

```bash
npm i @canlooks/can-ui
```
或使用脚手架程序
```bash
npx create-canlooks
```

## 使用
你可以不进行任何配置就像使用其他`React`组件一样使用`CanUI`组件。

```tsx
import {Alert} from '@canlooks/can-ui'

export default function Hello() {
    return (
        <Alert title="Hello Canlooks" status="success"/>
    )
}
```