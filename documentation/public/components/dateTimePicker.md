# DateTimePicker 日期时间选择器

## 示例

```tsx
import {DateTimePicker} from '@canlooks/can-ui'

export default function Index() {
    return (
        <DateTimePicker format="YYYY-MM-DD hh:mm:ss"/>
    )
}
```

## Props

| 属性              | 类型                                        | 默认值   | 说明                    |
|-----------------|-------------------------------------------|-------|-----------------------|
| inputProps      | InputHTMLAttributes                       | -     | 传递给`<input/>`的属性      |
| inputRef        | Ref<HTMLInputElement>                     | -     |                       |
| popperProps     | [PopperProps](/components/popper)         | -     | 传递给`<Popper/>`组件的属性   |
| defaultOpen     | boolean                                   | false | 默认打开状态                |
| open            | boolean                                   | -     | 受控的打开状态               |
| onOpenChange    | (open) => void                            | -     | 打开状态变化的回调             |
| autoClose       | boolean                                   | true  | 是否自动关闭                |
| format          | string                                    | -     | 选择器的样式会根据`format`自动改变 |
| defaultValue    | [DayJs](https://day.js.org/) \| null      | null  | 默认值                   |
| value           | [DayJs](https://day.js.org/) \| null      | -     | 受控的值                  |
| onChange        | (dayJs) => void                           | -     | 变化回调                  |
| min             | Dayjs                                     | -     |                       |
| max             | Dayjs                                     | -     |                       |
| disabledDates   | (date: Dayjs) => boolean                  | -     | 禁用日期选择                |
| disabledHours   | (date: Dayjs, hours: number) => boolean   | -     | 禁用小时选择                |
| disabledMinutes | (date: Dayjs, minutes: number) => boolean | -     | 禁用分钟选择                |
| disabledSeconds | (date: Dayjs, seconds: number) => boolean | -     | 禁用秒选择                 |
