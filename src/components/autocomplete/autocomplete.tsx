import React, {Children, ReactElement, ReactNode, Ref, SetStateAction, isValidElement, memo, useCallback, useMemo, useRef, useState} from 'react'
import {Popper, PopperProps, PopperRef} from '../popper'
import {MenuOptionType, OptionsBase} from '../optionsBase'
import {Input, InputProps} from '../input'
import {isUnset, useControlled, useDerivedState, useLoading, useSync, mergeComponentProps, useStrictEffect} from '../../utils'
import {classes} from './autocomplete.style'
import {popperStyle} from '../popper/popper.style'
import {Id} from '../../types'
import {MenuItem} from '../menuItem'

export interface AutocompleteProps<O extends MenuOptionType> extends Omit<InputProps, 'onSelect'> {
    children?: ReactNode
    options?: O[]
    loadOptions?(inputValue: InputProps['value']): O[] | Promise<O[]>
    /* 指定options中的主键名，默认为`value` */
    primaryKey?: keyof O
    /* 指定options中用于当作label的键，默认为`label` */
    labelKey?: keyof O
    onSelect?(selectedValue: keyof O, option: O | ReactElement): void

    renderInput?(inputProps: InputProps): ReactElement

    popperProps?: PopperProps
    popperRef?: Ref<PopperRef>
}

export const Autocomplete = memo(<O extends MenuOptionType>({
    children,
    loading,
    options,
    loadOptions,
    primaryKey = 'value',
    labelKey = 'label',
    onSelect,
    renderInput,
    popperProps,
    popperRef,

    defaultValue = '',
    value,
    onChange,
    ...props
}: AutocompleteProps<O>) => {
    const [focused, _setFocused] = useState(false)
    const setFocused = (focused: SetStateAction<boolean>) => {
        !props.disabled && !props.readOnly && _setFocused(focused)
    }

    const [innerValue, setInnerValue] = useControlled(defaultValue, value)

    const changedBySelect = useRef(false)

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>, isSelect = false) => {
        changedBySelect.current = isSelect
        onChange?.(e)
        setInnerValue(e.target.value)
    }

    /**
     * ------------------------------------------------------------------
     * 动态请求选项
     */

    const [innerOptions, setInnerOptions] = useState<O[]>()

    const [innerLoading, innerLoadOptions] = useLoading(async () => {
        loadOptions && setInnerOptions(
            await loadOptions(innerValue.current)
        )
    }, loading)

    useStrictEffect(() => {
        !changedBySelect.current && innerLoadOptions()
    }, [innerValue.current])

    /**
     * ------------------------------------------------------------------
     * 合并最终选项
     */

    const actualOptions = innerOptions || options || Children.map(children, c => isValidElement(c) ? c.props : c) as O[] || void 0

    const optionsMap = useMemo(() => {
        const map = new Map<Id, O>()
        actualOptions?.forEach(opt => {
            if (opt && typeof opt === 'object') {
                const key = opt[primaryKey]
                !isUnset(key) && map.set(key, opt)
            }
        })
        return map
    }, [actualOptions, primaryKey])

    const [open, _setOpen] = useDerivedState(() => {
        return focused && !!optionsMap.size
    }, [focused, optionsMap.size])

    const setOpen = (open: boolean) => {
        if (!props.disabled && !props.readOnly && (!open || optionsMap.size)) {
            // 必须有选项才能打开下拉框
            _setOpen(open)
        }
    }

    const innerInputRef = useRef<HTMLInputElement>(null)

    const syncOnSelect = useSync(onSelect)

    const optionSelectHandler = useCallback((value: Id, e: KeyboardEvent | React.MouseEvent<HTMLDivElement>) => {
        const option = optionsMap.get(value)!
        innerInputRef.current!.value = option[labelKey]
        syncOnSelect.current?.(value, option)
        changeHandler({
            ...e,
            target: innerInputRef.current!,
            currentTarget: innerInputRef.current!
        } as any, true)
        setOpen(false)
    }, [optionsMap, labelKey])

    const inputProps: InputProps = mergeComponentProps(
        props,
        {
            ref: innerInputRef,
            className: classes.root,
            loading: innerLoading.current,
            value: innerValue.current,
            onChange: changeHandler,
            onInput: () => setOpen(true),
            onClick: () => setOpen(true),
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false)
        })

    return (
        <Popper
            {...mergeComponentProps<PopperProps>(
                {
                    placement: 'bottom',
                    variant: 'collapse',
                    trigger: false,
                    content: (
                        <OptionsBase
                            onToggleSelected={optionSelectHandler}
                            loading={innerLoading.current}
                            options={actualOptions}
                            labelKey={labelKey}
                            primaryKey={primaryKey}
                        >
                            {children}
                        </OptionsBase>
                    )
                },
                popperProps,
                {
                    css: popperStyle,
                    open: open.current,
                    popperRef,
                    onOpenChange: setOpen,
                    onPointerDown: e => e.preventDefault()
                }
            )}
        >
            {renderInput
                ? renderInput(inputProps)
                : <Input {...inputProps}/>
            }
        </Popper>
    )
}) as any as {
    <O extends MenuOptionType>(props: AutocompleteProps<O>): ReactElement
    Option: typeof MenuItem
}