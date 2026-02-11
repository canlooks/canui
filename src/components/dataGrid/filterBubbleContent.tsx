import {MenuOptionType, OptionsBase, OptionsBaseProps} from '../optionsBase'
import {Id} from '../../types'
import {useFlatSelection} from '../selectionContext'
import {Flex} from '../flex'
import {Button} from '../button'
import {usePopperContext} from '../popper'
import {memo, useDeferredValue, useEffect, useState} from 'react'
import {FormItem, FormItemChildren, useFormContext, useFormValueContext} from '../form'
import {filterOptionsStyle} from './filterBubbleContent.style'
import {Input} from '../input'
import {Icon} from '../icon'
import {faSearch} from '@fortawesome/free-solid-svg-icons'
import {useUpdateEffect} from '../../utils'

type FilterSharedProps = {
    /** 是否显示`重置`按钮，默认为`true` */
    showButton?: boolean
}

export interface FilterOptionsProps extends FilterSharedProps, OptionsBaseProps<MenuOptionType> {
    /** 默认为`true` */
    multiple?: boolean
    /** 默认为`false` */
    searchable?: boolean
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

    const {open, setOpen} = usePopperContext()

    useEffect(() => {
        if (!open && 'multiple' in columnFilterProps && columnFilterProps.multiple) {
            // 多选模式下，关闭弹框触发筛选
            formRef!.current!.submit().then()
        }
    }, [open])

    return (
        <>
            <FormItem field={columnKey}>
                {'control' in columnFilterProps
                    ? columnFilterProps.control
                    : <FilterOptions {...columnFilterProps}/>
                }
            </FormItem>
            {columnFilterProps.showButton !== false &&
                <Flex
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
            }
            {'multiple' in columnFilterProps && !columnFilterProps.multiple &&
                // 单选模式，变化即触发筛选
                <TriggerFilterOnChange onSubmit={() => setOpen(false)}/>
            }
        </>
    )
})

const FilterOptions = memo(({
    multiple = true,
    showButton = true,
    searchable = false,
    value,
    onChange,
    ...props
}: FilterOptionsProps & {
    value?: any
    onChange?(value: any): void
}) => {
    const [selectedValue, toggleSelect] = useFlatSelection({multiple, value, onChange})

    const [searchValue, setSearchValue] = useState('')

    const deferredSearchValue = useDeferredValue(searchValue)

    return (
        <div css={filterOptionsStyle}>
            {searchable &&
                <Input
                    prefix={<Icon icon={faSearch}/>}
                    placeholder="搜索"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                />
            }
            <OptionsBase
                showCheckbox={multiple}
                {...props}
                searchValue={deferredSearchValue}
                selectedValue={selectedValue}
                onToggleSelected={toggleSelect}
            />
        </div>
    )
})

function TriggerFilterOnChange(props: {
    onSubmit?(): void
}) {
    const {formRef} = useFormContext()
    const {formValue} = useFormValueContext()

    useUpdateEffect(() => {
        formRef!.current!.submit().then()
        props.onSubmit?.()
    }, [formValue])

    return null
}