import {ReactNode} from 'react'
import EmotionProvider from './emotion.provider'

export default function AppLayout({children}: {
    children: ReactNode
}) {
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