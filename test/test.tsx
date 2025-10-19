import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, FormItem, Icon, Segmented, SerialInput} from '../src'
import React from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {Input} from '../src'
import {faPassport} from '@fortawesome/free-solid-svg-icons'

const Root = RC(() => {
    return (
        <Segmented
            options={[
                {
                    value: 'app',
                    label: 'App',
                },
                {
                    value: 'form',
                    label: 'Form'
                }
            ]}
        />
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
