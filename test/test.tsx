import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image, Pinchable, ContextMenu, useAppContext, Select, TreeSelect, Typography, Accordion, useDraggable, OptionsBase, useFlatSelection, usePopperContext, useFormContext, Autocomplete, Input, Tabs, Flex, TouchRipple, Slide} from '../src'
import React, {cloneElement, ReactNode, StrictMode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {Id} from '../src/types'

const Root = RC(() => {
    const state = useReactive({
        open: true
    })

    return (
        <>
            <Button onClick={() => state.open = !state.open}>Button</Button>
            <Collapse in={state.open} timeout={2000} collapsedSize={24}>
                <div style={{height: 500, background: 'pink'}}/>
            </Collapse>
            <Slide in={state.open} timeout={2000} direction="left">
                <div style={{height: 500, background: 'pink'}}/>
            </Slide>
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
            style={{
                height: '100vh',
                padding: 24
            }}
        >
            <Root/>
        </App>
    </>
)
