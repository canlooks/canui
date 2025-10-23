import {Children, ReactElement, ReactNode, Ref, isValidElement, memo, useCallback, useDeferredValue, useMemo, useRef, ComponentProps} from 'react'
import {InputBase, InputBaseProps} from '../inputBase'
import {isNoValue, mergeComponentProps, useControlled} from '../../utils'
import {classes, style} from './select.style'
import {Popper, PopperProps, PopperRef} from '../popper'
import {MenuItem} from '../menuItem'
import {Tag} from '../tag'
import {MenuOptionType, OptionsBase, OptionsBaseSharedProps} from '../optionsBase'
import {Input, InputProps} from '../input'
import {LoadingIndicator} from '../loadingIndicator'
import {Id, SelectableMultipleProps, SelectableSingleProps} from '../../types'
import {useFlatSelection} from '../selectionContext'
import {Icon} from '../icon'
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass'
import {popperStyle} from '../popper/popper.style'

export interface SelectBaseProps<O extends MenuOptionType> extends OptionsBaseSharedProps<O>,
    Omit<InputBaseProps<'input'>, 'children' | 'defaultValue' | 'value' | 'onChange'> {
    /** <select />内部由<input />实现 */
    inputProps?: ComponentProps<'input'>
    popperProps?: PopperProps
    popperRef?: Ref<PopperRef>

    defaultOpen?: boolean
    open?: boolean
    onOpenChange?(open: boolean): void

    sizeAdaptable?: boolean
    children?: ReactNode

    searchable?: boolean
    defaultSearchValue?: string
    searchValue?: string
    onSearchChange?(searchValue: string): void
    searchInputProps?: InputProps
}

export interface SelectSingleProps<O extends MenuOptionType, V extends Id = Id> extends SelectBaseProps<O>, SelectableSingleProps<V> {
    renderBackfill?(selectedValue: V): ReactNode
}

export interface SelectMultipleProps<O extends MenuOptionType, V extends Id = Id> extends SelectBaseProps<O>, SelectableMultipleProps<V> {
    renderBackfill?(selectedValue: V[]): ReactNode
}

export type SelectProps<O extends MenuOptionType, V extends Id = Id> = SelectSingleProps<O, V> | SelectMultipleProps<O, V>

