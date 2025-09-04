import {memo, ReactElement} from 'react'
import {Select, SelectSingleProps} from '../select'
import {usePaginationContext} from './pagination'
import {MenuOptionType} from '../optionsBase'
import {clsx} from '../../utils'
import {classes} from './pagination.style'
import {Id} from '../../types'

export type PaginationSizerProps<O extends MenuOptionType, V extends Id = Id> = SelectSingleProps<O, V>

const defaultSizerOptions = [
    {value: 10, label: '10 条/页'},
    {value: 20, label: '20 条/页'},
    {value: 50, label: '50 条/页'},
    {value: 100, label: '100 条/页'}
]

export const PaginationSizer = memo(<O extends MenuOptionType, V extends Id = Id>(props: PaginationSizerProps<O, V>) => {
    const {size, pageSize, onPageSizeChange} = usePaginationContext()

    return (
        <Select
            size={size}
            value={pageSize}
            onChange={onPageSizeChange}
            renderBackfill={v => v + ' 条/页'}
            sizeAdaptable={false}
            options={defaultSizerOptions as O[]}
            {...props}
            className={clsx(classes.sizer, props.className)}
        />
    )
}) as <O extends MenuOptionType, V extends Id = Id>(props: PaginationSizerProps<O, V>) => ReactElement