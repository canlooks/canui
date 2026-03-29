import {CSSProperties, Children, ReactElement, ReactNode, cloneElement, createContext, isValidElement, memo, useContext, useEffect, useMemo, useRef, useState, SetStateAction, Dispatch} from 'react'
import {ColorPropsValue, DivProps, Id, Obj, Size} from '../../types'
import {classes, useStyle} from './tabs.style'
import {clsx, cloneRef, isUnset, useControlled, useDerivedState, defaultSensors, onDndDragEnd} from '../../utils'
import {useTheme} from '../theme'
import {Tab, TabProps} from './tab'
import {TabsEllipsis} from './tabsEllipsis'
import {LineIndicator} from './lineIndicator'
import {TransitionGroup} from 'react-transition-group'
import {DragDropProvider} from '@dnd-kit/react'
import {DragDropEvents} from '@dnd-kit/abstract'

export type TabType = TabProps & Obj

type TabsSharedProps = {
    variant?: 'line' | 'card'
    color?: ColorPropsValue
    /** 是否渲染关闭按钮，默认为`false` */
    closable?: boolean
    onClose?(key: Id): void
    /** 是否允许拖拽排序，默认为`false` */
    sortable?: boolean
}

export interface TabsProps<T extends TabType = TabType> extends TabsSharedProps, Omit<DivProps, 'prefix' | 'defaultValue' | 'onChange'> {
    tabs?: T[]
    labelKey?: keyof T
    primaryKey?: keyof T
    size?: Size
    /** 选项卡的位置，默认为`top` */
    position?: 'top' | 'bottom' | 'left' | 'right'
    justifyContent?: CSSProperties['justifyContent']
    fullWidth?: boolean
    prefix?: ReactNode
    suffix?: ReactNode

    defaultValue?: Id
    value?: Id
    onChange?(value: Id): void

    readOnly?: boolean
    disabled?: boolean

    /**
     * @param e
     * @param tabs 仅{@link tabs}模式支持，使用children时，该参数为`undefined`
     */
    onSort?(e: Parameters<DragDropEvents<any, any, any>['dragend']>[0], tabs?: T[]): void
    /** 触发change事件的事件，默认为`click` */
    changeEvent?: 'click' | 'pointerDown'
}

interface ITabsContext extends TabsSharedProps {
    animating: boolean
    setAnimating: Dispatch<SetStateAction<boolean>>
}

const TabsContext = createContext({} as ITabsContext)

export function useTabsContext() {
    return useContext(TabsContext)
}

