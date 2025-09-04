import {ReactElement, createContext, memo, useContext, useMemo} from 'react'
import {DivProps, Id, Obj, SelectableProps, Size} from '../../types'
import {style} from './menu.style'
import {MenuItem, MenuItemProps} from '../menuItem'
import {useControlled} from '../../utils'
import {useTheme} from '../theme'
import {useFlatSelection} from '../selectionContext'

// 传递给<MenuItem/>的属性
export type ForwardProps = {
    size?: Size
    showCheckbox?: boolean
    ellipsis?: boolean
    indent?: number
}

export interface ItemPropType extends Omit<MenuItemProps, 'children'>, Obj {
    children?: ItemPropType[]
}

interface MenuBaseProps<I extends ItemPropType, V extends Id = Id> extends ForwardProps, Omit<DivProps, 'defaultValue' | 'onChange'> {
    items?: I[]
    primaryKey?: keyof I
    labelKey?: keyof I
    childrenKey?: keyof I
    defaultExpanded?: V[]
    expanded?: V[]
    onExpandedChange?(expanded: V[], itemValue: V, isExpand: boolean): void
}

export type MenuProps<I extends ItemPropType, V extends Id = Id> = MenuBaseProps<I, V> & SelectableProps<V>

interface MenuContext<V extends Id = Id> extends ForwardProps {
    inMenu?: boolean
    expandedSet?: Set<V>
    setExpanded?(key: V, expanded: boolean): void
    multiple?: boolean
    selected?: V | V[]
    toggleSelected?(key: V): void
}

const MenuContext = createContext<MenuContext<any>>({})

export function useMenuContext<V extends Id = Id>(): MenuContext<V> {
    const theme = useTheme()
    const {
        size = theme.size,
        ellipsis = true,
        indent = theme.spacing[8],
        ...context
    } = useContext(MenuContext)
    return {size, ellipsis, indent, ...context}
}

export const Menu = memo(<I extends ItemPropType, V extends Id = Id>({
    items,
    primaryKey = 'value',
    labelKey = 'label',
    childrenKey = 'children',
    defaultExpanded,
    expanded,
    onExpandedChange,
    multiple,
    defaultValue,
    value,
    onChange,
    // 以下属性传递给<MenuItem/>
    size = 'large',
    showCheckbox,
    ellipsis,
    indent,
    ...props
}: MenuProps<I, V>) => {
    const [innerExpanded, setInnerExpanded] = useControlled(defaultExpanded || [], expanded)

    const expandedSet = useMemo(() => {
        return new Set(innerExpanded.current)
    }, [innerExpanded.current])

    const setExpanded = (key: V, isExpand: boolean) => {
        setInnerExpanded(o => {
            const newExpanded = isExpand ? [...o, key] : o!.filter(k => k !== key)
            onExpandedChange?.(newExpanded, key, isExpand)
            return newExpanded
        })
    }

    const [innerValue, toggleSelected] = useFlatSelection<any>({multiple, defaultValue, value, onChange})

    const renderItems = (items?: I[]) => {
        return items?.map((p, i) =>
            <MenuItem
                {...p}

                key={p[primaryKey] ?? i}
                value={p[primaryKey]}
                label={p[labelKey]}
            >
                {renderItems(p[childrenKey])}
            </MenuItem>
        )
    }

    return (
        <div {...props} css={style}>
            <MenuContext value={
                useMemo(() => ({
                    inMenu: true,
                    expandedSet, setExpanded, multiple, selected: innerValue, toggleSelected,
                    size, showCheckbox, ellipsis, indent
                }), [
                    expandedSet, multiple, innerValue,
                    size, showCheckbox, ellipsis, indent
                ])
            }>
                {props.children ?? renderItems(items)}
            </MenuContext>
        </div>
    )
}) as <I extends ItemPropType, V extends Id = Id>(props: MenuProps<I, V>) => ReactElement