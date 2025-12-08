import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder} from '../src'
import React, {ReactNode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'

const Root = RC(() => {
    const state = useReactive({
        hasPermission: false
    })

    return (
        <>
            <Button onClick={() => state.hasPermission = !state.hasPermission}>Button</Button>
            <Curd
                columns={[
                    {
                        title: 'Name',
                        field: 'name'
                    }
                ]}
                rows={[
                    {id: 1, name: '张三'}
                ]}

                creatable={state.hasPermission}
                updatable={state.hasPermission}
                deletable={state.hasPermission}
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
