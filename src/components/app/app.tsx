import {createContext, ElementType, useContext, useMemo} from 'react'
import {OverridableComponent, OverridableProps} from '../../types'
import {clsx, defineCss} from '../../utils'
import {classes, style} from './app.style'
import {ThemeProvider, ThemeProviderProps} from '../theme'
import {AppDialog, AppDialogMethods} from './appDialog'
import {AppMessage, AppMessageMethods} from './appMessage'
import {AppNotification, AppNotificationMethods} from './appNotification'
import {AppActionSheet, AppActionSheetMethods} from './appActionSheet'
import {css} from '@emotion/react'
import {GlobalEventDelegation} from './globalEventDelegation'

export interface AppOwnProps extends ThemeProviderProps {
    fill?: boolean
}

export type AppProps<C extends ElementType = 'div'> = OverridableProps<AppOwnProps, C>

const AppContext = createContext({
    dialog: new AppDialogMethods(),
    message: new AppMessageMethods(),
    notification: new AppNotificationMethods(),
    actionSheet: new AppActionSheetMethods()
})

export function useAppContext() {
    return useContext(AppContext)
}

export const App = (
    ({
        theme,
        ...props
    }: AppProps) => {
        return (
            <GlobalEventDelegation>
                <ThemeProvider theme={theme}>
                    <InnerApp {...props}/>
                </ThemeProvider>
            </GlobalEventDelegation>
        )
    }
) as OverridableComponent<AppOwnProps> & {
    dialog: AppDialogMethods
    message: AppMessageMethods
    notification: AppNotificationMethods
    actionSheet: AppActionSheetMethods
}

export function InnerApp({
    component: Component = 'div',
    theme,
    children,
    fill = true,
    ...props
}: OverridableProps<AppProps, 'div'>) {
    const appValue = useMemo(() => ({
        dialog: App.dialog = new AppDialogMethods(),
        message: App.message = new AppMessageMethods(),
        notification: App.notification = new AppNotificationMethods(),
        actionSheet: App.actionSheet = new AppActionSheetMethods()
    }), [])

    return (
        <AppContext value={appValue}>
            {Component
                ? <Component
                    {...props}
                    css={[
                        style,
                        defineCss(({background}) => css`
                            background-color: ${background.body};
                        `),
                        fill && css`
                            width: 100%;
                            height: 100%;
                            flex: 1;
                        `
                    ]}
                    className={clsx(classes.root, props.className)}
                >
                    {children}
                </Component>
                : children
            }
            <AppDialog methods={appValue.dialog}/>
            <AppMessage methods={appValue.message}/>
            <AppNotification methods={appValue.notification}/>
            <AppActionSheet methods={appValue.actionSheet}/>
        </AppContext>
    )
}