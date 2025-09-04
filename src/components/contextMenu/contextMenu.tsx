import {Bubble, BubbleProps} from '../bubble'
import {ItemPropType} from '../menu'
import {MenuItem} from '../menuItem'
import {isValidElement, ReactNode} from 'react'

export interface ContextMenuProps extends Omit<BubbleProps, 'onClick'> {
    items?: (ItemPropType | ReactNode)[]
}

export function ContextMenu({
    items,
    ...props
}: ContextMenuProps) {
    const renderItems = (items?: any[]) => {
        return items?.map((p, i) => {
            return typeof p === 'object' && p && !isValidElement(p)
                ? <MenuItem
                    key={p.value ?? i}
                    {...p}
                >
                    {renderItems(p.children)}
                </MenuItem>
                : p
        })
    }

    return (
        <Bubble
            placement="bottomRight"
            showArrow={false}
            {...props}
            trigger="contextMenu"
            content={props.content ?? renderItems(items)}
        />
    )
}