import {Children, ReactElement, isValidElement, memo, useState} from 'react'
import {classes} from './tabs.style'
import {TabType, TabsProps} from './tabs'
import {Popper} from '../popper'
import {tabsEllipsisPopperStyle} from './tabsEllipsis.style'
import {OptionsBase} from '../optionsBase'
import {Icon} from '../icon'
import {faEllipsis} from '@fortawesome/free-solid-svg-icons/faEllipsis'

interface TabsEllipsisProps<T extends TabType = TabType> extends Pick<TabsProps<T>, 'tabs' | 'children' | 'labelKey' | 'primaryKey' | 'value'> {
    onToggleSelected(value: keyof T): void
}

export const TabsEllipsis = memo(<T extends TabType = TabType>({
    tabs,
    children,
    labelKey = 'label',
    primaryKey = 'value',
    value,
    onToggleSelected
}: TabsEllipsisProps<T>) => {
    const [open, setOpen] = useState(false)

    const getOptions = (): T[] | undefined => {
        return tabs?.map((p, key) => ({
            key,
            label: p[labelKey],
            value: p[primaryKey],
            prefix: p.prefix,
            suffix: p.suffix,
            color: p.color,
            disabled: p.disabled
        } as any as T)) || Children.map(children, c => isValidElement(c) ? c.props : c) as T[] || void 0
    }

    const _onToggleSelected = (value: keyof T) => {
        onToggleSelected(value)
        setOpen(false)
    }

    return (
        <>
            <Popper
                css={tabsEllipsisPopperStyle}
                placement="bottomRight"
                trigger="hover"
                open={open}
                onOpenChange={setOpen}
                content={
                    <OptionsBase<T>
                        options={getOptions()}
                        selectedValue={value}
                        onToggleSelected={_onToggleSelected}
                    />
                }
            >
                <div className={classes.ellipsis}>
                    <Icon icon={faEllipsis}/>
                </div>
            </Popper>
        </>
    )
}) as <T extends TabType = TabType>(props: TabsEllipsisProps<T>) => ReactElement