import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Button, Curd, DataGrid, Dialog, Drawer, FormItem, Icon, onTreeNodeSort, Segmented, Select, SerialInput, SortInfo, Table, TableContainer, TouchRipple, Tree, TreeSelect, Typography} from '../src'
import {DateTimePicker} from '../src/components/dateTimePicker'
import React, {useState} from 'react'
import {RC, useLoading, useReactive} from '@canlooks/reactive/react'
import {Input} from '../src'
import {faPassport} from '@fortawesome/free-solid-svg-icons'
import {PowerTable} from './powerTable/powerTable'
import {Dayjs} from 'dayjs'

const defaultNodes = [
    {
        id: '1',
        label: '节点1'
    },
    {
        id: '2',
        label: '节点2'
    },
    {
        id: '3',
        label: '节点3',
        children: [
            {
                id: '3-1',
                label: '节点3-1'
            },
            {
                id: '3-2',
                label: '节点3-2',
                children: [
                    {
                        id: '3-2-1',
                        label: '节点3-2-1'
                    },
                    {
                        id: '3-2-2',
                        label: '节点3-2-2'
                    },
                    {
                        id: '3-2-3',
                        label: '节点3-2-3'
                    }
                ]
            },
            {
                id: '3-3',
                label: '节点3-3'
            },
            {
                id: '3-4',
                label: '节点3-4'
            }
        ]
    },
    {
        id: '4',
        label: '节点4'
    }
]

const Root = RC(() => {
    const onReload = useLoading(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
    })

    return (
        <>
            <Curd
                loading={onReload.loading}
                onReload={onReload.load}
            />
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
