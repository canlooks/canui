import {Children, ComponentProps, ComponentType, isValidElement, memo, useEffect, useMemo, useState} from 'react'
import {Alert, AnchorItem, clsx, Divider, Skeleton, Table, TableContainer, Typography, useLoading} from '@'
import {classes, markdownStyle, skeletonStyle} from './markdownParser.style'
import Markdown from 'react-markdown'
import {CodeBlock} from './codeBlock'
import {ExtraProps} from 'react-markdown/lib'
import {Link} from '@canlooks/react-router'
import remarkGfm from 'remark-gfm'
import {useAnchorContext} from '../anchorNavigation/anchorNavigation'

const anchorTarget = (Component: ComponentType, level = 0) => {
    return ({node, ...props}: any) => {
        const {children} = props

        const [, setAnchors] = useAnchorContext()

        const id = encodeURIComponent(children)

        useEffect(() => {
            const item: AnchorItem = {
                id,
                label: children,
                level
            }
            setAnchors(anchors => [...anchors, item])
            return () => {
                setAnchors(anchors => anchors.filter(a => a !== item))
            }
        }, [])

        return (
            <Component
                {...props}
                id={id}
                data-level={level}
            />
        )
    }
}

const PComponent = ({node, ...props}: Omit<ComponentProps<'p'>, 'onCopy'> & ExtraProps) => {
    return (node?.children[0] as any).tagName === 'strong'
        ? props.children
        : <Typography {...props}/>
}

const LinkComponent = ({node, href, ...props}: Omit<ComponentProps<'a'>, 'onCopy'> & ExtraProps) => {
    return href?.[0] === '#'
        ? <Typography.a href={href} {...props}/>
        : <Link
            {...props}
            to={href}
            component={Typography.a}
        />
}

const TableComponent = ({node, ...props}: ComponentProps<'table'> & ExtraProps) => {
    return (
        <TableContainer className="scrollbar">
            <Table {...props} className={clsx(classes.table, props.className)} striped bordered="out"/>
        </TableContainer>
    )
}

const TableRowComponent = ({node, children, ...props}: ComponentProps<'tr'> & ExtraProps) => {
    return (
        <tr {...props}>
            {Children.map(children, (child, i) => {
                if (!isValidElement(child) || i > 0) {
                    return child
                }
                const Cell = child.type === 'th' ? Table.th : Table.td
                return <Cell {...child.props as any} sticky="left"/>
            })}
        </tr>
    )
}

const TableDataCellComponent = ({node, ...props}: ComponentProps<'td'> & ExtraProps) => {
    if (Array.isArray(props.children) && (props.children.includes('<br/>') || props.children.includes('<br>'))) {
        // FIXME 表格内的<br/>标签不会自动转换，暂未找到更好的方法
        props.children = props.children.map((child, i) => {
            if (typeof child === 'string' && /^<br\/?>$/.test(child)) {
                return <br key={i}/>
            }
            return child
        })
    }
    return <td {...props}/>
}

const HrComponent = ({node, ...props}: ComponentProps<'hr'> & ExtraProps) => {
    return (
        <Divider {...props} style={{
            margin: '36px 0 24px'
        }}/>
    )
}

const StrongComponent = ({node, ...props}: ComponentProps<'strong'> & ExtraProps) => {
    return (
        <Alert title={props.children} status="warning"/>
    )
}

const markdownComponents: { [p: string]: ComponentType } = {
    h1: Typography.h1,
    h2: anchorTarget(Typography.h2),
    h3: anchorTarget(Typography.h3, 1),
    p: PComponent,
    pre: CodeBlock,
    code: Typography.code,
    a: LinkComponent,
    table: TableComponent,
    tr: TableRowComponent,
    td: TableDataCellComponent,
    hr: HrComponent,
    strong: StrongComponent
}

export const MarkdownParser = memo(({path}: {
    path: string
}) => {
    const [content, setContent] = useState<string>('')

    const [loading, getContent] = useLoading(async () => {
        setContent('')
        const res = await fetch(path)
        setContent(await res.text())
    })

    useMemo(() => {
        getContent().then()
    }, [path])

    const style = markdownStyle()

    return loading.current
        ? <Skeleton.Card css={skeletonStyle}/>
        : <div css={style}>
            <Markdown
                remarkPlugins={[remarkGfm]}
                skipHtml={false}
                components={markdownComponents}
            >
                {content}
            </Markdown>
        </div>
})

