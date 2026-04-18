import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image, Pinchable, ContextMenu, useAppContext, Select, TreeSelect, Typography, Accordion, useDraggable, OptionsBase, useFlatSelection, usePopperContext, useFormContext, Autocomplete, Input, Tabs, Flex, TouchRipple, Slide, Fade, Grow, DataGrid, Skeleton, Form, FormRef} from '../src'
import React, {cloneElement, ReactNode, Ref, StrictMode, useDeferredValue, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import {Chip, RC, useLoading, useReactive} from '@canlooks/reactive/react'
import {RF} from '../src/extensions/reactiveForm'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {Id} from '../src/types'
import {reactive} from '@canlooks/reactive'

const Root = RC(() => {
    const state = useReactive({
        open: false,
        value: ''
    })

    const update = useLoading(async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
    })

    const formRef = useRef<FormRef>(null)

    return (
        <>
            <Button onClick={() => state.open = true}>Open</Button>
            <Chip.Strict>{() =>
                <Dialog
                    open={state.open}
                    onClose={reason => {
                        if (reason !== 'confirmed') {
                            state.open = false
                        }
                    }}
                    onConfirm={async () => {
                        await formRef.current!.submit()
                        await update.load()
                    }}
                    confirmLoading={update.loading}
                >
                    <RF ref={formRef}>
                        <RF.Item refer={() => state.value}>
                            <Input/>
                        </RF.Item>
                    </RF>
                </Dialog>
            }</Chip.Strict>
        </>
    )
})

const ValueCell = RC((props: {
    ref?: Ref<{ reload(): Promise<void> }>
    row: any
}) => {
    useImperativeHandle(props.ref, () => ({
        reload: () => reload.load()
    }))

    const reload = useLoading(async () => {
        props.row.state.value = await new Promise(resolve => setTimeout(() => {
            resolve('Ok')
        }, 100))
    })

    return reload.loading
        ? <Skeleton/>
        : <div>{props.row.state.value}</div>
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
