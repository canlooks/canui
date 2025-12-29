import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog} from '../src'
import React, {cloneElement, ReactNode, StrictMode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'

const Root = RC(() => {
    const state = useReactive({
        open: false
    })

    return (
        <>
            <Child>
                <div className="a">123</div>
            </Child>
        </>
    )
})

function Child(props: {
    children: ReactNode
}) {
    return cloneElement(props.children, {
        className: props.children!.props.className + ' b'
    })
}

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
