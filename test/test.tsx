import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image, Pinchable, ContextMenu, useAppContext, Select, TreeSelect, Typography, Accordion, useDraggable, OptionsBase, useFlatSelection, usePopperContext, useFormContext} from '../src'
import React, {cloneElement, ReactNode, StrictMode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {Id} from '../src/types'

const TestControl = ({value, onChange}: {
    value?: string
    onChange?(value: string): void
}) => {
    const [selectedValue, toggleSelect] = useFlatSelection({value, onChange})

    return (
        <OptionsBase
            options={[
                {value: 'test1', label: 'test1'},
                {value: 'test2', label: 'test2'},
            ]}
            selectedValue={selectedValue}
            onToggleSelected={value => {
                toggleSelect(value)
            }}
        />
    )
}

const Root = RC(() => {

    return (
        <>
            <Curd
                columns={[
                    {
                        field: 'test',
                        filterInline: {
                            // control: <TestControl/>,
                            multiple: false,
                            searchable: true,
                            options: [
                                {value: 'test1', label: 'test1'},
                                {value: 'test2', label: 'test2'},
                            ]
                        }
                    }
                ]}
                loadRows={(pagination, filterValue, sorter) => {
                    console.log('filterValue', filterValue)
                    return {
                        rows: [],
                        total: 0
                    }
                }}
                // filterBubbleProps={{autoClose: true}}
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
