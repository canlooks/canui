import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, Button, Collapse, defaultSensors, onDndDragEnd} from '../src'
import React, {StrictMode, useState} from 'react'
import {RC} from '@canlooks/reactive/react'
import {useSortable} from '@dnd-kit/react/sortable'
import {DragDropProvider} from '@dnd-kit/react'
import {DragDropEvents} from '@dnd-kit/abstract'
import {TransitionGroup} from 'react-transition-group'

function Sortable({id, index, ...props}: any) {
    const {ref} = useSortable({id, index})

    return (
        <Collapse {...props} ref={ref} component="li">
            {/*<li className="item">Item {id}</li>*/}
            Item {id}
        </Collapse>
    )
}

const Root = RC(() => {
    const [items, setItems] = useState([1, 2, 3, 4])

    const dragEndHandler: DragDropEvents<any, any, any>['dragend'] = e => {
        const newValue = onDndDragEnd(e, items)
        newValue && setItems(newValue)
    }

    return (
        <>
            <Button onClick={() => setItems([1, 2, 3, 4])}>Reset</Button>
            <DragDropProvider sensors={defaultSensors} onDragEnd={dragEndHandler}>
                <TransitionGroup component="ul">
                    {items.map((id, index) =>
                        <Sortable key={id} id={id} index={index}/>
                    )}
                </TransitionGroup>
            </DragDropProvider>
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

