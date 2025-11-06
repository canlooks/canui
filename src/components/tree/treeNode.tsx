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
    /** @private 内部使用，是否为该层级最后一个节点 */
    _isLast?: boolean
}

export const TreeNode = memo(({
    value,
    label,
    prefix,
    suffix,
    disabled,
    _level = 0,
    _isLast,
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
        isDeeperSatisfied: [isDeeperSatisfied, setIsDeeperSatisfied],
        dragging: [dragging, setDragging],
        overing: [overing, setOvering],
        placement: [placement, setPlacement],
        overingTimer
    } = useTreeDndContext()

    const nodeRef = useRef<HTMLDivElement>(null)

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
                // {...!showDragHandle && dragHandleProps}
                // onClick={showDragHandle ? onClick : props.onClick}
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
                            // {...dragHandleProps}
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