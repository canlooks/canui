import React, {ComponentProps, memo, useMemo, useState} from 'react'
import {ExtraProps} from 'react-markdown/lib'
import {Boundary, Button, clsx, Flex, Icon, Tooltip, useTheme} from '@'
import {faCopy} from '@fortawesome/free-regular-svg-icons'
import {faCheck} from '@fortawesome/free-solid-svg-icons'
import {classes, style} from './codeBlock.style'
import {Preview} from './preview'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneLight} from 'react-syntax-highlighter/dist/esm/styles/prism'
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism'

export const CodeBlock = memo(({
    node,
    ...props
}: ComponentProps<'pre'> & ExtraProps) => {
    const {mode} = useTheme()

    const codeTag: any = node!.children[0]

    const isTSX = codeTag.properties.className[0] === 'language-tsx'

    const showPreview = isTSX && codeTag.data?.meta !== 'no-preview'

    const [codeValue, setCodeValue] = useState<string>((node!.children[0] as any).children[0].value)

    const renderedPre = useMemo(() => {
        if (isTSX) {
            return (
                <SyntaxHighlighter
                    className={classes.highlighted}
                    language="tsx"
                    style={mode === 'light' ? oneLight : oneDark}
                >
                    {codeValue}
                </SyntaxHighlighter>
            )
        }
        return (
            <pre {...props}>
                <code dangerouslySetInnerHTML={{__html: codeValue}}/>
            </pre>
        )
    }, [codeValue, mode, isTSX])

    const codeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCodeValue(e.target.value)
    }

    const [copied, setCopied] = useState(false)

    const copy = () => {
        navigator.clipboard.writeText(codeValue).then()
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 3000)
    }

    return (
        <div css={style}>
            {showPreview &&
                <div className={clsx(classes.previewScroller, 'scrollbar')}>
                    <Flex
                        className={classes.previewArea}
                        minWidth="100%"
                        direction="column"
                        alignItems="center"
                        inline
                    >
                        <Boundary key={codeValue} renderError={({error}) => error.toString()}>
                            <Preview code={codeValue}/>
                        </Boundary>
                    </Flex>
                </div>
            }

            <div className={classes.codeArea}>
                <div className={clsx(classes.scroller, 'scrollbar')}>
                    <div className={classes.container}>
                        {renderedPre}
                        {showPreview &&
                            <textarea
                                className={classes.textarea}
                                value={codeValue}
                                onChange={codeChange}
                            />
                        }
                    </div>
                </div>

                {copied
                    ? <Icon className={classes.copied} icon={faCheck}/>
                    : <Tooltip title="复制">
                        <Button
                            className={classes.copy}
                            variant="plain"
                            color="text.disabled"
                            onClick={copy}
                        >
                            <Icon icon={faCopy}/>
                        </Button>
                    </Tooltip>
                }
            </div>
        </div>
    )
})