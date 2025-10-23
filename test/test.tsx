import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Curd, DataGrid, Dialog, FormItem, Icon, Segmented, Select, SerialInput, Table, TableContainer, TouchRipple} from '../src'
import {DateTimePicker} from '../src/components/dateTimePicker'
import React from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {Input} from '../src'
import {faPassport} from '@fortawesome/free-solid-svg-icons'
import {PowerTable} from './powerTable/powerTable'

const Root = RC(() => {
    return (
        <Select
            value=""
            options={[
                {
                    label: '选项1',
                    value: '1'
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
