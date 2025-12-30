import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image} from '../src'
import React, {cloneElement, ReactNode, StrictMode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'

const Root = RC(() => {

    return (
        <>
            <Image.Gallery
                open
                src={[
                    'http://localhost:3000/image/d0a68ee3-64ef-4c0e-9cb8-d973dd545dbc',
                    'http://localhost:3000/image/c772967e-ff74-4b9b-8d7a-6a686409a951'
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
            theme={{
                easing: {
                    // bounce: 'ease-out'
                }
            }}
            style={{
                height: '100vh',
                padding: 24,
            }}
        >
            <Root/>
        </App>
    </>
)
