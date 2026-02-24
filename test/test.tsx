import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image, Pinchable, ContextMenu, useAppContext, Select, TreeSelect, Typography, Accordion, useDraggable, OptionsBase, useFlatSelection, usePopperContext, useFormContext} from '../src'
import React, {cloneElement, ReactNode, StrictMode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {Id} from '../src/types'

const Root = RC(() => {
    const onClick = () => {
        App.dialog.confirm({
            title: 'Confirm',
            content: 'Are you sure?',
            onConfirm: () => {
                App.dialog.success({
                    title: 'success',
                    content: 'Yes',
                })
            }
        })
    }

    return (
        <>
            <Button onClick={onClick}>
                Button
            </Button>
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
