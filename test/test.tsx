import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree} from '../src'
import React, {ReactNode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'

const Root = RC(() => {
    const state = useReactive({
        hasPermission: false
    })

    return (
        <>
            <Upload type="image" sortable/>
            <Tree
                searchable
                sortable
                nodes={[
                    {
                        id: '1',
                        label: '节点1',
                        children: [
                            {
                                id: '1-1',
                                label: '节点1-1'
                            }
                        ]
                    },
                    {
                        id: '2',
                        label: '节点2',
                        children: [
                            {
                                id: '2-1',
                                label: '节点2-1'
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
                padding: 24
            }}
        >
            <Root/>
        </App>
    </>
)
