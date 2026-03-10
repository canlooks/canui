import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image, Pinchable, ContextMenu, useAppContext, Select, TreeSelect, Typography, Accordion, useDraggable, OptionsBase, useFlatSelection, usePopperContext, useFormContext, Autocomplete, Input, Tabs, Flex, TouchRipple} from '../src'
import React, {cloneElement, ReactNode, StrictMode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {Id} from '../src/types'

const Root = RC(() => {
    const state = useReactive({
        activeTab: '1' as Id,
        tabs: [
            {
                prefix: 'A', value: '1', label: '标签1', suffix: 'suffix', closable: true, onClose: () => {
                    state.tabs.splice(0, 1)
                    state.tabs = [...state.tabs]
                }
            },
            {value: '2', label: '标签2'},
            {value: '3', label: '标签3'}
        ],
        in: true
    })

    return (
        <Flex direction="column" gap={24}>
            <Collapse in={state.in}>
                <div style={{height: 400, background: 'pink'}}/>
            </Collapse>
            <Button onClick={() => state.in = !state.in}>Button</Button>
        </Flex>
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
