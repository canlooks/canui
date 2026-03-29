import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image, Pinchable, ContextMenu, useAppContext, Select, TreeSelect, Typography, Accordion, useDraggable, OptionsBase, useFlatSelection, usePopperContext, useFormContext, Autocomplete, Input, Tabs, Flex, TouchRipple} from '../src'
import React, {cloneElement, ReactNode, StrictMode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {Id} from '../src/types'

const Root = RC(() => {
    return (
        <>
            <Curd
                columns={[
                    {
                        field: 'v',
                        title: (
                            <Flex>
                                <div>当前值</div>
                                <span>?</span>
                            </Flex>
                        ),
                        titleText: '当前值'
                    }
                ]}
            />
            {/*<Tabs*/}
            {/*    sortable*/}
            {/*    tabs={[*/}
            {/*        {value: '1', label: '标签页1'},*/}
            {/*        {value: '2', label: '标签页2'},*/}
            {/*        {value: '3', label: '标签页3'}*/}
            {/*    ]}*/}
            {/*/>*/}
            {/*<Upload sortable type="image"/>*/}
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
