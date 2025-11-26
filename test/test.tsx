import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Button, Card, Curd, CurdColumn, Dialog, Input, Radio, SerialInput, Tree, useTheme} from '../src'
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
    const {mode, update} = useTheme()

    return (
        <>
            <Card>
                <Button onClick={() => update({mode: mode === 'light' ? 'dark' : 'light'})}>Button</Button>
                <Tree
                    sortable
                    showDragHandle
                    nodes={[
                        {
                            id: '1',
                            label: '选项1'
                        },
                        {
                            id: '2',
                            label: '选项2',
                            children: [
                                {
                                    id: '2-2',
                                    label: '选项2-2',
                                }
                            ]
                        }
                    ]}
                />
            </Card>
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
            theme={{mode: 'dark'}}
            style={{
                height: '100vh',
                padding: 24
            }}
        >
            <Root/>
        </App>
    </>
)
