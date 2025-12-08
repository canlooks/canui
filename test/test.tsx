import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Bubble, Button, Card, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder} from '../src'
import React, {ReactNode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'

const Root = RC(() => {
    return (
        <Card>
            <Placeholder status="warning"/>
            <Placeholder status="success"/>
            <Placeholder status="error"/>
            <Placeholder status="searching"/>
            <Placeholder status="unknown" title="404"/>
        </Card>
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
