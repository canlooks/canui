import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Button, Curd, DataGrid, Dialog, FormItem, Icon, Segmented, Select, SerialInput, Table, TableContainer, TouchRipple} from '../src'
import {DateTimePicker} from '../src/components/dateTimePicker'
import React from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {Input} from '../src'
import {faPassport} from '@fortawesome/free-solid-svg-icons'
import {PowerTable} from './powerTable/powerTable'

const Root = RC(() => {
    const [open, setOpen] = React.useState<boolean>(false)

    return (
        <>
            <button onClick={() => setOpen(true)}>button</button>
            <Dialog open={open} onClose={() => setOpen(false)} scrollBehavior="card">
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
                <h1>123</h1>
            </Dialog>
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
