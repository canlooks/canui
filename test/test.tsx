import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Button, Curd, DataGrid, Dialog, FormItem, Icon, Segmented, Select, SerialInput, Table, TableContainer, TouchRipple, Tree} from '../src'
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
            <Tree
                sortable
                // showDragHandle={false}
                nodes={[
                    {
                        id: '1',
                        label: '1111111111',
                        children: [
                            {
                                id: '1-1',
                                label: '1111111111',
                            }
                        ]
                    }
                ]}
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
