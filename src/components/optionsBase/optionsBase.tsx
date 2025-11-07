import React, {ReactElement, useMemo, memo, ReactNode, Children, isValidElement, cloneElement, useRef} from 'react'
import {Highlight} from '../highlight'
import {MenuItemProps, MenuItem} from '../menuItem'
import {Placeholder} from '../placeholder'
import {clsx, isSelected, mergeComponentProps, useKeyboard, useSync} from '../../utils'
import {classes, style} from './optionsBase.style'
import {Loading, LoadingProps} from '../loading'
import {usePopperContext, useScrollToTarget} from '../popper'
import {OptionType} from '../selectionContext'
import {Id} from '../../types'

export interface MenuOptionType<V extends Id = Id> extends Omit<MenuItemProps, 'children'>, Omit<OptionType<V>, 'children'> {
    /**
     * 若指定为`true`，则弹框打开时会自动滚动到该选项，默认为`false`
     */
    scrollHere?: boolean
}

export type OptionsBaseSharedProps<O extends MenuOptionType<V>, V extends Id = Id> = {
    showCheckbox?: boolean
    loading?: boolean
    options?: O[]
    children?: ReactNode
    /** 指定options中用于当作label的键, 默认为`"label"` */
    labelKey?: keyof O
    /** 指定options中的主键名, 默认为`"value"` */
    primaryKey?: keyof O
    /** 指定options中用于当作searchToken的键, 默认为`"searchToken"` */
    searchTokenKey?: keyof O
    /** 遍历选项时会触发该方法，若返回true，表示该选项满足筛选条件，反之会将该选项排除 */
    filterPredicate?(searchValue: string, option: O, index: number): any
}

export interface OptionsBaseProps<O extends MenuOptionType<V>, V extends Id = Id> extends OptionsBaseSharedProps<O, V>, LoadingProps {
    searchValue?: string
    selectedValue?: V | V[]
    onToggleSelected?(value: V, e: KeyboardEvent | React.MouseEvent<HTMLDivElement>): void
}

export const OptionsBase = memo(<O extends MenuOptionType<V>, V extends Id = Id>({
    // 共享属性
    showCheckbox,
    loading,
    options,
    children,
    labelKey = 'label',
    primaryKey = 'value',
    searchTokenKey = 'searchToken',
    filterPredicate,
    // 以下为非共享属性
    searchValue,
    selectedValue,
    onToggleSelected,
    ...props
}: OptionsBaseProps<O, V>) => {
    const {open, setOpen} = usePopperContext()

    const filteredOptions: (O | ReactNode)[] = useMemo(() => {
        const trimmedSearchValue = searchValue?.trim()
        if (!trimmedSearchValue) {
            return options || Children.toArray(children)
        }
        const splitedValue = trimmedSearchValue.split(' ')
        const filterFn = (opt: O, index: number) => {
            let ret = false
            if (filterPredicate) {
                ret = filterPredicate(trimmedSearchValue!, opt, index)
            } else {
                const searchToken = typeof opt[labelKey] === 'string' ? opt[labelKey] : opt[searchTokenKey]
                if (typeof searchToken === 'string') {
                    ret = splitedValue.some(k => {
                        return k && searchToken.toLowerCase().includes(k.toLowerCase())
                    })
                }
            }
            return ret
        }
        return options
            ? options.filter(filterFn)
            : Children.toArray(children).filter((c, index) => {
                return isValidElement(c) && filterFn(c.props as O, index)
            })
    }, [searchValue, filterPredicate, options, children, labelKey, searchTokenKey])

    /**
     * ------------------------------------------------------------------
     * 键盘控制
     */

    const {verticalIndex, setVerticalIndex} = useKeyboard({
        allowVertical: true,
        verticalCount: filteredOptions.length,
        open,
        setOpen,
        onEnter({verticalIndex}, e) {
            const opt = filteredOptions[verticalIndex]
            if (isValidElement(opt)) {
                const {props} = opt as any
                onToggleSelected?.(props.value, e)
            } else if (typeof opt === 'object' && opt) {
                onToggleSelected?.((opt as O)[primaryKey], e)
            }
        }
    })

    /**
     * ------------------------------------------------------------------
     * 渲染部分
     */

    const scrollerRef = useRef<HTMLDivElement>(null)

    const selectedItemRef = useScrollToTarget<HTMLDivElement>(scrollerRef)

    const syncOnToggleSelected = useSync(onToggleSelected)

    const renderedOptions: ReactNode = useMemo(() => {
        if (!filteredOptions?.length) {
            return <Placeholder/>
        }
        const makeProps = (params: {
            opt?: O
            label: ReactNode
            value: V
            index: number
            selected: boolean
            scrollHere?: boolean
        }): MenuItemProps => ({
            ref: params.scrollHere || params.selected ? selectedItemRef : void 0,
            showCheckbox,
            selected: params.selected,
            focused: verticalIndex.current === params.index,
            label: typeof params.label === 'string' && searchValue
                ? <Highlight keywords={searchValue?.split(' ')}>{params.label}</Highlight>
                : params.label,
            onClick: e => {
                e.stopPropagation()
                params.opt?.onClick?.(e)
                syncOnToggleSelected.current?.(params.value, e)
            },
            onPointerEnter: e => {
                params.opt?.onPointerEnter?.(e)
                setVerticalIndex(-1)
            },
            children: null,
            scrollHere: void 0
        })
        if (options) {
            return (filteredOptions as O[]).map((opt, index) => {
                const value: V = opt[primaryKey]
                const label = opt[labelKey] ?? value
                return (
                    <MenuItem
                        key={opt.key ?? value as any ?? index}
                        value={value}
                        {...mergeComponentProps(
                            opt,
                            makeProps({
                                label,
                                value,
                                index,
                                selected: isSelected(value, selectedValue),
                                scrollHere: opt.scrollHere
                            })
                        )}
                    />
                )
            })
        }
        // children
        return filteredOptions.map((c, index) => {
            if (!isValidElement(c)) {
                return c as ReactNode
            }
            const {value, label, scrollHere} = c.props as MenuOptionType<V>
            return cloneElement(c, makeProps({
                opt: c.props as O,
                label,
                value: value as V,
                index,
                selected: isSelected(value, selectedValue),
                scrollHere
            }))
        })
    }, [filteredOptions, selectedValue, verticalIndex.current, showCheckbox])

    return (
        <Loading
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            open={loading}
        >
            <div ref={scrollerRef} className={classes.optionsList}>
                {renderedOptions}
            </div>
        </Loading>
    )
}) as <O extends MenuOptionType<V>, V extends Id = Id>(props: OptionsBaseProps<O, V>) => ReactElement