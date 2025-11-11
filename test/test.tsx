import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Button, Curd, DataGrid, Dialog, Drawer, Flex, FormItem, Icon, onTreeNodeSort, Segmented, Select, SerialInput, SortInfo, Table, TableContainer, TouchRipple, Tree, TreeSelect, Typography} from '../src'
import {DateTimePicker} from '../src/components/dateTimePicker'
import React, {useState} from 'react'
import {RC, useLoading, useReactive} from '@canlooks/reactive/react'
import {Input} from '../src'
import {faPassport} from '@fortawesome/free-solid-svg-icons'
import {PowerTable} from './powerTable/powerTable'
import {Dayjs} from 'dayjs'

const Root = RC(() => {
    const onReload = useLoading(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
    })

    return (
        <>
            <Button>Button</Button>
            <Button variant="outlined">Button</Button>
            <pre>123456.7089</pre>
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
