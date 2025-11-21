import {MenuOptionType, OptionsBase, OptionsBaseProps} from '../optionsBase'
import {Id} from '../../types'
import {useFlatSelection} from '../selectionContext'
import {Flex} from '../flex'
import {Button} from '../button'
import {usePopperContext} from '../popper'
import {memo, useEffect} from 'react'
import {FormItem, FormItemChildren, useFormContext, useFormValueContext} from '../form'

type FilterSharedProps = {
    /** 是否显示`重置`按钮，默认为`true` */
    showButton?: boolean
}

export interface FilterOptionsProps extends FilterSharedProps, OptionsBaseProps<MenuOptionType> {
    /** 默认为`true` */
    multiple?: boolean
}

export interface FilterControlProps extends FilterSharedProps {
    control: FormItemChildren
}

export const FilterBubbleContent = memo(({
    columnKey,
    columnFilterProps
}: {
    columnKey: Id
    columnFilterProps: FilterOptionsProps | FilterControlProps
}) => {
    const {formRef} = useFormContext()

    /**
     * ------------------------------------------------------------------------------------
     * 弹框关闭时触发筛选
     */

    const {open, setOpen} = usePopperContext()

    useEffect(() => {
        !open && formRef!.current!.submit().then()
    }, [open])

    return (
        <>
            <FormItem field={columnKey}>
                {'control' in columnFilterProps
                    ? columnFilterProps.control
                    : <FilterOptions {...columnFilterProps}/>
                }
            </FormItem>
            {columnFilterProps.showButton !== false
                ? <Flex
                    gap={6}
                    justifyContent="center"
                    marginTop={6}
                >
                    <Button
                        variant="text"
                        onClick={() => {
                            formRef!.current!.setFieldValue(columnKey, null)
                            setOpen(false)
                        }}
                    >
                        重置
                    </Button>
                </Flex>
                : <TriggerFilterOnChange/>
            }
        </>
    )
})

const FilterOptions = memo(({
    multiple = true,
    showButton = true,
    value,
    onChange,
    ...props
}: FilterOptionsProps & {
    value?: any
    onChange?(value: any): void
}) => {
    const [selectedValue, toggleSelect] = useFlatSelection({multiple, value, onChange})

    return (
        <OptionsBase
            showCheckbox={multiple}
            {...props}
            selectedValue={selectedValue}
            onToggleSelected={toggleSelect}
        />
    )
})

const TriggerFilterOnChange = memo(() => {
    const {formRef} = useFormContext()
    const {formValue} = useFormValueContext()

    useEffect(() => {
        formRef!.current!.submit().then()
    }, [formValue])

    return null
})