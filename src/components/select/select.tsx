import {Children, isValidElement, memo, ReactElement, useMemo} from 'react'
import {SelectBase, SelectBaseMultipleProps, SelectBaseOwnProps, SelectBaseSingleProps} from '../selectBase'
import {MenuOptionType, OptionsBase, OptionsBaseSharedProps} from '../optionsBase'
import {Id} from '../../types'
import {MenuItem} from '../menuItem'
import {useFlatSelection} from '../selectionContext'

export interface SelectOwnProps<O extends MenuOptionType> extends SelectBaseOwnProps, OptionsBaseSharedProps<O> {
}

export interface SelectSingleProps<O extends MenuOptionType, V extends Id = Id> extends SelectOwnProps<O>, SelectBaseSingleProps<V> {
}

export interface SelectMultipleProps<O extends MenuOptionType, V extends Id = Id> extends SelectOwnProps<O>, SelectBaseMultipleProps<V> {
}

export type SelectProps<O extends MenuOptionType, V extends Id = Id> = SelectSingleProps<O, V> | SelectMultipleProps<O, V>

export const Select = memo(({
    children,

    // 从SelectableProps继承
    multiple = false, // 同时转发至<SelectBase/>
    defaultValue,
    value,
    onChange,
    renderBackfill, // 同时转发至<SelectBase/>

    // 从OptionsBaseSharedProps继承
    showCheckbox = multiple,
    loading = false,
    options,
    labelKey = 'label',
    primaryKey = 'value',
    searchTokenKey = 'searchToken',
    filterPredicate,

    ...props
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
        props.onClear?.()
        setInnerValue(multiple ? [] : void 0)
    }

    return (
        <SelectBase
            {...props}
            multiple={multiple}
            renderBackfill={renderBackfill}
            onClear={onClear}
            _internalProps={{
                labelKey,
                optionsMap,
                innerValue,
                onToggleSelected: toggleSelected,
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