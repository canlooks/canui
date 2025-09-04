import {Children, ReactElement, cloneElement, isValidElement, memo} from 'react'
import {DivProps, Id, Obj} from '../../types'
import {classes, style} from './bottomNavigation.style'
import {clsx, isUnset, useControlled} from '../../utils'
import {BottomNavigationItem, BottomNavigationItemProps} from './bottomNavigationItem'

type BottomNavigationItemType = BottomNavigationItemProps & Obj

export interface BottomNavigationProps<I extends BottomNavigationItemType> extends Omit<DivProps, 'defaultValue' | 'onChange'> {
    items?: I[]
    /** 未激活状态下是否显示label，items数量小于等于3时默认为`true`，否则为`false` */
    showLabelInactive?: boolean
    /** 默认为`"value"` */
    primaryKey?: keyof I
    labelKey?: keyof I
    defaultValue?: Id
    value?: Id
    onChange?(value: Id): void
}

export const BottomNavigation = memo(<I extends BottomNavigationItemType>({
    items,
    showLabelInactive,
    primaryKey = 'value',
    labelKey = 'label',
    defaultValue = 'children',
    value,
    onChange,
    ...props
}: BottomNavigationProps<I>) => {
    const [innerValue, setInnerValue] = useControlled(defaultValue, value, onChange)

    const renderItems = () => {
        if (items) {
            return items.map((p, i) => {
                const itemValue = p[primaryKey]
                return (
                    <BottomNavigationItem
                        {...p}
                        key={p.key ?? itemValue ?? i}
                        value={itemValue}
                        label={p[labelKey]}
                        showLabelInactive={p.showLabelInactive ?? showLabelInactive ?? items.length <= 3}
                        active={!isUnset(itemValue) && innerValue.current === itemValue}
                        onClick={e => {
                            p.onClick?.(e)
                            setInnerValue(itemValue)
                        }}
                    />
                )
            })
        }
        showLabelInactive ??= Children.count(props.children) <= 3
        return Children.map(props.children, c => {
            if (isValidElement(c)) {
                const {props} = c as ReactElement<I>
                return cloneElement(c, {
                    showLabelInactive: props.showLabelInactive ?? showLabelInactive,
                    active: !isUnset(props.value) && innerValue.current === props.value,
                    onClick: e => {
                        props.onClick?.(e)
                        setInnerValue(props.value!)
                    },
                } as BottomNavigationItemProps)
            }
            return c
        })
    }

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            {renderItems()}
        </div>
    )
}) as <I extends BottomNavigationItemType>(props: BottomNavigationProps<I>) => ReactElement