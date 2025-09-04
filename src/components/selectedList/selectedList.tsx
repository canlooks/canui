import {ReactElement, memo, Ref} from 'react'
import {Id} from '../../types'
import {clsx, toArray} from '../../utils'
import {classes, style} from './selectedList.style'
import {AlertProps} from '../alert'
import {TransitionGroup} from 'react-transition-group'
import {useSelectionContext} from '../selectionContext'
import {SelectedItem} from './selectedItem'
import {TransitionGroupProps} from 'react-transition-group/TransitionGroup'

export type SelectedListProps<V extends Id = Id> = Omit<TransitionGroupProps, 'ref'> & {
    ref?: Ref<any>
    value?: V[]
    itemProps?(value: V, index: number): AlertProps | Promise<AlertProps>
    onClose?(value: V, index: number): void
}

export const SelectedList = memo(<V extends Id = Id>({
    value,
    itemProps,
    onClose,
    ...props
}: SelectedListProps<V>) => {
    const {
        value: innerValue,
        setValue: setInnerValue
    } = useSelectionContext<any, V>()

    const arr: V[] | null = toArray(value || innerValue)

    const closeHandler = (v: V, i: number) => {
        onClose?.(v, i)
        setInnerValue?.(arr?.filter(_v => _v !== v))
    }

    return (
        <TransitionGroup
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            {arr?.map((v, i) =>
                <SelectedItem
                    key={v as any}
                    value={v}
                    index={i}
                    itemProps={itemProps}
                    onClose={closeHandler}
                />
            )}
        </TransitionGroup>
    )
}) as any as <V extends Id = Id>(props: SelectedListProps<V>) => ReactElement