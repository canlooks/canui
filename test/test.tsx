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
            <DataGrid
                style={{
                    height: '100%'
                }}
                // slotProps={{
                //     container: {
                //         style: {
                //             height: '100%'
                //         }
                //     }
                // }}
                childrenKey="children"
                columns={[
                    {
                        title: 'Name',
                        field: 'name'
                    },
                    {
                        title: 'Sex',
                        field: 'sex'
                    }
                ]}
                rows={Array(12).fill(void 0).map((_, i) => (
                    {
                        id: i,
                        name: 'Zhang San',
                        sex: 'Male',
                        children: i === 2
                            ? () => (
                                <div style={{height: 400, background: 'pink'}}/>
                            )
                            : i === 3
                                ? () => (
                                    <div style={{height: 200, background: 'blue'}}/>
                                )
                                : void 0
                    }
                ))}
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

