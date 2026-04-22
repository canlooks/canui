'use client'

import {Button, Card, Descriptions, Flex, Form, Icon, Input, Loading, TouchRipple} from '../../src'
import {useState} from 'react'
import {faUser} from '@fortawesome/free-solid-svg-icons'
import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import {createPortal} from 'react-dom'

config.autoAddCss = false

export default function AppPage() {
    const [open, setOpen] = useState(false)

    return (
        <div>
            {typeof document !== 'undefined' && createPortal(<div>In Portal</div>, document.body)}
        </div>
    )
}