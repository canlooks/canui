import {memo, useMemo, useRef, useState} from 'react'
import {classes, svgStyle} from './documentViewer.style'
import {clsx} from '../../utils'
import {Button, ButtonProps} from '../../components/button'
import {Tooltip} from '../../components/tooltip'
import {Divider} from '../../components/divider'
import {Switch} from '../../components/switch'
import {Theme, ThemeProvider, useTheme} from '../../components/theme'
import {Loading, LoadingProps} from '../../components/loading'
import {DocumentViewerBaseProps, useBlob, useDocumentTitle} from './documentViewer'
import {Icon} from '../../components/icon'
import {faDiagramProject} from '@fortawesome/free-solid-svg-icons/faDiagramProject'
import {faDownload} from '@fortawesome/free-solid-svg-icons/faDownload'
import {faExpand} from '@fortawesome/free-solid-svg-icons/faExpand'
import {faMoon} from '@fortawesome/free-solid-svg-icons/faMoon'
import {faSun} from '@fortawesome/free-solid-svg-icons/faSun'
import {faRotateLeft} from '@fortawesome/free-solid-svg-icons/faRotateLeft'
import {faRotateRight} from '@fortawesome/free-solid-svg-icons/faRotateRight'
import {faMagnifyingGlassMinus} from '@fortawesome/free-solid-svg-icons/faMagnifyingGlassMinus'
import {faMagnifyingGlassPlus} from '@fortawesome/free-solid-svg-icons/faMagnifyingGlassPlus'
import {Pinchable, PinchableProps, PinchableRef} from '../../components/pinchable'

export interface SvgViewerProps extends DocumentViewerBaseProps, Omit<LoadingProps, 'onError'> {
    /** 是否显示下载按钮，默认为true */
    showDownload?: boolean
    /** 是否可切换主题，默认为true */
    themeSwitchable?: boolean
    onThemeChange?(mode: Theme['mode']): void

    pinchableProps?: PinchableProps
}

const commonButtonProps: ButtonProps = {
    variant: 'text',
    shape: 'circular'
}

export const SvgViewer = memo((props: SvgViewerProps) => {
    return (
        <ThemeProvider>
            <SvgViewerContent {...props}/>
        </ThemeProvider>
    )
})

function SvgViewerContent({
    showDownload = true,
    themeSwitchable = true,
    onThemeChange,
    pinchableProps,
    // 从DocumentViewerBaseProps继承来的属性
    src,
    filename,
    onError,
    setDocumentTitle,
    ...props
}: SvgViewerProps) {
    /**
     * ---------------------------------------------------------------
     * 切换主题
     */

    const {mode, update} = useTheme()

    const themeChangeHandler = (checked: boolean) => {
        const mode = checked ? 'light' : 'dark'
        update({mode})
        onThemeChange?.(mode)
    }

    /**
     * ---------------------------------------------------------------
     * 同步标题
     */

    useDocumentTitle({filename, setDocumentTitle})

    /**
     * ---------------------------------------------------------------
     * 获取svg内容
     */

        // src改变会清空data
    const {blob, loading} = useBlob({src, onError})

    const data = useMemo(() => {
        if (blob) {
            const file = new File([blob], filename || '', {type: 'image/svg+xml'})
            return URL.createObjectURL(file)
        }
        return
    }, [blob, filename])

    /**
     * ---------------------------------------------------------------
     * 工具栏
     */

    const pinchableRef = useRef<PinchableRef>(null)

    const [rotate, setRotate] = useState(0)

    const resetHandler = () => {
        pinchableRef.current!.reset()
        setRotate(0)
    }

    const downloadHandler = () => {
        if (src) {
            const a = document.createElement('a')
            a.href = src
            a.download = filename || 'download'
            a.click()
        }
    }

    const objectOnLoad = () => {
        // transformWrapperRef.current!.centerView()
    }

    return (
        <Loading
            {...props}
            css={svgStyle}
            className={clsx(classes.svgViewer, props.className)}
            open={loading}
        >
            <div className={classes.svgToolbar}>
                <div className={classes.svgTitle}>
                    <Icon icon={faDiagramProject} className={classes.svgIcon}/>
                    <div>{filename}</div>
                </div>
                <div className={classes.svgToolbarRight}>
                    <Tooltip title="旋转-90°">
                        <Button {...commonButtonProps} onClick={() => setRotate(rotate - 90)}>
                            <Icon icon={faRotateLeft}/>
                        </Button>
                    </Tooltip>
                    <Tooltip title="旋转90°">
                        <Button {...commonButtonProps} onClick={() => setRotate(rotate + 90)}>
                            <Icon icon={faRotateRight}/>
                        </Button>
                    </Tooltip>
                    <Tooltip title="缩小">
                        <Button {...commonButtonProps} onClick={() => pinchableRef.current!.zoomOut()}>
                            <Icon icon={faMagnifyingGlassMinus}/>
                        </Button>
                    </Tooltip>
                    <Tooltip title="放大">
                        <Button {...commonButtonProps} onClick={() => pinchableRef.current!.zoomIn()}>
                            <Icon icon={faMagnifyingGlassPlus}/>
                        </Button>
                    </Tooltip>
                    <Tooltip title="适应屏幕">
                        <Button {...commonButtonProps} onClick={resetHandler}>
                            <Icon icon={faExpand}/>
                        </Button>
                    </Tooltip>
                    {themeSwitchable &&
                        <>
                            <Divider className={classes.svgDivider} orientation="vertical"/>
                            <Switch
                                checkedLabel={<Icon icon={faSun}/>}
                                unCheckedLabel={<Icon icon={faMoon}/>}
                                checked={mode === 'light'}
                                onChange={themeChangeHandler}
                            />
                        </>
                    }
                    {showDownload &&
                        <>
                            <Divider className={classes.svgDivider} orientation="vertical"/>
                            <Button
                                prefix={<Icon icon={faDownload}/>}
                                onClick={downloadHandler}
                            >
                                下载
                            </Button>
                        </>
                    }
                </div>
            </div>
            <Pinchable
                {...pinchableProps}
                ref={pinchableRef}
                className={clsx(classes.svgContainer, pinchableProps?.className)}
            >
                <div className={classes.svgContent}>
                    <object
                        className={classes.object}
                        data={data}
                        style={{rotate: `${rotate}deg`}}
                        onLoad={objectOnLoad}
                        onError={onError}
                    />
                </div>
            </Pinchable>
        </Loading>
    )
}