import {classes, style} from './anchorList.style'
import {clsx, listenAllPredecessorsScroll, useDerivedState, useExternalClass, useSyncState} from '../../utils'
import React, {memo, ReactNode, useEffect, useRef} from 'react'
import {Flex, FlexProps} from '../flex'
import {ActiveIndicator} from './activeIndicator'
import {DefineElement} from '../../types'

export type AnchorItem = {
    id: string
    label?: ReactNode
    /** 锚点的层级，主要影响缩进等级 */
    level?: number
    /** 是否激活的锚点，通常为自动判断 */
    active?: boolean
}

export interface AnchorListProps extends FlexProps {
    anchors?: AnchorItem[]
    renderAnchorItem?(item: AnchorItem, active: boolean): ReactNode
    /** 缩进，默认为`24` */
    indent?: number
    /** 定义滚动容器，默认为`document` */
    scroller?: DefineElement
    /** hash跳转模式，仅`history`模式支持{@link offset}与{@link scrollBehavior}，默认为`history` */
    routeMode?: 'history' | 'location'
    /** 目标元素距离顶部的偏移量，默认为`0` */
    offset?: number
    /** 滚动行为，传递至`scrollTo`方法，默认为`smooth` */
    scrollBehavior?: ScrollBehavior
}

export const AnchorList = memo(({
    anchors,
    renderAnchorItem,
    indent = 24,
    scroller,
    routeMode = 'history',
    offset = 0,
    scrollBehavior = 'smooth',
    ...props
}: AnchorListProps) => {
    const anchorRefs = useRef(new Map<string, HTMLAnchorElement | null>())

    /**
     * ------------------------------------------------------------------------
     * 初始化高亮与滚动位置
     */

    const mounted = useRef(false)

    useExternalClass(() => {
        if (routeMode === 'history') {
            mounted.current ||= scrollToId(location.hash.slice(1))
        }
    })

    const scrollToId = (id: string) => {
        const targetEl = document.getElementById(id)
        const scrollerEl = getScroller()
        if (!targetEl || !scrollerEl) {
            return false
        }
        scrollerEl.scrollTo({
            top: targetEl.offsetTop - offset,
            // 初始化之前无需平滑滚动
            behavior: mounted.current ? scrollBehavior : 'instant'
        })
        return true
    }

    /**
     * ------------------------------------------------------------------------
     * 拦截原生点击事件
     */

    const clickHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (routeMode !== 'history' || e.ctrlKey) {
            return
        }
        const hash = (e.target as HTMLAnchorElement).getAttribute('href')
        if (hash?.[0] !== '#') {
            return
        }
        if (scrollToId(hash.slice(1))) {
            e.preventDefault()
            history.pushState(void 0, '', hash)
        }
    }

    /**
     * ------------------------------------------------------------------------
     * 监听滚动设置高亮
     */

    const getScroller = () => {
        if (scroller) {
            return typeof scroller === 'function' ? scroller() : scroller
        }
        return document.documentElement
    }

    const [activeId, setActiveId] = useSyncState<string>()

    useEffect(() => {
        const scrollerEl = getScroller()
        if (scrollerEl) {
            const scroll = () => {
                let nearest: HTMLElement | undefined
                let minDistance = Infinity
                const targets = anchors?.map(item => document.getElementById(item.id))
                targets?.forEach(target => {
                    const top = target?.getBoundingClientRect().top
                    if (typeof top === 'number') {
                        const distance = Math.abs(top - offset)
                        if (distance < minDistance) {
                            minDistance = distance
                            nearest = target!
                        }
                    }
                })
                nearest && setActiveId(nearest.id)
            }
            !activeId.current && scroll()
            return listenAllPredecessorsScroll(scrollerEl === document.documentElement ? document : scrollerEl, scroll)
        }
    }, [anchors, scroller, offset])

    const [animating, setAnimating] = useDerivedState<boolean>(prev => typeof prev !== 'undefined', [activeId.current])

    return (
        <Flex
            direction="column"
            alignItems="flex-start"
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-animating={animating.current}
        >
            {anchors?.map(item => {
                const active = item.active || activeId.current === item.id
                if (renderAnchorItem) {
                    return renderAnchorItem(item, active)
                }
                return (
                    <a
                        key={item.id}
                        ref={r => {
                            r
                                ? anchorRefs.current.set(item.id, r)
                                : anchorRefs.current.delete(item.id)
                        }}
                        className={classes.item}
                        href={'#' + item.id}
                        style={{
                            paddingLeft: (item.level || 0) * indent + 15
                        }}
                        data-active={active}
                        onClick={clickHandler}
                    >
                        {item.label}
                    </a>
                )
            })}
            {!renderAnchorItem &&
                <ActiveIndicator
                    activeId={activeId.current}
                    anchorRefs={anchorRefs.current}
                    onTransitionEnd={() => setAnimating(false)}
                />
            }
        </Flex>
    )
})