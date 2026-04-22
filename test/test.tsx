import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image, Pinchable, ContextMenu, useAppContext, Select, TreeSelect, Typography, Accordion, useDraggable, OptionsBase, useFlatSelection, usePopperContext, useFormContext, Autocomplete, Input, Tabs, Flex, TouchRipple, Slide, Fade, Grow, DataGrid, Skeleton, Form, FormRef, DateTimePicker, useLoading, DateTimeRangePicker, Popper} from '../src'
import React, {Activity, cloneElement, ReactNode, Ref, StrictMode, useDeferredValue, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import {Chip, RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {Id} from '../src/types'
import {reactive} from '@canlooks/reactive'
import dayjs from 'dayjs'

const Root = RC(() => {
    const state = useReactive({
        open: false
    })

    return (
        <>
            <Select multiple options={[
                {value: '1', label: '1'},
                {value: '2', label: '2'},
            ]}/>
            <DateTimePicker autoClose={false}/>
            <DateTimeRangePicker/>
            {/*<Select/>*/}
            {/*<Bubble*/}
            {/*    open={state.open}*/}
            {/*    onOpenChange={open => {*/}
            {/*        state.open = open*/}
            {/*    }}*/}
            {/*    content="123"*/}
            {/*>*/}
            {/*    <Button>Button</Button>*/}
            {/*</Bubble>*/}
            {/*<Button onClick={() => state.open = !state.open}>Toggle Open</Button>*/}
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
