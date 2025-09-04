import React, {Children, ReactNode, cloneElement, isValidElement, memo, useRef, useMemo} from 'react'
import {DivProps, Id} from '../../types'
import {classes} from './tree.style'
import {cloneRef, clsx, DragInfo, findPredecessor, useDraggable} from '../../utils'
import {Collapse} from '../transitionBase'
import {Button} from '../button'
import {Checkbox} from '../checkbox'
import {SortPlacement, useTreeContext} from './tree'
import {useSelectionContext} from '../selectionContext'
import {Icon} from '../icon'
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight'
import {faGripVertical} from '@fortawesome/free-solid-svg-icons'
import {useTreeDndContext} from './treeDnd'

export interface TreeNodeProps extends Omit<DivProps, 'prefix'> {
    value: Id
    label?: ReactNode
    prefix?: ReactNode
    suffix?: ReactNode
    disabled?: boolean
    /** @private 内部使用，表明该节点的层级 */
    _level?: number
}

export const TreeNode = memo(({
    value,
    label,
    prefix,
    suffix,
    disabled,
    _level = 0,
    ...props
}: TreeNodeProps) => {
    const {
        expandedSet, toggleExpanded, indent, renderExpandIcon,
        showCheckbox, readOnly, clickLabelToExpand,
        ...context
    } = useTreeContext()

    disabled ??= context.disabled

    const {selectionStatus, toggleSelected} = useSelectionContext()

    const currentExpanded = expandedSet.has(value)
    const status = selectionStatus.get(value)

    const clickHandler = () => {
        !readOnly && !disabled && toggleSelected(value)
        clickLabelToExpand && toggleExpanded(value)
    }

    const hasChildren = !!props.children && (!Array.isArray(props.children) || props.children.length > 0)

    /**
     * ---------------------------------------------------------------------
     * 拖拽部分
     */

    const {
        sortable, showDragHandle, onSort, containerRef,
        isOffsetSatisfied: [isOffsetSatisfied, setIsOffsetSatisfied],
        dragging: [dragging, setDragging],
        overing: [overing, setOvering],
        placement: [placement, setPlacement],
        overingTimer
    } = useTreeDndContext()

    const dragHandleProps = useDraggable({
        disabled: !sortable,
        onDragStart(e) {
            setDragging(value)
            setOvering(void 0)
            currentExpanded && toggleExpanded(value)
        },
        onDrag({diff: [diffX]}: DragInfo) {
            setIsOffsetSatisfied(diffX > indent * 2)
        },
        onDragEnd() {
            inactiveParentBlock()
            leaveMask()
            setDragging(void 0)
            if (typeof overing !== 'undefined' && placement.current) {
                onSort?.({
                    source: dragging!,
                    destination: overing,
                    placement: isOffsetSatisfied ? 'child' : placement.current
                })
            }
        }
    })

    const nodeRef = useRef<HTMLDivElement>(null)

    const activeParentBlock = (target: HTMLDivElement) => {
        return findPredecessor(target, parent => {
            const ret = parent.classList.contains(classes.levelBlock)
            if (ret) {
                parent.dataset.active = 'true'
                return true
            }
        })
    }

    const inactiveParentBlock = () => {
        const fn = (el: HTMLElement) => {
            el.dataset.active = 'false'
        }
        fn(containerRef.current!)
        containerRef.current!.querySelectorAll<HTMLElement>('.' + classes.levelBlock).forEach(fn)
    }

    const overingMask = (e: React.PointerEvent<HTMLDivElement>) => {
        if (hasChildren && !expandedSet.has(value)) {
            overingTimer.current ||= setTimeout(() => {
                toggleExpanded(value)
                placement.current === 'after' && inactiveParentBlock()
            }, 800)
        }
    }

    const leaveMask = () => {
        clearTimeout(overingTimer.current)
        overingTimer.current = void 0
    }

    const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>, placement: SortPlacement) => {
        setOvering(value)
        setPlacement(placement)
        activeParentBlock(e.currentTarget)
    }

    const onPointerLeave = () => {
        setOvering(void 0)
        inactiveParentBlock()
    }

    /**
     * ---------------------------------------------------------------------
     * 渲染部分
     */

    const renderedIndents = useMemo(() => {
        return Array(_level).fill(void 0).map((_, i) =>
            <div key={i} className={classes.indent} style={{width: indent}}/>
        )
    }, [_level, indent])

    return (
        <>
            <div
                {...props}
                ref={cloneRef(nodeRef, props.ref)}
                className={clsx(classes.node, props.className)}
                data-selected={status === 2}
                data-read-only={readOnly}
                data-disabled={disabled}
                data-dragging={dragging === value}
                {...!showDragHandle && dragHandleProps}
            >
                {renderedIndents}

                <Button
                    className={classes.expand}
                    variant="plain"
                    color="text.secondary"
                    onClick={e => {
                        e.stopPropagation()
                        toggleExpanded(value)
                    }}
                    onPointerDown={e => e.stopPropagation()}
                >
                    {renderExpandIcon
                        ? renderExpandIcon(value, currentExpanded, [...expandedSet])
                        : hasChildren &&
                        <Icon
                            icon={faChevronRight}
                            className={classes.icon}
                            style={{
                                rotate: currentExpanded ? '90deg' : '0deg'
                            }}
                        />
                    }
                </Button>
                <div className={classes.contentWrap}>
                    {sortable && showDragHandle &&
                        <div
                            className={classes.dragHandle}
                            {...dragHandleProps}
                            onClick={e => e.stopPropagation()}
                        >
                            <Icon icon={faGripVertical}/>
                        </div>
                    }
                    {showCheckbox &&
                        <Checkbox
                            className={classes.checkbox}
                            checked={status === 2}
                            indeterminate={status === 1}
                            onClick={e => {
                                e.stopPropagation()
                                clickHandler()
                            }}
                        />
                    }
                    {!!prefix &&
                        <div className={classes.prefix}>{prefix}</div>
                    }
                    <div className={classes.label}>{label}</div>
                    {!!suffix &&
                        <div className={classes.suffix}>{suffix}</div>
                    }

                    {typeof dragging !== 'undefined' && dragging !== value &&
                        <div
                            className={classes.dragMask}
                            onPointerOver={overingMask}
                            onPointerLeave={leaveMask}
                        >
                            <div
                                className={classes.dragMaskPrev}
                                data-overing={overing === value && placement.current === 'before'}
                                onPointerEnter={e => onPointerEnter(e, 'before')}
                                onPointerLeave={onPointerLeave}
                            />
                            {(!hasChildren || !expandedSet.has(value)) &&
                                <div
                                    className={classes.dragMaskNext}
                                    data-offset={!hasChildren && isOffsetSatisfied}
                                    data-overing={overing === value && placement.current === 'after'}
                                    onPointerEnter={e => onPointerEnter(e, 'after')}
                                    onPointerLeave={onPointerLeave}
                                />
                            }
                        </div>
                    }
                </div>
            </div>
            
            {hasChildren &&
                <Collapse className={classes.levelBlock} in={currentExpanded}>
                    {Children.map(props.children, child => {
                        return isValidElement(child)
                            ? cloneElement(child as any, {_level: _level + 1})
                            : child
                    })}
                </Collapse>
            }
        </>
    )
})