import React, {ReactElement, ReactNode, Ref, memo, useCallback, useEffect, useMemo, useRef, useImperativeHandle} from 'react'
import {DivProps, Id, Obj} from '../../types'
import {ColumnType, DataGrid, DataGridBaseProps, DataGridMultipleProps, DataGridSingleProps, OrderType, RowType} from '../dataGrid'
import {Form, FormItemProps, FormProps, FormRef, FormValue} from '../form'
import {CurdFilterable, CurdFilterableProps} from './curdFilterable'
import {classes, style} from './curd.style'
import {FieldPath, clsx, useControlled, useCurdColumns, useDerivedState, useLoading, useSync, mergeComponentProps} from '../../utils'
import {Button, ButtonProps} from '../button'
import {Tooltip} from '../tooltip'
import {CurdColumnConfig} from './curdColumnConfig'
import {CurdResizable} from './curdResizable'
import {Pagination} from '../pagination'
import {Divider} from '../divider'
import {CurdDialog, CurdDialogProps, CurdDialogRef} from './curdDialog'
import {useAppContext} from '../app'
import {BubbleConfirm, BubbleConfirmProps} from '../bubbleConfirm'
import {useSelectionContext} from '../selectionContext'
import {Icon} from '../icon'
import {faTrashCan} from '@fortawesome/free-regular-svg-icons/faTrashCan'
import {faPenToSquare} from '@fortawesome/free-regular-svg-icons/faPenToSquare'
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus'
import {faRotateRight} from '@fortawesome/free-solid-svg-icons/faRotateRight'

export type CurdFormItemProps<I = any> = FormItemProps<I> & {
    /** 对filter或form内的字段单独排序，数字越大越靠后，默认为`0` */
    order?: number
} & Obj

export type CurdFormItemType<I = any> = CurdFormItemProps<I> | ReactElement | true

export interface CurdColumn<R extends RowType = RowType> extends Omit<ColumnType<R>, 'filter' | 'children'> {
    /** 在表格中隐藏，表明该列只用于filter或form */
    hideInTable?: boolean
    filter?: CurdFormItemType | (() => CurdFormItemType)
    filterInline?: ColumnType<R>['filter']
    form?: CurdFormItemType | ((activeRow?: R) => CurdFormItemType)
}

export type LoadRowsReturn<R extends RowType = RowType> = {
    rows: R[]
    /** 必须返回总数才能使翻页正常工作 */
    total: number
}

type EachRowType<R extends RowType, T> = T | ((row: R) => T)

export type CurdRef<R extends RowType = RowType, F extends FormValue = FormValue> = {
    openCreateDialog(defaultValue?: F): Promise<F> | undefined
    selectSingle(): Promise<R> | undefined
    selectMultiple(selected?: Id[]): Promise<Id[]> | undefined
}

export interface CurdBaseProps<R extends RowType = RowType, F extends FormValue = FormValue>
    extends Omit<DataGridBaseProps<R>, 'ref' | 'columns' | 'filterPredicate'> {
    ref?: Ref<CurdRef<R, F>>

    /** 默认属性会传递给DataGrid组件，外层包裹元素的属性使用wrapperProps */
    wrapperProps?: DivProps
    /** 嵌入式样式通常用于Dialog或Card组件内 */
    variant?: 'standard' | 'embeded'

    loadRows?: (
        pagination?: { page: number, pageSize: number },
        filterValue?: FormValue,
        sorter?: { field: FieldPath, type: OrderType }
    ) => LoadRowsReturn<R> | Promise<LoadRowsReturn<R>>

    columns?: (CurdColumn<R> | symbol)[]

    toolbarLeft?: ReactNode
    toolbarRight?: ReactNode
    reloadable?: boolean
    onReload?(): void
    resizable?: boolean
    columnConfigurable?: boolean | {
        defaultVisible?: Id[]
        visible?: Id[]
        onVisibleChange?(visible: Id[]): void
        defaultOrder?: Id[]
        order?: Id[]
        onOrderChange?(order: Id[]): void
    }

    filterableProps?: Omit<CurdFilterableProps, 'columns'>
    renderFilterable?(filterableProps: CurdFilterableProps): ReactNode
    renderFilterConditions?: CurdFilterableProps['renderFilterConditions']

    copyable?: boolean
    creatable?: boolean
    updatable?: EachRowType<R, boolean>
    deletable?: EachRowType<R, boolean>
    createButtonProps?: ButtonProps
    updateButtonProps?: EachRowType<R, ButtonProps>
    deleteButtonProps?: EachRowType<R, ButtonProps>
    deleteConfirmProps?: BubbleConfirmProps
    controlColumnTitle?: ReactNode
    /** 渲染额外的操作项，不会影响"编辑"与"删除"按钮 */
    renderExtraControl?(row: R): ReactNode

    /** 用于做每行数据标题的字段 */
    titleKey?: keyof R
    /** 数据的名称，默认为`"数据"` */
    dataName?: ReactNode
    /** create操作的名称，默认为`"添加"` */
    createName?: ReactNode
    /** update操作的名称，默认为`"编辑"` */
    updateName?: ReactNode
    /** delete操作的名称，默认为`"删除"` */
    deleteName?: ReactNode
    /** create操作完成后触发，若返回promise则会等待promise返回再触发loadRows */
    onCreate?(formValue: F): any
    onUpdate?(formValue: F, row: R): any
    onDelete?(row: R): any
    /** 行数据转换为表单值的方法，若不指定，行数据会直接填入表单 */
    rowToForm?(row: R): F | Promise<F>

    dialogProps?: CurdDialogProps<R, F>
    formProps?: FormProps<F>
    formRef?: Ref<FormRef<F>>
}

