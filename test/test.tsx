import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip} from '../src'
import React, {ReactNode, StrictMode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'

const Root = RC(() => {

    return (
        <>
            {/*<Bubble*/}
            {/*    content="This is A Bubble"*/}
            {/*>*/}
            {/*    <Button>Button1</Button>*/}
            {/*</Bubble>*/}
            <Bubble
                content={
                    <>
                        <ColorPicker/>
                    </>
                }
            >
                <Button>Button2</Button>
            </Bubble>
            {/*<ColorPicker/>*/}
            {/*<Palette/>*/}
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
