# Avatar 头像

## Avatar

```tsx
import {Avatar, Flex, Icon} from '@canlooks/can-ui'
import {faUser} from '@fortawesome/free-solid-svg-icons'

export default function Index() {
    const src = 'https://avatars.githubusercontent.com/u/47269261?v=4'

    return (
        <Flex
            width="100%"
            gap={12}
            alignItems="center"
            justifyContent="center"
        >
            <Avatar size="small" src=""/>
            <Avatar src={src}/>
            <Avatar size="large" src={src}/>
            <Avatar>
                <Icon icon={faUser}/>
            </Avatar>
            <Avatar shape="square">
                <Icon icon={faUser}/>
            </Avatar>
            <Avatar color="primary">
                <Icon icon={faUser}/>
            </Avatar>
        </Flex>
    )
}
```

### Avatar Props

| 属性       | 类型                     | 默认值        | 说明                     |
|----------|------------------------|------------|------------------------|
| color    | Color                  | -          | 颜色                     |
| size     | string \| number       | 'medium'   | 尺寸                     |
| shape    | 'circular' \| 'square' | 'circular' | 形状                     |
| src      | string                 | -          | 若不指定`src`则渲染`children` |
| children | ReactNode              | -          | 若不指定`children`则使用`src` |
| imgProps | ImgHTMLAttributes      | -          | 传递给`<img/>`标签的属性       |

## AvatarGroup

```tsx
import {AvatarGroup, Flex} from '@canlooks/can-ui'
import {faUser} from '@fortawesome/free-solid-svg-icons'

export default function Index() {
    const src = 'https://avatars.githubusercontent.com/u/47269261?v=4'

    return (
        <AvatarGroup
            items={[
                {src},
                {children: <Icon icon={faUser}/>},
                {src},
                {children: <Icon icon={faUser}/>},
                {src},
                {children: <Icon icon={faUser}/>}
            ]}
        />
    )
}
```

### AvatarGroup Props

| 属性            | 类型                     | 默认值  | 说明                         |
|---------------|------------------------|------|----------------------------|
| items         | AvatarProps[]          | -    |                            |
| hoverable     | boolean                | true | 是否可以hover交互                |
| max           | number                 | 5    | 最大显示数量                     |
| total         | number                 | -    | 总数，若不指定则取items或children的长度 |
| renderSurplus | (surplus) => ReactNode | -    | 超过最大限制时，渲染的额外内容            |