export const Tabs = memo(<T extends TabType = TabType>({
    tabs,
    labelKey = 'label',
    primaryKey = 'value',
    size,
    position = 'top',
    justifyContent = 'flex-start',
    fullWidth,
    prefix,
    suffix,
    defaultValue,
    value,
    onChange,
    readOnly,
    disabled,
    variant = 'line',
    color = 'primary',
    closable,
    onClose,
    sortable,
    changeEvent = 'click',
    ...props
}: TabsProps<T>) => {
    const theme = useTheme()

    size ??= theme.size

    const [innerValue, _setInnerValue] = useControlled(defaultValue, value, onChange)
    const setInnerValue = (value: Id) => {
        if (!readOnly && !disabled) {
            _setInnerValue(value)
        }
    }

    const [animating, setAnimating] = useDerivedState<boolean>(prev => typeof prev !== 'undefined', [innerValue.current])

    const setValueInEllipsis = (value: Id) => {
        shouldScroll.current = true
        setInnerValue(value)
    }

    const tabRefs = useRef(new Map<Id, HTMLDivElement>())

    const getActiveTab = (): HTMLDivElement | undefined => {
        return isUnset(innerValue.current) ? void 0 : tabRefs.current.get(innerValue.current)
    }

    const eventName = changeEvent === 'click' ? 'onClick' : 'onPointerDown'

    const renderTabs = () => {
        if (tabs) {
            return tabs.map((p, i) => {
                const value = p[primaryKey]
                const active = !isUnset(value) && value === innerValue.current

                return (
                    <Tab
                        {...p}
                        key={p.key ?? value ?? i}
                        ref={el => {
                            el
                                ? tabRefs.current.set(value, el)
                                : tabRefs.current.delete(value)
                        }}
                        value={value}
                        label={p[labelKey]}
                        {...{
                            [eventName]: (e: any) => {
                                p[eventName]?.(e)
                                setInnerValue(value)
                            }
                        }}
                        _active={active}
                        _index={i}
                    />
                )
            })
        }

        return Children.map(props.children as ReactElement<TabProps>, (c, _index) => {
            if (isValidElement(c)) {
                const {value} = c.props
                const active = !isUnset(value) && value === innerValue.current

                return cloneElement(c, {
                    ref: cloneRef((c as any).ref, el => {
                        if (!isUnset(value)) {
                            el
                                ? tabRefs.current.set(value, el)
                                : tabRefs.current.delete(value)
                        }
                    }),
                    ...{
                        [eventName]: (e: any) => {
                            c.props[eventName]?.(e)
                            !isUnset(value) && setInnerValue(value)
                        }
                    },
                    _active: active,
                    _index
                } as TabProps)
            }
            return c
        })
    }

    /**
     * ----------------------------------------------------------------
     * 滚动
     */

    const scrollRef = useRef<HTMLDivElement>(null)

    const [shadowStart, setShadowStart] = useState(false)
    const [shadowEnd, setShadowEnd] = useState(false)

    const setShadow = () => {
        if (scrollRef.current) {
            if (position === 'top' || position === 'bottom') {
                const {scrollLeft} = scrollRef.current
                setShadowStart(scrollLeft > 0)
                setShadowEnd(scrollLeft < scrollRef.current!.scrollWidth - scrollRef.current!.clientWidth)
            } else {
                const {scrollTop} = scrollRef.current
                setShadowStart(scrollTop > 0)
                setShadowEnd(scrollTop < scrollRef.current!.scrollHeight - scrollRef.current!.clientHeight)
            }
        }
    }

    useEffect(() => {
        const scroller = scrollRef.current!
        const onWheel = (e: WheelEvent) => {
            scroller.scrollTo({
                left: scroller.scrollLeft + e.deltaY
            })
        }
        if (position === 'top' || position === 'bottom') {
            scroller.addEventListener('wheel', onWheel)
        }
        const resizeObserver = new ResizeObserver(setShadow)
        resizeObserver.observe(scroller)

        return () => {
            scroller.removeEventListener('wheel', onWheel)
            resizeObserver.disconnect()
        }
    }, [position])

    const shouldScroll = useRef(true)

    useEffect(() => {
        if (shouldScroll.current) {
            getActiveTab()?.scrollIntoView({block: 'center', inline: 'center', behavior: 'smooth'})
            shouldScroll.current = false
        }
    }, [shouldScroll.current])

    /**
     * ----------------------------------------------------------------
     * 拖拽
     */

    const dragEndHandler: DragDropEvents<any, any, any>['dragend'] = e => {
        if (props.onSort) {
            const newTabs = tabs
                ? onDndDragEnd(e, tabs, primaryKey!)
                : void 0
            newTabs && props.onSort(e, newTabs)
        }
    }

    return (
        <div
            {...props}
            css={useStyle({color, variant})}
            className={clsx(classes.root, props.className)}
            data-size={size}
            data-position={position}
            data-animating={animating.current}
            data-full-width={fullWidth}
            data-read-only={readOnly}
            data-disabled={disabled}
        >
            <div className={classes.start} data-show={shadowStart}>
                {!!prefix &&
                    <div className={classes.prefix}>{prefix}</div>
                }
            </div>
            <div
                ref={scrollRef}
                className={classes.scroll}
                onScroll={setShadow}
            >
                <div className={classes.scrollWrap} style={{justifyContent}}>
                    <TabsContext
                        value={
                            useMemo(() => ({
                                color, variant, closable, onClose, sortable,
                                animating: animating.current, setAnimating
                            }), [
                                color, variant, closable, onClose, sortable,
                                animating.current
                            ])
                        }
                    >
                        <DragDropProvider sensors={defaultSensors} onDragEnd={dragEndHandler}>
                            <TransitionGroup component={null}>
                                {renderTabs()}
                            </TransitionGroup>
                        </DragDropProvider>
                        {variant === 'line' &&
                            <LineIndicator
                                value={innerValue.current}
                                position={position}
                                getActiveTab={getActiveTab}
                            />
                        }
                    </TabsContext>
                </div>
            </div>
            <div className={classes.end} data-show={shadowEnd}>
                {!!(suffix || shadowStart || shadowEnd) &&
                    <div className={classes.suffix}>
                        {(shadowStart || shadowEnd) &&
                            <TabsEllipsis
                                tabs={tabs}
                                labelKey={labelKey}
                                primaryKey={primaryKey}
                                value={innerValue.current}
                                onToggleSelected={setValueInEllipsis}
                            >
                                {props.children}
                            </TabsEllipsis>
                        }
                        {suffix}
                    </div>
                }
            </div>
        </div>
    )
}) as any as {
    <T extends TabType>(props: TabsProps<T>): ReactElement
    Tab: typeof Tab
}

Tabs.Tab = Tab