import {Children, isValidElement, memo, ReactElement, useMemo} from 'react'
import {SelectBase, SelectBaseMultipleProps, SelectBaseOwnProps, SelectBaseProps, SelectBaseSingleProps} from '../selectBase'
import {MenuOptionType, OptionsBase, OptionsBaseSharedProps} from '../optionsBase'
import {InputBaseProps} from '../inputBase'
import {Id} from '../../types'
import {MenuItem} from '../menuItem'
import {useFlatSelection} from '../selectionContext'

export interface SelectOwnProps<O extends MenuOptionType> extends SelectBaseOwnProps,
    OptionsBaseSharedProps<O>,
    Omit<InputBaseProps<'input'>, 'children' | 'placeholder' | 'defaultValue' | 'value' | 'onChange'> {
}

export interface SelectSingleProps<O extends MenuOptionType, V extends Id = Id> extends SelectOwnProps<O>, SelectBaseSingleProps<V> {
}

export interface SelectMultipleProps<O extends MenuOptionType, V extends Id = Id> extends SelectOwnProps<O>, SelectBaseMultipleProps<V> {
}

export type SelectProps<O extends MenuOptionType, V extends Id = Id> = SelectSingleProps<O, V> | SelectMultipleProps<O, V>

export const Select = memo(({
    inputProps,
    popperProps,
    popperRef,

    defaultOpen = false,
    open,
    onOpenChange,

    placeholder = '请选择',
    sizeAdaptable = true,
    disabled,
    readOnly,

    searchable,
    defaultSearchValue = '',
    searchValue,
    onSearchChange,
    searchInputProps,

    children,

    // 从SelectableProps继承
    multiple = false,
    defaultValue,
    value,
    onChange,
    renderBackfill,

    // 从OptionsBaseSharedProps继承
    showCheckbox = multiple,
    loading = false,
    options,
    labelKey = 'label',
    primaryKey = 'value',
    searchTokenKey = 'searchToken',
    filterPredicate,

    ...inputBaseProps
}: SelectProps<any>) => {
    const optionsArr = options || Children.map(children, c => {
        return isValidElement(c) ? c.props : c
    }) || void 0

    const optionsMap = useMemo(() => {
        const map = new Map()
        optionsArr?.forEach(opt => {
            opt && typeof opt === 'object' && map.set(opt[primaryKey], opt)
        })
        return map
    }, [optionsArr, primaryKey])

    const [innerValue, toggleSelected, setInnerValue] = useFlatSelection<any>({multiple, defaultValue, value, onChange})

    const onClear = () => {
        setInnerValue(multiple ? [] : void 0)
    }

    return (
        <SelectBase
            {...{
                inputProps,
                popperProps,
                popperRef,

                defaultOpen,
                open,
                onOpenChange,

                placeholder,
                sizeAdaptable,
                disabled,
                readOnly,

                searchable,
                defaultSearchValue,
                searchValue,
                onSearchChange,
                searchInputProps,

                multiple,
                renderBackfill,
            } as SelectBaseProps}
            _internalProps={{
                inputBaseProps,
                labelKey,
                optionsMap,
                innerValue,
                onToggleSelected: toggleSelected,
                onClear,
                renderPopperContent: (searchValue, onToggleSelected) => (
                    <OptionsBase
                        selectedValue={innerValue}
                        {...{
                            searchValue,
                            onToggleSelected,
                            showCheckbox,
                            loading,
                            options,
                            labelKey,
                            primaryKey,
                            searchTokenKey,
                            filterPredicate,
                            children
                        }}
                    />
                )
            }}
        />
    )
}) as any as {
    <O extends MenuOptionType, V extends Id = Id>(props: SelectProps<O, V>): ReactElement
    Option: typeof MenuItem
}

export const Option = Select.Option = MenuItem