import {Alert, AlertProps} from '../alert'
import {Id} from '../../types'
import {clsx, useLoading, useSyncState} from '../../utils'
import React, {useMemo} from 'react'
import {classes} from './selectedList.style'
import {SortableItem} from '../sortableItem'

interface SelectedItemProps extends Omit<AlertProps, 'onClose'> {
    value: Id
    index: number
    itemProps?(value: Id, index: number): AlertProps | Promise<AlertProps>
    onClose?(value: Id, index: number): void
    sortable?: boolean
}

export function SelectedItem({
    value,
    index,
    itemProps,
    onClose,
    sortable,
    ...props
}: SelectedItemProps) {
    const [alertProps, setAlertProps] = useSyncState<AlertProps>()

    const [loading, requestFn] = useLoading(async () => {
        itemProps && setAlertProps(
            await itemProps(value, index)
        )
    })

    useMemo(requestFn, []).then()

    const closeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        alertProps.current?.onClose?.(e)
        onClose?.(value, index)
    }

    return (
        <SortableItem
            component={Alert}
            id={value}
            index={index}
            closable
            color="info"
            showIcon={false}
            {...props}
            {...alertProps.current}
            className={clsx(classes.optionWrap, alertProps.current?.className)}
            onClose={closeHandler}
            loading={loading.current}
        />
    )
}