import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Button, Curd, CurdColumn, Dialog, Input, Radio, SerialInput} from '../src'
import React, {useRef} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'

const columns: CurdColumn[] = [
    {
        title: '姓名',
        filterInline: {
            options: [
                {
                    value: '1',
                    label: '选项1'
                }
            ]
        }
    }
]

const Root = RC(() => {
    return (
        <>
            <Curd
                columns={columns}
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
