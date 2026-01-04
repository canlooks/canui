import {ReactNode} from 'react'
import EmotionProvider from './emotion.provider'
import {cookies} from 'next/headers'

export default async function AppLayout({children}: {
    children: ReactNode
}) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    console.log('AuthenticationLayout', token)

    return (
        <html style={{fontSize: 14}}>
        <body style={{margin: 0}}>
        <EmotionProvider>
            {children}
        </EmotionProvider>
        </body>
        </html>
    )
}