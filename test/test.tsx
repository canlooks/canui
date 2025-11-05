import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Button, Curd, DataGrid, Dialog, Drawer, FormItem, Icon, Segmented, Select, SerialInput, Table, TableContainer, TouchRipple, TreeSelect, Typography} from '../src'
import {DateTimePicker} from '../src/components/dateTimePicker'
import React, {useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {Input} from '../src'
import {faPassport} from '@fortawesome/free-solid-svg-icons'
import {PowerTable} from './powerTable/powerTable'
import {Dayjs} from 'dayjs'

const Root = RC(() => {
    const [value, setValue] = useState()

    return (
        <>
            <Drawer
                open
            >
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
            </Drawer>
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
