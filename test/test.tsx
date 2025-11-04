import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Button, Curd, DataGrid, Dialog, FormItem, Icon, Segmented, Select, SerialInput, Table, TableContainer, TouchRipple} from '../src'
import {DateTimePicker} from '../src/components/dateTimePicker'
import React, {useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {Input} from '../src'
import {faPassport} from '@fortawesome/free-solid-svg-icons'
import {PowerTable} from './powerTable/powerTable'
import {Dayjs} from 'dayjs'

const Root = RC(() => {
    const [value, setValue] = useState<Dayjs | null>(null)

    return (
        <>
            <DateTimePicker format="YYYY年MM月DD日 HH时" value={value} onChange={setValue}/>
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
