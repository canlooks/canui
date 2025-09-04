# DateTimeRangePicker 日期时间范围选择器

## 示例

```tsx
import {DateTimeRangePicker} from '@canlooks/can-ui'

export default function Index() {
    return (
        <DateTimeRangePicker/>
    )
}
```

## Props

| 属性               | 类型                                                                      | 默认值        | 说明                          |
|------------------|-------------------------------------------------------------------------|------------|-----------------------------|
| startPickerProps | [DateTimePickerProps](/components/dateTimePicker)                       | -          | 传递给`<DateTimePicker/>`组件的属性 |
| endPickerProps   | [DateTimePickerProps](/components/dateTimePicker)                       | -          | 传递给`<DateTimePicker/>`组件的属性 |
| format           | string                                                                  | -          | 选择器的样式会根据`format`自动改变       |
| defaultValue     | [DayJs](https://day.js.org/) \| null                                    | null       | 默认值                         |
| value            | [DayJs](https://day.js.org/) \| null                                    | -          | 受控的值                        |
| onChange         | (dayJs) => void                                                         | -          | 变化回调                        |
| min              | Dayjs                                                                   | -          |                             |
| max              | Dayjs                                                                   | -          |                             |
| disabledDates    | (date: Dayjs) => boolean                                                | -          | 禁用日期选择                      |
| disabledHours    | (date: Dayjs, hours: number) => boolean                                 | -          | 禁用小时选择                      |
| disabledMinutes  | (date: Dayjs, minutes: number) => boolean                               | -          | 禁用分钟选择                      |
| disabledSeconds  | (date: Dayjs, seconds: number) => boolean                               | -          | 禁用秒选择                       |
| variant          | 'outlined' \| 'underlined'                        \| 'plain'            | 'outlined' |                             |
| size             | 'small' \| 'medium'                                          \| 'large' | 'medium'   |                             |
| color            | string                                                                  | -          |                             |
| disabled         | boolean                                                                 | -          |                             |
| readOnly         | boolean                                                                 | -          |                             |
| autoFocus        | boolean                                                                 | -          |                             |
