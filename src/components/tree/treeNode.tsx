import React, {Children, ReactNode, cloneElement, isValidElement, memo, useRef, useMemo} from 'react'
import {DivProps, Id} from '../../types'
import {classes} from './tree.style'
import {cloneRef, clsx, findPredecessor, useDraggable} from '../../utils'
import {Collapse} from '../transitionBase'
import {Button} from '../button'
import {Checkbox} from '../checkbox'
import {SortPlacement, useTreeContext} from './tree'
import {useSelectionContext} from '../selectionContext'
import {Icon} from '../icon'
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight'
import {faGripVertical} from '@fortawesome/free-solid-svg-icons'
import {useTreeDndContext} from './treeDnd'
import {treeDndClasses} from './treeDnd.style'

export interface TreeNodeProps extends Omit<DivProps, 'id' | 'prefix'> {
    id: Id
    label?: ReactNode
    prefix?: ReactNode
    suffix?: ReactNode
    disabled?: boolean
    /** @private 表明该节点的层级 */
    _level?: number
}

export const TreeNode = memo(({
    id,
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

    const {optionsMap: nodesMap, selectionStatus, toggleSelected} = useSelectionContext()

    const currentExpanded = expandedSet.has(id)
    const status = selectionStatus.get(id)

    const clickHandler = () => {
        !readOnly && !disabled && toggleSelected(id)
        clickLabelToExpand && toggleExpanded(id)
    }

    const hasChildren = !!props.children && (!Array.isArray(props.children) || props.children.length > 0)

    /**
     * ---------------------------------------------------------------------
     * 拖拽部分
     */

    const {
        sortable, showDragHandle, onSort,
        dragging: [dragging, setDragging],
        overing, placement
    } = useTreeDndContext()

    const isDraggingNode = dragging === id

    const nodeRef = useRef<HTMLDivElement>(null)

    const dragHandleProps = useDraggable({
        disabled: !sortable,
        onDragStart() {
            overing.current = void 0
            setDragging(id)
            currentExpanded && toggleExpanded(id)
        },
        onDragEnd() {
            overing.current && placement.current && onSort?.({
                source: dragging!,
                destination: overing.current!,
                placement: placement.current!
            })
            setDragging(void 0)
            inactiveBlock()
        }
    })

    const pointerEnterMaskArea = (e: React.PointerEvent<HTMLDivElement>, _placement: SortPlacement) => {
        if (!isDraggingNode) {
            activeBlock(e.currentTarget, _placement)
        }
    }

    const pointerLeaveMaskArea = (e: React.PointerEvent<HTMLDivElement>) => {
        !isDraggingNode && inactiveBlock(e.currentTarget)
    }

    const pointerEnterPredecessor = (e: React.PointerEvent<HTMLDivElement>, upLevel: number) => {
        activeBlock(e.currentTarget, 'parent', upLevel)
    }

    const pointerLeavePredecessor = (e: React.PointerEvent<HTMLDivElement>) => {
        inactiveBlock(e.currentTarget)
    }

    const activeBlock = (el: HTMLDivElement, _placement: SortPlacement | 'parent', upLevel = 0) => {
        if (_placement === 'parent') {
            let i = upLevel
            let parentId: any = id
            do {
                const currentNode = nodesMap.get(parentId)!
                if (!currentNode._isLast) {
                    return
                }
                parentId = currentNode._parentId
            } while (--i && parentId)
            overing.current = parentId
            placement.current = 'after'
        } else {
            overing.current = id
            placement.current = _placement
        }
        el.dataset.active = 'true'
        _placement !== 'child' && findPredecessor(el, parent => {
            if (parent.classList.contains(treeDndClasses.levelBlock) && !upLevel--) {
                parent.dataset.active = 'true'
                const parentNode = parent.previousElementSibling as HTMLDivElement | null
                if (parentNode && parentNode.classList.contains(classes.node)) {
                    parentNode.dataset.active = 'true'
                }
                return true
            }
        })
    }

    const inactiveBlock = (el?: HTMLDivElement) => {
        if (el) {
            el.dataset.active = 'false'
        }
        document.querySelectorAll<HTMLDivElement>('.' + treeDndClasses.levelBlock).forEach(el => {
            el.dataset.active = 'false'
        })
        document.querySelectorAll<HTMLDivElement>('.' + classes.node).forEach(el => {
            el.dataset.active = 'false'
        })
        overing.current = void 0
    }

    /**
     * ---------------------------------------------------------------------
     * 渲染部分
     */

    const renderedIndents = useMemo(() => {
        return Array(_level).fill(void 0).map((_, i) =>
            <div key={i} className={classes.indent}/>
        )
    }, [_level])

    return (
        <>
            <div
                {...props}
                ref={cloneRef(nodeRef, props.ref)}
                className={clsx(classes.node, props.className)}
                data-selected={status === 2}
                data-read-only={readOnly}
                data-disabled={disabled}
                data-dragging={isDraggingNode}
                onClick={clickHandler}
                {...!showDragHandle && dragHandleProps}
            >
                {renderedIndents}

                <Button
                    className={classes.expand}
                    variant="plain"
                    color="text.secondary"
                    onClick={e => {
                        e.stopPropagation()
                        toggleExpanded(id)
                    }}
                    onPointerDown={e => e.stopPropagation()}
                >
                    {renderExpandIcon
                        ? renderExpandIcon(id, currentExpanded, [...expandedSet])
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
                            className={treeDndClasses.dragHandle}
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
                </div>

                {typeof dragging !== 'undefined' &&
                    <div className={treeDndClasses.mask}>
                        {Array(_level + 1).fill(void 0).map((_, i) =>
                            <div
                                key={i}
                                className={treeDndClasses.predecessor}
                                {...i && {
                                    onPointerEnter: e => pointerEnterPredecessor(e, _level + 1 - i),
                                    onPointerLeave: pointerLeavePredecessor
                                }}
                            />
                        )}
                        <div className={treeDndClasses.sibling}>
                            <div
                                className={treeDndClasses.siblingPrev}
                                onPointerEnter={e => pointerEnterMaskArea(e, 'before')}
                                onPointerLeave={pointerLeaveMaskArea}
                            />
                            <div
                                className={treeDndClasses.siblingNext}
                                onPointerEnter={e => pointerEnterMaskArea(e, 'after')}
                                onPointerLeave={pointerLeaveMaskArea}
                            />
                            {!hasChildren &&
                                <div
                                    className={treeDndClasses.child}
                                    onPointerEnter={e => pointerEnterMaskArea(e, 'child')}
                                    onPointerLeave={pointerLeaveMaskArea}
                                />
                            }
                        </div>
                    </div>
                }
            </div>

            {hasChildren &&
                <Collapse className={treeDndClasses.levelBlock} in={currentExpanded}>
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