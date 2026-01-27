import {InputBase, InputBaseProps} from '../inputBase'
import {ComponentProps, ReactNode, Ref, useDeferredValue, useRef} from 'react'
import {Popper, PopperProps, PopperRef} from '../popper'
import {Input, InputProps} from '../input'
import {isNoValue, mergeComponentProps, useControlled} from '../../utils'
import {popperStyle} from '../popper/popper.style'
import {Icon} from '../icon'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass'
import {classes, style} from './selectBase.style'
import {Id, SelectableMultipleProps, SelectableSingleProps} from '../../types'
import {Tag} from '../tag'
import {LoadingIndicator} from '../loadingIndicator'
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown'

export type SelectBaseOwnProps = {
    /** <select />内部由<input />实现 */
    inputProps?: ComponentProps<'input'>
    popperProps?: PopperProps
    popperRef?: Ref<PopperRef>

    defaultOpen?: boolean
    open?: boolean
    onOpenChange?(open: boolean): void

    placeholder?: ReactNode
    sizeAdaptable?: boolean
    disabled?: boolean
    readOnly?: boolean
    loading?: boolean

    searchable?: boolean
    defaultSearchValue?: string
    searchValue?: string
    onSearchChange?(searchValue: string): void
    searchInputProps?: InputProps
}

export interface SelectBaseSingleProps<V extends Id = Id> extends SelectBaseOwnProps, SelectableSingleProps<V> {
    renderBackfill?(selectedValue: V | undefined): ReactNode
}

export interface SelectBaseMultipleProps<V extends Id = Id> extends SelectBaseOwnProps, SelectableMultipleProps<V> {
    renderBackfill?(selectedValue: V[] | undefined): ReactNode
}

export type SelectBaseProps<V extends Id = Id> = SelectBaseSingleProps<V> | SelectBaseMultipleProps<V>

export function SelectBase({
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
    loading = false,

    searchable,
    defaultSearchValue = '',
    searchValue,
    onSearchChange,
    searchInputProps,

    // 从SelectableProps继承
    multiple = false,
    renderBackfill,

    _internalProps: {
        inputBaseProps,
        labelKey,
        optionsMap,
        innerValue,
        onToggleSelected,
        onClear,
        renderPopperContent
    },
}: Omit<SelectBaseProps, 'defaultValue' | 'value' | 'onChange'> & {
    /** @private 内部使用的属性 */
    _internalProps: {
        inputBaseProps?: Omit<InputBaseProps<'input'>, 'children'>
        labelKey: keyof any
        optionsMap: Map<Id, any>
        innerValue: (Id & Id[]) | undefined
        onToggleSelected(value: Id): void
        onClear: (() => void) | undefined
        renderPopperContent(searchValue: string, toggleSelected: (value: Id) => void): ReactNode
    }
}) {
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

    const toggleSelectHandler = (value: Id) => {
        onToggleSelected(value)
        // 单选模式下，选中一次就自动关闭弹框
        !multiple && setInnerOpen(false)
    }

    /**
     * ------------------------------------------------------------------
     * 搜索
     */

    const searchInputRef = useRef<HTMLInputElement>(null)

    const [innerSearchValue, setInnerSearchValue] = useControlled(defaultSearchValue, searchValue, onSearchChange)

    const deferredSearchValue = useDeferredValue(innerSearchValue.current)

    /**
     * ------------------------------------------------------------------
     * 渲染部分
     */

    const onBlur = () => {
        setTimeout(() => {
            // 失去焦点后，如果不是聚焦在搜索框，则需要关闭弹框
            searchInputRef.current !== document.activeElement && setInnerOpen(false)
        })
    }

    const renderBackfillFn = () => {
        if (renderBackfill) {
            return renderBackfill(innerValue)
        }
        if (multiple) {
            return innerValue?.map(v =>
                <Tag
                    key={v}
                    closable
                    onClose={() => toggleSelectHandler(v)}
                >
                    {optionsMap.get(v)?.[labelKey] ?? v}
                </Tag>
            )
        }
        return (
            <div className={classes.backfillWrap}>
                {optionsMap.get(innerValue!)?.[labelKey] ?? innerValue}
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
                    disabled: disabled || readOnly,
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
                                            onChange: e => setInnerSearchValue(e.target.value),
                                            onBlur
                                        }
                                    )}
                                />
                            }
                            {renderPopperContent(deferredSearchValue, toggleSelectHandler)}
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
                clearable={multiple}
                {...mergeComponentProps<InputBaseProps<'input'>>(
                    inputBaseProps,
                    {
                        css: style,
                        className: classes.root,
                        disabled,
                        readOnly,
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
                            ? <div className={classes.placeholder}>{placeholder}</div>
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
}