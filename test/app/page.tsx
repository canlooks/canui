'use client'

import {Button, Loading} from '../../src'
import {useState} from 'react'

export default function AppPage() {
    const [open, setOpen] = useState(false)

    return (
        <div style={{height: '50vh'}}>
            <Loading open={open}>
                <div>test loading</div>
            </Loading>
            <Button onClick={() => setOpen(!open)}>Button</Button>
        </div>
    )
}