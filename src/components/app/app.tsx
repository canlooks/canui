import {createContext, ElementType, useContext} from 'react'
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

export type AppMethods = {
    dialog: AppDialogMethods
    message: AppMessageMethods
    notification: AppNotificationMethods
    actionSheet: AppActionSheetMethods
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
) as OverridableComponent<AppOwnProps> & AppMethods

export function InnerApp({
    component: Component = 'div',
    theme,
    children,
    fill = true,
    ...props
}: OverridableProps<AppProps, 'div'>) {
    const appContext = useAppContext()

    App.dialog = appContext.dialog
    App.message = appContext.message
    App.notification = appContext.notification
    App.actionSheet = appContext.actionSheet

    return (
        <AppContext value={appContext}>
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
            <AppDialog methods={appContext.dialog}/>
            <AppMessage methods={appContext.message}/>
            <AppNotification methods={appContext.notification}/>
            <AppActionSheet methods={appContext.actionSheet}/>
        </AppContext>
    )
}