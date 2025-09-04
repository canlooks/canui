import React, {ComponentType, memo, useEffect, useState} from 'react'
import ts from 'typescript'
import * as CanUIComponents from '@'
import {Skeleton} from '@'
import {classes} from './codeBlock.style'
import {faUser} from '@fortawesome/free-solid-svg-icons'

const destructedScope = (() => {
    return `const {${Object.keys(CanUIComponents).join(', ')}} = scope;`
})()

export const Preview = memo(({code}: {
    code: string
}) => {
    const [Component, setComponent] = useState<ComponentType>()

    useEffect(() => {
        let output = ts.transpile(code, {
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.ESNext,
            moduleResolution: ts.ModuleResolutionKind.Node10,
            esModuleInterop: true,
            jsx: ts.JsxEmit.React
        })
        output = output
            .replace(/import.*/g, '')
            .replace('export default ', 'return ')
        const Component = Function(
            'React',
            'scope',
            'faUser',
            `${destructedScope} return () => {${output}}`
        )(
            React,
            CanUIComponents,
            faUser
        )
        setComponent(Component)
    }, [code])

    return Component
        ? <Component/>
        : <Skeleton className={classes.previewSkeleton}/>
})