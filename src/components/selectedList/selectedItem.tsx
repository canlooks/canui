import {Alert, AlertProps} from '../alert'
import {Id} from '../../types'
import {clsx, useLoading, useSyncState} from '../../utils'
import React, {useMemo} from 'react'
import {Collapse} from '../transitionBase'
import {classes} from './selectedList.style'
import {SelectedListProps} from './selectedList'

interface SelectedItemProps extends Omit<AlertProps, 'onClose'>, Pick<SelectedListProps, 'itemProps'> {
    value: Id
    index: number
    itemProps?(value: Id, index: number): AlertProps | Promise<AlertProps>
    onClose?(value: Id, index: number): void
}

export function SelectedItem({
    value,
    index,
    itemProps,
    onClose,
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
        <Collapse {...props} className={classes.option}>
            <Alert
                closable
                color="info"
                showIcon={false}
                {...alertProps.current}
                className={clsx(classes.optionWrap, alertProps.current?.className)}
                onClose={closeHandler}
                loading={loading.current}
            />
        </Collapse>
    )
}