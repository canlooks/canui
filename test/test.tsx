import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image, Pinchable, ContextMenu, useAppContext, Select, TreeSelect, Typography, Accordion, useDraggable, OptionsBase, useFlatSelection, usePopperContext, useFormContext, Autocomplete, Input, Tabs, Flex, TouchRipple, Slide, Fade, Grow, DataGrid, Skeleton, Form, FormRef, DateTimePicker, useLoading, DateTimeRangePicker, Popper, TableContainer, Radio, Cascade, MenuOptionType} from '../src'
import React, {Activity, cloneElement, ReactNode, Ref, StrictMode, useDeferredValue, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import {Chip, RC, useReactive} from '@canlooks/reactive/react'

const Root = RC(() => {
    const state = useReactive({
        options: [
            {
                value: '1', label: '选项1'
            }
        ] as MenuOptionType[]
    })

    return (
        <>
            <Button onClick={() => {
                state.options = [
                    {
                        value: '1', label: '选项1', children: [
                            {value: '1-1', label: '选项1-1'}
                        ]
                    }
                ]
            }}>
                Button
            </Button>
            <Button onClick={() => {
                state.options = [
                    {
                        value: '1', label: '选项1', children: [
                            {value: '1-1', label: '选项1-1', children: [
                                    {value: '1-1-1', label: '选项1-1-1'}
                                ]}
                        ]
                    }
                ]
            }}>
                Button
            </Button>
            <Cascade
                options={state.options}
            />
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

