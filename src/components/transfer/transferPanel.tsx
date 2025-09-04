import {ReactElement, ReactNode, memo, useMemo} from 'react'
import {classes} from './transfer.style'
import {Checkbox} from '../checkbox'
import {DivProps, Id} from '../../types'
import {useTransferContext} from './transfer'
import {MenuOptionType, OptionsBase, OptionsBaseProps} from '../optionsBase'

type ListProps<O extends MenuOptionType<V>, V extends Id = Id> = Pick<OptionsBaseProps<O, V>, 'options' | 'selectedValue' | 'primaryKey' | 'onToggleSelected'>

export interface TransferPanelProps<O extends MenuOptionType<V>, V extends Id = Id> extends Omit<DivProps, 'title' | 'onChange'> {
    title?: ReactNode
    type?: 'left' | 'right'
    selectedValue?: V[]
    onChange?(selectedValue: V[]): void
    /** 自定义渲染列表 */
    renderList?(listProps: ListProps<O, V>): ReactNode
    /** 自定义渲染每一项，仅未指定renderList时生效 */
    renderItem?(item: O, index: number, listProps: ListProps<O, V>): ReactNode
}

export const TransferPanel = memo(<O extends MenuOptionType<V>, V extends Id = Id>({
    title,
    type = 'left',
    selectedValue,
    onChange,
    renderList,
    renderItem,
    ...props
}: TransferPanelProps<O, V>) => {
    selectedValue ||= []

    const {
        options,
        primaryKey,
        value,
        allowSelectAll,
        showHeader
    } = useTransferContext<O, V>()

    const selfOptions = useMemo(() => {
        const valueSet = new Set(value)
        return options.filter(o => {
            const has = valueSet.has(o[primaryKey])
            return type === 'left' ? !has : has
        })
    }, [value, options, primaryKey, type])

    const onToggleSelected = (value: V) => {
        onChange?.(selectedValue.includes(value)
            ? selectedValue.filter(v => v !== value)
            : [...selectedValue, value]
        )
    }

    const toggleAllHandler = () => {
        onChange?.(selfOptions.length && selfOptions.length === selectedValue.length
            ? []
            : selfOptions.map(v => v[primaryKey])
        )
    }

    const renderedList = (() => {
        const listProps: ListProps<O, V> = {
            options: selfOptions,
            selectedValue,
            primaryKey,
            onToggleSelected
        }
        if (renderList) {
            return renderList(listProps)
        }
        if (renderItem) {
            return selfOptions.map((item, index) => renderItem(item, index, listProps))
        }
        return <OptionsBase {...listProps} showCheckbox />
    })()

    return (
        <div {...props} className={classes.panel}>
            {showHeader &&
                <div className={classes.header}>
                    {allowSelectAll &&
                        <div className={classes.checkbox}>
                            <Checkbox
                                disabled={!selfOptions.length}
                                checked={!!selfOptions.length && selfOptions.length === selectedValue.length}
                                indeterminate={!!selectedValue.length && selectedValue.length < selfOptions.length}
                                onChange={toggleAllHandler}
                            />
                        </div>
                    }
                    <div className={classes.title}>{title}</div>
                    <small className={classes.count}>
                        {selectedValue.length} / {selfOptions.length}
                    </small>
                </div>
            }
            {!!renderedList &&
                <div className={classes.list}>
                    {renderedList}
                </div>
            }
        </div>
    )
}) as <O extends MenuOptionType<V>, V extends Id = Id>(props: TransferPanelProps<O, V>) => ReactElement