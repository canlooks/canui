import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect, ColorPicker, Palette, Tooltip, Dialog, Calendar, Gallery, Image, Pinchable, ContextMenu, useAppContext, Select, TreeSelect, Typography, Accordion, useDraggable, OptionsBase, useFlatSelection, usePopperContext, useFormContext, Autocomplete, Input, Tabs, Flex, TouchRipple, Slide, Fade, Grow, DataGrid, Skeleton, Form, FormRef, DateTimePicker, useLoading, DateTimeRangePicker, Popper, TableContainer} from '../src'
import React, {Activity, cloneElement, ReactNode, Ref, StrictMode, useDeferredValue, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import {Chip, RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {Id} from '../src/types'
import {reactive} from '@canlooks/reactive'
import dayjs from 'dayjs'

function useInlineFilter({value, onChange}: {
    value?: string
    onChange?(value: string): void
}): [string, (key: string) => void] {
    const [selectedValue, toggleSelect] = useFlatSelection({value, onChange})

    const {setOpen} = usePopperContext()

    const {formRef} = useFormContext()

    return [
        selectedValue,
        (key: string) => {
            toggleSelect(key)
            setOpen(false)
            formRef?.current?.submit()
        }
    ]
}

const InlineSelect = ({value, onChange}: {
    value?: string
    onChange?(value: string): void
}) => {
    const [selectedValue, onToggleSelected] = useInlineFilter({value, onChange})

    return (
        <OptionsBase
            options={[
                {value: '1', label: '选项1'},
            ]}
            selectedValue={selectedValue}
            onToggleSelected={onToggleSelected}
        />
    )
}

const Root = RC(() => {
    const state = useReactive({
        open: false
    })

    return (
        <>
            <Curd
                columns={[
                    {
                        title: 'Name',
                        field: 'name',
                        filterInline: {
                            control: <InlineSelect/>
                        }
                    }
                ]}
                loadRows={(p, filterValue) => {
                    console.log(66, filterValue)
                    return {rows: [], total: 0}
                }}
            />
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