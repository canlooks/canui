import {memo} from 'react'
import {SnackbarBase, SnackbarBaseProps} from '../snackbarBase'
import {SnackbarBaseMethods} from '../snackbarBase'
import {CornerPlacement} from '../../types'

export interface AppNotificationProps extends Omit<SnackbarBaseProps, 'placement'> {
    placement?: CornerPlacement
}

export class AppNotificationMethods<P extends AppNotificationProps = AppNotificationProps> extends SnackbarBaseMethods<P> {}

export const AppNotification = memo(({methods}: {methods: AppNotificationMethods}) => {
    return (
        <SnackbarBase
            methods={methods}
            useTo="notification"
        />
    )
})