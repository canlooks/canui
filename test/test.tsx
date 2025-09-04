import {createRoot} from 'react-dom/client'
import {css, Global} from '@emotion/react'
import {App, FormRef, Input, Select} from '../src'
import React, {useState} from 'react'
import {Chip, RC, useReactive} from '@canlooks/reactive/react'
import {RF} from '../src/extensions/reactiveForm'

const Root = RC(() => {
    const formValue = useReactive({
        msg: 'hello',
        obj: {
            a: 'world'
        }
    }, {deep: true})
    console.log('render')
    return (
        <>
            <Chip.Strict>{() =>
                <h1>{formValue.obj.a}</h1>
            }</Chip.Strict>
            <RF>
                <RF.Item
                    label="测试"
                    refer={() => formValue.obj.a}
                    rules={{
                        pattern: /^\d+$/,
                        message: '输入不正确'
                    }}
                >
                    <Input/>
                </RF.Item>
                <RF.Item label="关联" refer={() => formValue.msg} dependencies={() => formValue.obj.a} rules={{
                    validator(fieldValue: any, formValue: any, formRef: FormRef | null): any {
                        throw '测试关联错误'
                    }
                }}>
                    <Input/>
                </RF.Item>
            </RF>
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
            // theme={{mode: 'dark'}}
            style={{
                height: '100vh',
                padding: 24,
                background: 'white'
            }}
        >
            <Root/>
        </App>
    </>
)
