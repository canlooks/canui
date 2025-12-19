import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Upload, Bubble, Button, Card, Curd, Deferred, Icon, imagePreset, LoadingIndicator, Placeholder, Tree, Loading, sortTreeNodes, Collapse, useUpdateEffect, useStrictEffect} from '../src'
import React, {ReactNode, StrictMode, useDeferredValue, useEffect, useMemo, useState} from 'react'
import {RC, useReactive} from '@canlooks/reactive/react'
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons'

const Root = RC(() => {
    const state = useReactive({
        treeNodes: [
            {
                id: '1',
                label: '1'
            },
            {
                id: '2',
                label: '2'
            },
            {
                id: '3',
                label: '3'
            }
        ],
        in: true
    })

    // useEffect(() => {
    //     console.log('useEffect')
    //     // App.message.success('Test')
    // }, [])
    //
    useStrictEffect(() => {
        console.log('useStrictEffect')
    }, [])
    //
    useUpdateEffect(() => {
        console.log('useUpdateEffect')
    })

    return (
        <>
            {/*<Collapse in={state.in}>*/}
            {/*    <div style={{height: 200, background: 'pink'}}/>*/}
            {/*</Collapse>*/}
            {/*<Tree*/}
            {/*    nodes={state.treeNodes}*/}
            {/*    sortable*/}
            {/*    onSort={info => {*/}
            {/*        state.treeNodes = sortTreeNodes({*/}
            {/*            nodes: state.treeNodes*/}
            {/*        }, info)*/}
            {/*        console.log(state.treeNodes)*/}
            {/*    }}*/}
            {/*/>*/}
            <Button onClick={() => state.in = !state.in}>Button</Button>
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
            // theme={{mode: 'dark'}}
            style={{
                height: '100vh',
                padding: 24
            }}
        >
            <Root/>
        </App>
    </StrictMode>
)
