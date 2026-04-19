import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image, Pinchable, ContextMenu, useAppContext, Select, TreeSelect, Typography, Accordion, useDraggable, OptionsBase, useFlatSelection, usePopperContext, useFormContext, Autocomplete, Input, Tabs, Flex, TouchRipple, Slide, Fade, Grow, DataGrid, Skeleton, Form, FormRef, DateTimePicker} from '../src'
import React, {cloneElement, ReactNode, Ref, StrictMode, useDeferredValue, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import {Chip, RC, useLoading, useReactive} from '@canlooks/reactive/react'
import {RF} from '../src/extensions/reactiveForm'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {Id} from '../src/types'
import {reactive} from '@canlooks/reactive'
import dayjs from 'dayjs'

const Root = RC(() => {
    const state = useReactive({
        format: 'YYYY年',
        value: dayjs()
    })

    return (
        <>
            <Button onClick={() => state.format = 'MM月'}>Button</Button>
            <Button onClick={() => state.value = dayjs()}>Button2</Button>
            <DateTimePicker value={state.value} onChange={d => state.value = d!} format={state.format}/>
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