interface CurdSingleProps<R extends RowType, F extends FormValue = FormValue, V extends Id = Id> extends Omit<DataGridSingleProps<R, V>, 'ref' | 'columns'>, CurdBaseProps<R, F> {
}

interface CurdMultipleProps<R extends RowType, F extends FormValue = FormValue, V extends Id = Id> extends Omit<DataGridMultipleProps<R, V>, 'ref' | 'columns'>, CurdBaseProps<R, F> {
}

export type CurdProps<R extends RowType, F extends FormValue = FormValue, V extends Id = Id> = CurdSingleProps<R, F, V> | CurdMultipleProps<R, F, V>

export const Curd = memo(<R extends RowType, F extends FormValue = FormValue, V extends Id = Id>(props: CurdProps<R, F, V>) => {
    const {
        ref,
        wrapperProps,
        variant = 'standard',
        loadRows,
        columns,

        toolbarLeft,
        toolbarRight,
        reloadable = true,
        onReload,
        resizable = true,
        columnConfigurable = true,

        filterProps,
        initialFilterValue,
        onFilter,
        filterableProps,
        renderFilterable,
        renderFilterConditions,

        copyable,
        creatable = true,
        updatable = true,
        deletable = true,
        createButtonProps,
        updateButtonProps,
        deleteButtonProps,
        deleteConfirmProps,
        controlColumnTitle = '操作',
        renderExtraControl,

        titleKey,
        dataName = '',
        createName = '添加',
        updateName = '编辑',
        deleteName = '删除',
        onCreate,
        onUpdate,
        onDelete,
        rowToForm,

        dialogProps,
        formProps,
        formRef,
        onChange,
        ...dataGridProps
    } = props

    /**
     * -------------------------------------------------------------
     * ref
     */

    useImperativeHandle(ref, () => ({
        openCreateDialog(defaultValue?: F) {
            return curdDialogRef.current?.open(void 0, defaultValue)
        },
        selectSingle() {
            return curdDialogRef.current?.selectSingle()
        },
        selectMultiple(selected?: Id[]) {
            return curdDialogRef.current?.selectMultiple(selected)
        }
    }))

    /**
     * -------------------------------------------------------------
     * 筛选部分
     */

    const innerFilterRef = useRef<FormRef>(null)

    const filterHandler = (value: FormValue) => {
        onFilter?.(value)
        innerLoadRows().then()
    }

    const renderFilterableFn = () => {
        const _filterProps: CurdFilterableProps = {
            renderFilterConditions,
            ...filterableProps,
            columns
        }
        if (renderFilterable) {
            return renderFilterable(_filterProps)
        }
        return <CurdFilterable {..._filterProps} />
    }

    /**
     * -------------------------------------------------------------
     * 添加操作列
     */

    const completedColumns = useMemo(() => {
        if (!updatable && !deletable && !renderExtraControl) {
            return columns
        }
        const controlColumn: CurdColumn<R> = {
            key: '$control',
            title: controlColumnTitle,
            render(row) {
                const _updatable = typeof updatable === 'function' ? updatable(row) : updatable
                const _deletable = typeof deletable === 'function' ? deletable(row) : deletable
                const _updateProps = _updatable ? (typeof updateButtonProps === 'function' ? updateButtonProps(row) : updateButtonProps) : void 0
                const _deleteProps = _deletable ? (typeof deleteButtonProps === 'function' ? deleteButtonProps(row) : deleteButtonProps) : void 0

                return (
                    <div className={classes.control}>
                        {renderExtraControl?.(row)}
                        {_updatable &&
                            <Button
                                prefix={<Icon icon={faPenToSquare}/>}
                                variant="plain"
                                {..._updateProps}
                                onClick={e => {
                                    _updateProps?.onClick?.(e)
                                    updateHandler(row)
                                }}
                            >
                                编辑
                            </Button>
                        }
                        {_deletable &&
                            <BubbleConfirm
                                title={`删除${dataName}`}
                                content={`删除后不可恢复，确定要删除该${dataName || '数据'}吗？`}
                                {...deleteConfirmProps}
                                onConfirm={e => deleteHandler(row, e)}
                            >
                                <Button
                                    prefix={<Icon icon={faTrashCan}/>}
                                    variant="plain"
                                    color="error"
                                    {..._deleteProps}
                                >
                                    删除
                                </Button>
                            </BubbleConfirm>
                        }
                    </div>
                )
            }
        }
        return [...columns || [], controlColumn]
    }, [columns, updatable, deletable, renderExtraControl, controlColumnTitle, updateButtonProps, deleteButtonProps, dataName, deleteConfirmProps])

    const {
        orderedColumns, actualColumns,
        innerVisible, setInnerVisible, setInnerOrder
    } = useCurdColumns({
        columns: completedColumns,
        columnConfigurable
    })

    /**
     * -------------------------------------------------------------
     * 表格设置
     */

    const [innerSize, setInnerSize] = useDerivedState(props.size || props.tableProps?.size || 'medium')

    const [innerPage, setInnerPage] = useControlled(
        props.paginationProps?.defaultPage ?? 1,
        props.paginationProps?.page,
        props.paginationProps?.onPageChange
    )

    const [innerPageSize, setInnerPageSize] = useControlled(
        props.paginationProps?.defaultPageSize ?? 10,
        props.paginationProps?.pageSize,
        props.paginationProps?.onPageSizeChange
    )

    const [innerOrderColumn, setInnerOrderColumn] = useControlled(props.defaultOrderColumn, props.orderColumn)

    const [innerOrderType, setInnerOrderType] = useControlled(props.defaultOrderType || 'descend', props.orderType)

    const orderChangeHandler = (orderColumn: string, orderType: OrderType) => {
        dataGridProps?.onOrderChange?.(orderColumn, orderType)
        setInnerOrderColumn(orderColumn)
        setInnerOrderType(orderType)
    }

    /**
     * -------------------------------------------------------------
     * 行数据
     */

    const {setOptions} = useSelectionContext()

    const [innerRows, _setInnerRows] = useDerivedState(props.rows)

    useEffect(() => {
        innerRows.current?.length && setOptions?.(innerRows.current)
    }, [])

    const setInnerRows = (data: R[]) => {
        setOptions?.(data)
        _setInnerRows(data)
    }

    const [innerTotal, setInnerTotal] = useDerivedState(props.paginationProps?.total || 0)

    const [innerLoading, innerLoadRows] = useLoading(async () => {
        if (loadRows) {
            const res = await loadRows(
                props.paginatable !== false
                    ? {
                        page: innerPage.current,
                        pageSize: innerPageSize.current,
                    }
                    : void 0,
                innerFilterRef.current!.getFormValue(),
                innerOrderColumn.current
                    ? {
                        field: innerOrderColumn.current,
                        type: innerOrderType.current
                    }
                    : void 0
            )
            if (typeof res === 'object' && res !== null) {
                setInnerRows(res.rows)
                setInnerTotal(res.total)
            }
        }
    }, props.loading)

    useEffect(() => {
        innerLoadRows().then()
    }, [innerPage.current, innerPageSize.current, innerOrderColumn.current, innerOrderType.current])

    const reloadHandler = () => {
        onReload?.()
        innerLoadRows().then()
    }

    /**
     * -------------------------------------------------------------
     * 弹窗与曾删改部分
     */

    const curdDialogRef = useRef<CurdDialogRef<R, F>>(null)

    const activeRow = useRef<R>(void 0)

    const createHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        createButtonProps?.onClick?.(e)
        activeRow.current = void 0
        curdDialogRef.current!.open().then()
    }

    const updateHandler = (row: R) => {
        activeRow.current = row
        curdDialogRef.current!.open(row).then()
    }

    const {message} = useAppContext()

    const syncProps = useSync({dialogProps, onCreate, onUpdate})

    const finishHandler = useCallback(async (formValue: F) => {
        const {dialogProps, onCreate, onUpdate} = syncProps.current
        dialogProps?.onFinish?.(formValue)
        if (activeRow.current) {
            await onUpdate?.(formValue, activeRow.current)
            innerLoadRows().then()
            message.success(updateName + '成功').then()
        } else {
            await onCreate?.(formValue)
            if (innerPage.current !== 1) {
                // 翻页也会触发innerLoadRows()，因此不在第一页时，直接翻至第一页即可
                setInnerPage(1)
            } else {
                innerLoadRows().then()
            }
            message.success(createName + '成功').then()
        }
    }, [])

    const deleteHandler = async (row: R, e: React.MouseEvent<HTMLButtonElement>) => {
        deleteConfirmProps?.onConfirm?.(e)
        await onDelete?.(row)
        innerLoadRows().then()
        message.success(deleteName + '成功').then()
    }

    return (
        <div
            {...wrapperProps}
            css={style}
            className={clsx(classes.root, wrapperProps?.className)}
            data-variant={variant}
        >
            <Form
                {...mergeComponentProps<FormProps>(
                    {
                        variant: 'plain',
                        initialValue: initialFilterValue
                    },
                    filterProps,
                    {
                        ref: innerFilterRef,
                        onFinish: filterHandler
                    }
                )}
            >
                {renderFilterableFn()}

                {(creatable || toolbarLeft || toolbarRight || reloadable || resizable || columnConfigurable) &&
                    <div className={classes.toolbar}>
                        <div className={classes.toolbarLeft}>
                            {creatable &&
                                <Button
                                    prefix={<Icon icon={faPlus}/>}
                                    {...createButtonProps}
                                    onClick={createHandler}
                                >
                                    {createName}{dataName}
                                </Button>
                            }
                            {toolbarLeft}
                        </div>
                        <div className={classes.toolbarRight}>
                            {!!toolbarRight &&
                                <>
                                    {toolbarRight}
                                    <Divider className={classes.divider} orientation="vertical"/>
                                </>
                            }
                            {reloadable &&
                                <Tooltip title="刷新">
                                    <Button
                                        shape="circular"
                                        variant="text"
                                        color="text.secondary"
                                        prefix={<Icon icon={faRotateRight}/>}
                                        loading={innerLoading.current}
                                        onClick={reloadHandler}
                                    />
                                </Tooltip>
                            }
                            {resizable &&
                                <CurdResizable
                                    innerSize={innerSize.current}
                                    setInnerSize={setInnerSize}
                                />
                            }
                            {columnConfigurable &&
                                <CurdColumnConfig
                                    columns={orderedColumns}
                                    innerVisible={innerVisible.current}
                                    setInnerVisible={setInnerVisible}
                                    setInnerOrder={setInnerOrder}
                                />
                            }
                        </div>
                    </div>
                }

                <div className={classes.card}>
                    <DataGrid
                        {...dataGridProps}
                        columns={actualColumns}
                        tableProps={{
                            ...props.tableProps,
                            ...resizable && {size: innerSize.current}
                        }}

                        loading={innerLoading.current}
                        rows={innerRows.current}

                        paginatable={!loadRows && props.paginatable}
                        renderPagination={loadRows && props.paginatable !== false
                            ? () =>
                                <Pagination
                                    {...props.paginationProps}
                                    total={innerTotal.current}
                                    page={innerPage.current}
                                    onPageChange={setInnerPage}
                                    pageSize={innerPageSize.current}
                                    onPageSizeChange={setInnerPageSize}
                                />
                            : props.renderPagination
                        }

                        orderColumn={innerOrderColumn.current}
                        orderType={innerOrderType.current}
                        onOrderChange={orderChangeHandler}
                    />
                </div>
            </Form>

            {(creatable || updatable) &&
                <CurdDialog
                    {...dialogProps}
                    ref={curdDialogRef}
                    onFinish={finishHandler}
                    curdProps={props}
                />
            }
        </div>
    )
}) as any as {
    <R extends RowType, F extends FormValue = FormValue, V extends Id = Id>(props: CurdProps<R, F, V>): ReactElement
    Filter: typeof CurdFilterable
    CONTROL_COLUMN: symbol
}

Curd.Filter = CurdFilterable
Curd.CONTROL_COLUMN = Symbol('control-column')