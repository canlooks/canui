# PickerDialog 选择对话框

## 示例

```tsx
import {Button, DataGrid, PickerDialog} from '@canlooks/can-ui'

export default function Index() {
    const [open, setOpen] = React.useState(false)
    
    const rows = React.useMemo(() => [
        {value: 1, label: '选项1', description: '这是选项1'},
        {value: 2, label: '选项2', description: '这是选项2'},
        {value: 3, label: '选项3', description: '这是选项3'},
        {value: 4, label: '选项4', description: '这是选项4'},
        {value: 5, label: '选项5', description: '这是选项5'},
        {value: 6, label: '选项6', description: '这是选项6'},
        {value: 7, label: '选项7', description: '这是选项7'},
        {value: 8, label: '选项8', description: '这是选项8'}
    ], [])
    
    const rowsGroup = React.useMemo(() => Map.groupBy(rows, item => item.value), [rows])

    return (
        <>
            <Button onClick={() => setOpen(true)}>打开选择对话框</Button>
            <PickerDialog
                open={open}
                onClose={() => setOpen(false)}
                title="选择对话框"
                options={rows}
                multiple
                primaryKey="value"
                selectedItemProps={value => {
                    const item = rowsGroup.get(value)[0]
                    return {
                        title: item.label,
                        description: item.description
                    }
                }}
            >
                <DataGrid
                    primaryKey="value"
                    columns={[
                        {
                            title: 'Label',
                            field: 'label',
                        }
                    ]}
                    rows={rows}
                />
            </PickerDialog>
        </>
    )
}
```