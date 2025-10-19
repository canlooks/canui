import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, FormItem, Icon, Segmented, SerialInput, TouchRipple} from '../src'
import React from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {Input} from '../src'
import {faPassport} from '@fortawesome/free-solid-svg-icons'

const Root = RC(() => {
    return (
        <div style={{
            height: 300,
            marginTop: 2000,
            background: 'pink',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <TouchRipple/>
        </div>
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
            theme={{mode: 'dark'}}
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
