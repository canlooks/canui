import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, FormItem, SerialInput} from '../src'
import React from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {RF} from '../src/extensions/reactiveForm'

const Root = RC(() => {
    const formValue = useReactive({
        msg: 'hello',
        obj: {
            a: 'world'
        },
        serial: [1, 2, 3, 4, 5, 6]
    }, {deep: true})

    return (
        <>
            <RF.Item refer={() => formValue.serial}>
                <SerialInput count={6} onChange={console.log} separator="-"/>
            </RF.Item>
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
