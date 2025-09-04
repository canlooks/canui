import {Children, ReactElement, ReactNode, Ref, isValidElement, memo, useMemo, ComponentProps} from 'react'
import {Popper, PopperProps, PopperRef} from '../popper'
import {NodeType, Tree, TreeBaseProps, TreeNode} from '../tree'
import {useControlled, toArray, clsx, mergeComponentProps} from '../../utils'
import {InputBase} from '../inputBase'
import {LoadingIndicator} from '../loadingIndicator'
import {popperStyle} from '../popper/popper.style'
import {Tag} from '../tag'
import {classes, style} from './treeSelect.style'
import {Id, SelectableSingleProps} from '../../types'
import {useSelection} from '../selectionContext'
import {Icon} from '../icon'
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown'

interface TreeSelectBaseProps<N extends NodeType<V>, V extends Id = Id> extends TreeBaseProps<N, V> {
    /** <select />内部由<input />实现 */
    inputProps?: ComponentProps<'input'>
    popperProps?: PopperProps
    popperRef?: Ref<PopperRef>

    options?: N[]

    sizeAdaptable?: boolean
    loading?: boolean

    defaultOpen?: boolean
    open?: boolean
    onOpenChange?(open: boolean): void
    /** 以下属性转发至<InputBase/> */
    placeholder?: string
    autoFocus?: boolean
    clearable?: boolean
    onClear?(): void
}

export interface TreeSelectSingleProps<N extends NodeType<V>, V extends Id = Id> extends TreeSelectBaseProps<N, V>, SelectableSingleProps<V> {
    renderBackfill?(selectedValue: V): ReactNode
}

export interface TreeSelectMultipleProps<N extends NodeType<V>, V extends Id = Id> extends TreeSelectBaseProps<N, V>, SelectableSingleProps<V> {
    renderBackfill?(selectedValue: V[]): ReactNode
}

export type TreeSelectProps<N extends NodeType<V>, V extends Id = Id> = TreeSelectSingleProps<N, V> | TreeSelectMultipleProps<N, V>

export const TreeSelect = memo(<N extends NodeType<V>, V extends Id = Id>({
    inputProps,
    popperProps,
    popperRef,

    nodes,
    options,

    defaultValue,
    value,
    onChange,

    sizeAdaptable,
    loading,

    defaultOpen,
    open,
    onOpenChange,

    renderBackfill,
    // 以下属性转发至<InputBase/>
    placeholder = '请选择',
    autoFocus,
    clearable,
    onClear,
    ...props
}: TreeSelectProps<N, V>) => {
    props.labelKey ??= 'label'

    const [innerOpen, setInnerOpen] = useControlled(defaultOpen, open, onOpenChange)

    const openChangeHandler = (open: boolean) => {
        popperProps?.onOpenChange?.(open)
        setInnerOpen(open)
    }

    const actualOptions = useMemo(() => {
        if (options) {
            return options
        }
        if (nodes) {
            return nodes
        }
        const fn = (arr?: ReactNode[]): N[] | undefined => {
            return arr?.map(node => {
                if (isValidElement(node)) {
                    const {props} = node as any
                    return {
                        ...props,
                        children: fn(Children.toArray(props.children))
                    }
                }
                return node
            })
        }
        return fn(Children.toArray(props.children))
    }, [options, nodes, props.children])

    const {
        value: innerValue,
        setValue: setInnerValue,
        toggleSelected,
        optionsMap
    } = useSelection({
        options: actualOptions,
        primaryKey: props.primaryKey ?? 'value',
        childrenKey: props.childrenKey ?? 'children',
        clearable: !!props.multiple,
        multiple: props.multiple as any,
        defaultValue: defaultValue as any,
        value,
        onChange
    })

    useMemo(() => {
        // 单选模式下，选中一次就自动关闭弹框
        !props.multiple && setInnerOpen(false)
    }, [innerValue, props.multiple])

    const clearHandler = () => {
        onClear?.()
        setInnerValue(props.multiple ? [] : void 0)
    }

    const renderBackfillFn = () => {
        if (renderBackfill) {
            return renderBackfill(innerValue)
        }
        if (props.multiple) {
            return toArray(innerValue)?.map((v: V) =>
                <Tag
                    key={v}
                    closable
                    onClose={() => toggleSelected(v)}
                >
                    {optionsMap.get(v)?.[props.labelKey!] ?? v}
                </Tag>
            )
        }
        return (
            <div className={classes.backfillWrap}>
                {optionsMap.get(innerValue)?.[props.labelKey!] ?? innerValue}
            </div>
        )
    }

    return (
        <Popper
            css={popperStyle}
            open={innerOpen.current}
            onOpenChange={openChangeHandler}
            placement="bottom"
            variant="collapse"
            trigger={['click', 'enter']}
            disabled={props.disabled || props.readOnly}
            sizeAdaptable={sizeAdaptable}
            content={
                <Tree
                    {...props}
                    nodes={options}
                    value={innerValue}
                    onChange={setInnerValue}
                />
            }
            {...popperProps}
            popperRef={popperRef}
            onPointerDown={e => {
                popperProps?.onPointerDown?.(e)
                e.preventDefault()
            }}
        >
            <InputBase<'input'>
                clearable={!!props.multiple}
                css={style}
                className={clsx(classes.root, props.className)}
                data-focused={open}
                value={innerValue}
                onClear={clearHandler}
                placeholder={placeholder}
                autoFocus={autoFocus}
                disabled={props.disabled}
                readOnly={props.readOnly}
            >
                {inputBaseProps =>
                    <div className={classes.contentWrap}>
                        {!toArray(innerValue)?.length
                            ? <div className={classes.placeholder}>{placeholder}</div>
                            : <div className={classes.backfill}>
                                {renderBackfillFn()}
                            </div>
                        }
                        <input
                            size={1}
                            {...mergeComponentProps(inputBaseProps, inputProps)}
                            data-hidden="true"
                        />
                        <div className={classes.arrow} data-open={open}>
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
    <N extends NodeType<V>, V extends Id = Id>(props: TreeSelectProps<N, V>): ReactElement
    Option: typeof TreeNode
    Node: typeof TreeNode
}

TreeSelect.Option = TreeSelect.Node = TreeNode