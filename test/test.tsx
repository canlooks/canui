import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, FormRef, Input, Select, SerialInput} from '../src'
import React, {useState} from 'react'
import {Chip, RC, useReactive} from '@canlooks/reactive/react'
import {RF} from '../src/extensions/reactiveForm'

const Root = RC(() => {
    const formValue = useReactive({
        msg: 'hello',
        obj: {
            a: 'world'
        }
    }, {deep: true})
    console.log('render')
    return (
        <>
            <SerialInput count={6} onChange={console.log} separator="-"/>
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
