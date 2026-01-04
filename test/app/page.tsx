'use client'

import {Button, Descriptions, Flex, Form, Icon, Input, Loading} from '../../src'
import {useState} from 'react'
import {faUser} from '@fortawesome/free-solid-svg-icons'

import {config} from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false

export default function AppPage() {
    const [open, setOpen] = useState(false)

    return (
        <div style={{height: '50vh'}}>
            <Form
                labelPlacement="top"
                items={[
                    {
                        field: 'account',
                        rules: {required: true},
                        label: (
                            <Flex gap={6} alignItems="center">
                                <Icon icon={faUser}/>
                                <div style={{flex: 1}}>账号</div>
                            </Flex>
                        ),
                        children: <Input/>
                    }
                ]}
            />
        </div>
    )
}