import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Bubble, Button, Deferred, Icon, LoadingIndicator} from '../src'
import React, {ReactNode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'

const Root = RC(() => {
    return (
        <>
            <h1>123</h1>
            <Bubble content="123">
                <Button variant="plain">
                    <Icon icon={faInfoCircle}/>
                </Button>
            </Bubble>
            <Bubble content="123">
                <Button>
                    <Icon icon={faInfoCircle}/>
                </Button>
            </Bubble>
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
