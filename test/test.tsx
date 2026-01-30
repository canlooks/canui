import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image, Pinchable, ContextMenu, useAppContext, Select, TreeSelect, Typography, Accordion} from '../src'
import React, {cloneElement, ReactNode, StrictMode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {Id} from '../src/types'

const Root = RC(() => {
    const state = useReactive({
        value: ['1'] as Id[]
        // value: '1'
    })

    return (
        <>
            <Accordion title="title">
                <Typography.div copyable editable ellipsisRows={1}>abcd</Typography.div>
            </Accordion>
            <Select
                multiple
                options={[
                    {
                        value: '1', label: '选项1'
                    },
                    {value: '2', label: '选项2'}
                ]}
                value={state.value}
                onChange={v => state.value = v}
            />
            <TreeSelect
                multiple
                options={[
                    {
                        value: '1', label: '选项1', children: [
                            {value: '1-1', label: '选项1-1'},
                            {value: '1-2', label: '选项1-2'}
                        ]
                    },
                    {value: '2', label: '选项2'}
                ]}
                value={state.value}
                onChange={v => state.value = v}
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
                padding: 24
            }}
        >
            <Root/>
        </App>
    </>
)
