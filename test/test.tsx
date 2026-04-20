import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image, Pinchable, ContextMenu, useAppContext, Select, TreeSelect, Typography, Accordion, useDraggable, OptionsBase, useFlatSelection, usePopperContext, useFormContext, Autocomplete, Input, Tabs, Flex, TouchRipple, Slide, Fade, Grow, DataGrid, Skeleton, Form, FormRef, DateTimePicker, useLoading} from '../src'
import React, {Activity, cloneElement, ReactNode, Ref, StrictMode, useDeferredValue, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import {Chip, RC, useReactive} from '@canlooks/reactive/react'
import {RF} from '../src/extensions/reactiveForm'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {Id} from '../src/types'
import {reactive} from '@canlooks/reactive'
import dayjs from 'dayjs'

const Child = RC(() => {
    const [loading, load] = useLoading(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
    })

    return (
        <>
            <Button onClick={load}>Button</Button>
            {loading.current &&
                <h1>Loading...</h1>
            }
        </>
    )
})

const Root = RC(() => {
    const state = useReactive({
        visible: true
    })

    return (
        <>
            <Button onClick={() => state.visible = !state.visible}>Toggle Visible</Button>
            <Activity mode={state.visible ? 'visible' : 'hidden'}>
                <Child/>
            </Activity>
        </>
    )
})

createRoot(document.getElementById('app')!).render(
    <StrictMode>
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
    </StrictMode>
)
