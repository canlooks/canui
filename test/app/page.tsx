'use client'

import {Button, Card, Descriptions, Flex, Form, Icon, Input, Loading, TouchRipple} from '../../src'
import {useState} from 'react'
import {faUser} from '@fortawesome/free-solid-svg-icons'

import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

export default function AppPage() {
    const [open, setOpen] = useState(false)

    return (
        <div style={{height: '50vh'}}>
            <Card style={{position: 'relative', background: 'pink', overflow: 'hidden'}}>
                123
                <TouchRipple/>
            </Card>
        </div>
    )
}