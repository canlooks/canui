import React, {ReactElement, ReactNode, isValidElement, memo, useMemo, useRef, useState} from 'react'
import {FormItem, FormRef, FormValue, useFormContext, useFormValueContext} from '../form'
import {CurdBaseProps} from './curd'
import {classes} from './curd.style'
import {clsx, columnsToFilterItem, isUnset} from '../../utils'
import {Grid} from '../grid'
import {Button, ButtonProps} from '../button'
import {Collapse} from '../transitionBase'
import {useTheme} from '../theme'
import {Icon} from '../icon'
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown'
import {faFilter} from '@fortawesome/free-solid-svg-icons/faFilter'
import {DivProps} from '../../types'

export interface CurdFilterableProps<F extends FormValue = FormValue> extends DivProps {
    columns?: CurdBaseProps<any, F>['columns']
    /**
     * 筛选项是否可收起与展开。若开启此功能，至少保证第一行每项的高度一致，否则可能出现样式问题
     */
    expandable?: boolean
    /** 是否显示"筛选"按钮，默认为`true`
     * @enum true onFilter只会在点击按钮时触发
     * @enum false 每次触发onChange的同时会触发onFilter
     */
    showButton?: boolean
    /** 渲染已生效的筛选条件 */
    renderFilterConditions?(filterValue: F, formInstance: FormRef<F>): ReactNode
    buttonProps?: ButtonProps
}

export const CurdFilterable = memo(<F extends FormValue>({
    columns,
    expandable,
    showButton = true,
    renderFilterConditions,
    buttonProps,
    ...props
}: CurdFilterableProps<F>) => {
    const {spacing} = useTheme()

    const items = useMemo(() => {
        return columnsToFilterItem(columns)
    }, [columns])

    /**
     * --------------------------------------------------------------
     * 收起与展开
     */

    const firstItemRef = useRef<HTMLDivElement>(null)

    const [expanded, setExpanded] = useState(false)

    const renderedGrid = (
        <Grid className={classes.filterGrid} columnGap={spacing[8]}>
            {items?.map((item, i) => {
                return isValidElement(item)
                    ? item
                    : <FormItem
                        span={{xs: 12, md: 6, lg: 4}}
                        variant="grid"
                        {...item}
                        key={item.key ?? i}
                        wrapperRef={!i ? firstItemRef : void 0}
                    />
            })}
        </Grid>
    )

    /**
     * --------------------------------------------------------------
     * 触发筛选
     */

    const {formRef} = useFormContext<F>()

    const filterButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        buttonProps?.onClick?.(e)
        formRef!.current!.submit().then()
    }

    const _expandable = expandable && items && items.length > 1

    return (
        <>
            <div {...props} className={clsx(classes.filter, props.className)}>
                {!!items?.length &&
                    <>
                        {_expandable
                            ? <Collapse
                                className={classes.filterGridContainer}
                                in={expanded}
                                collapsedSize={() => firstItemRef.current?.offsetHeight || 50}
                                appear={false}
                            >
                                {renderedGrid}
                            </Collapse>
                            : renderedGrid
                        }
                        {(_expandable || showButton) &&
                            <div className={classes.filterControl}>
                                {_expandable &&
                                    <Button
                                        variant="text"
                                        suffix={
                                            <Icon
                                                icon={faChevronDown}
                                                style={{rotate: expanded ? '180deg' : void 0}}
                                            />
                                        }
                                        onClick={() => setExpanded(o => !o)}
                                    >
                                        {expanded ? '收起' : '展开'}
                                    </Button>
                                }
                                {showButton &&
                                    <Button
                                        prefix={<Icon icon={faFilter}/>}
                                        variant="outlined"
                                        {...buttonProps}
                                        onClick={filterButtonClick}
                                    >
                                        {buttonProps?.children ?? '筛选'}
                                    </Button>
                                }
                            </div>
                        }
                    </>
                }
            </div>
            <FilterConditions<F> renderFilterConditions={renderFilterConditions}/>
        </>
    )
}) as <F extends FormValue = FormValue>(props: CurdFilterableProps<F>) => ReactElement

const FilterConditions = memo(<F extends FormValue>({renderFilterConditions}: Pick<CurdFilterableProps<F>, 'renderFilterConditions'>) => {
    const {formRef} = useFormContext<F>()
    const {formValue} = useFormValueContext<F>()

    const filterConditions = renderFilterConditions?.(formValue!, formRef!.current!)

    return !isUnset(filterConditions) &&
        <div className={classes.filtered}>
            <div className={classes.filteredTitle}>已筛选：</div>
            <div className={classes.filteredContent}>
                {filterConditions}
            </div>
        </div>
}) as <F extends FormValue = FormValue>({renderFilterConditions}: Pick<CurdFilterableProps<F>, 'renderFilterConditions'>) => ReactElement