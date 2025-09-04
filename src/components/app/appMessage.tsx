import {memo} from 'react'
import {SnackbarBase, SnackbarBaseProps} from '../snackbarBase'
import {SnackbarBaseMethods} from '../snackbarBase'

export class AppMessageMethods<P extends SnackbarBaseProps = SnackbarBaseProps> extends SnackbarBaseMethods<P> {}

export const AppMessage = memo(({methods}: {methods: AppMessageMethods}) => {
    return (
        <SnackbarBase
            methods={methods}
            useTo="message"
        />
    )
})