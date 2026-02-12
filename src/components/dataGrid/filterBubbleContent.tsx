import {MenuOptionType, OptionsBase, OptionsBaseProps} from '../optionsBase'
import {Id} from '../../types'
import {useFlatSelection} from '../selectionContext'
import {Flex} from '../flex'
import {Button} from '../button'
import {usePopperContext} from '../popper'
import {memo, useDeferredValue, useEffect, useState} from 'react'
import {FormItem, FormItemChildren, useFormContext} from '../form'
import {filterOptionsStyle} from './filterBubbleContent.style'
import {Input} from '../input'
import {Icon} from '../icon'
import {faSearch} from '@fortawesome/free-solid-svg-icons'

type FilterSharedProps = {
    /** 是否显示`重置`按钮，默认为`true` */
    showResetButton?: boolean
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
        if (!open) {
            // 关闭弹框触发筛选
            formRef!.current!.submit().then()
        }
    }, [open])

    return (
        <>
            <FormItem field={columnKey}>
                {'control' in columnFilterProps
                    ? columnFilterProps.control
                    : <FilterOptions
                        {...columnFilterProps}
                        onChange={() => {
                            !columnFilterProps.multiple && setOpen(false)
                        }}
                    />
                }
            </FormItem>
            {columnFilterProps.showResetButton !== false &&
                <Flex
                    gap={6}
                    justifyContent="center"
                    marginTop={6}
                >
                    <Button
                        variant="text"
                        onClick={() => {
                            formRef!.current!.resetField(columnKey)
                            setOpen(false)
                        }}
                    >
                        重置
                    </Button>
                </Flex>
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