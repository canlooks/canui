import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Button, Radio} from '../src'
import React, {useRef} from 'react'
import {RC} from '@canlooks/reactive/react'

const Root = RC(() => {
    const ref = useRef<any>(null)

    return (
        <>
            <Radio.Group options={[
                {
                    value: '1',
                    label: '同意'
                },
                {
                    value: '2',
                    label: '拒绝'
                }
            ]}/>
        </>
    )
})

createRoot(document.getElementById('app')!).render(
    <>
        <Global styles={css`
            html, body, #app {
                margin: 0;
            }
        `}/>
        <App
            // theme={{mode: 'dark'}}
            style={{
                height: '100vh',
                padding: 24,
                background: 'white'
            }}
        >
            <Root/>
        </App>
    </>
)