export const Select = memo(<O extends MenuOptionType, V extends Id = Id>({
    inputProps,
    popperProps,
    popperRef,

    defaultOpen = false,
    open,
    onOpenChange,

    sizeAdaptable = true,
    children,

    multiple,
    defaultValue,
    value,
    onChange,
    renderBackfill,

    searchable,
    defaultSearchValue = '',
    searchValue,
    onSearchChange,
    searchInputProps,

    // 从OptionsBaseSharedProps继承的属性
    showCheckbox = !!multiple,
    loading,
    options,
    labelKey = 'label',
    primaryKey = 'value',
    searchTokenKey = 'searchToken',
    filterPredicate,

    ...props
}: SelectProps<O, V>) => {
    const [innerOpen, _setInnerOpen] = useControlled(defaultOpen, open, onOpenChange)
    const setInnerOpen = (open: boolean) => {
        _setInnerOpen(open)
        if (!open && document.activeElement === searchInputRef.current) {
            // 关闭下拉框时，如果焦点在搜索框上，需要移除焦点，避免影响下次打开下拉框
            searchInputRef.current!.blur()
        }
    }

    const openChangeHandler = (open: boolean) => {
        setInnerOpen(open)
    }

    const openChangeEnd = (open: boolean) => {
        // 关闭动画结束后清空搜索框
        !open && setInnerSearchValue('')
    }

    const searchInputRef = useRef<HTMLInputElement>(null)

    const onBlur = () => {
        setTimeout(() => {
            // 失去焦点后，如果不是聚焦在搜索框，则需要关闭弹框
            searchInputRef.current !== document.activeElement && setInnerOpen(false)
        })
    }

    const [innerValue, _toggleSelected, setInnerValue] = useFlatSelection<any>({multiple, defaultValue, value, onChange})

    const onToggleSelected = useCallback((value: V) => {
        _toggleSelected(value)
        // 单选模式下，选中一次就自动关闭弹框
        !multiple && setInnerOpen(false)
    }, [multiple])

    const onClear = () => {
        props.onClear?.()
        setInnerValue(multiple ? [] : void 0)
    }

    /**
     * ------------------------------------------------------------------
     * 搜索
     */

    const [innerSearchValue, setInnerSearchValue] = useControlled(defaultSearchValue, searchValue, onSearchChange)

    const deferredSearchValue = useDeferredValue(innerSearchValue.current)

    /**
     * ------------------------------------------------------------------
     * 渲染部分
     */

    const optionsArr = options || Children.map(children, c => isValidElement(c) ? c.props : c) as O[] || void 0

    const optionsMap = useMemo(() => {
        const map = new Map<V, O>()
        optionsArr?.forEach(opt => {
            opt && typeof opt === 'object' && map.set(opt[primaryKey], opt)
        })
        return map
    }, [optionsArr, primaryKey])

    const renderBackfillFn = () => {
        if (renderBackfill) {
            return renderBackfill(innerValue)
        }
        if (multiple) {
            return innerValue?.map((v: V) =>
                <Tag
                    key={v as any}
                    closable
                    onClose={() => onToggleSelected(v)}
                >
                    {optionsMap.get(v)?.[labelKey] ?? v as any}
                </Tag>
            )
        }
        return (
            <div className={classes.backfillWrap}>
                {optionsMap.get(innerValue)?.[labelKey] ?? innerValue}
            </div>
        )
    }

    return (
        <Popper
            {...mergeComponentProps(
                {
                    css: popperStyle,
                    open: innerOpen.current,
                    placement: 'bottom',
                    variant: 'collapse',
                    trigger: ['click', 'enter'],
                    disabled: props.disabled || props.readOnly,
                    sizeAdaptable: sizeAdaptable,
                    content: (
                        <>
                            {searchable &&
                                <Input
                                    {...mergeComponentProps<InputProps>(
                                        {
                                            inputProps: mergeComponentProps(searchInputProps?.inputProps, {ref: searchInputRef}),
                                            prefix: <Icon icon={faMagnifyingGlass}/>,
                                            placeholder: '搜索',
                                            value: innerSearchValue.current
                                        },
                                        searchInputProps,
                                        {
                                            onChange: e => setInnerSearchValue?.(e.target.value),
                                            onBlur
                                        }
                                    )}
                                />
                            }
                            <OptionsBase
                                selectedValue={innerValue}
                                searchValue={deferredSearchValue}
                                {...{
                                    onToggleSelected,
                                    showCheckbox,
                                    loading,
                                    options,
                                    labelKey,
                                    primaryKey,
                                    searchTokenKey,
                                    filterPredicate
                                }}
                            >
                                {children}
                            </OptionsBase>
                        </>
                    )
                },
                popperProps,
                {
                    popperRef,
                    onOpenChange: openChangeHandler,
                    onOpenChangeEnd: openChangeEnd,
                    onPointerDown: e => e.preventDefault()
                }
            )}
        >
            <InputBase<'input'>
                clearable={!!multiple}
                {...mergeComponentProps<InputBaseProps<'input'>>(
                    props,
                    {
                        css: style,
                        className: classes.root,
                        value: innerValue,
                        onClear,
                        onBlur
                    }
                )}
                data-focused={innerOpen.current}
            >
                {inputBaseProps =>
                    <div className={classes.contentWrap}>
                        {isNoValue(innerValue)
                            ? <div className={classes.placeholder}>{props.placeholder ?? '请选择'}</div>
                            : <div className={classes.backfill}>
                                {renderBackfillFn()}
                            </div>
                        }
                        <input
                            size={1}
                            {...mergeComponentProps<'input'>(inputBaseProps, inputProps)}
                            data-hidden="true"
                        />
                        <div className={classes.arrow} data-open={innerOpen.current}>
                            {loading
                                ? <LoadingIndicator/>
                                : <Icon icon={faChevronDown}/>
                            }
                        </div>
                    </div>
                }
            </InputBase>
        </Popper>
    )
}) as any as {
    <O extends MenuOptionType, V extends Id = Id>(props: SelectProps<O, V>): ReactElement
    Option: typeof MenuItem
}

export const Option = Select.Option = MenuItem