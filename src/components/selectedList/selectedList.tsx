import {ReactElement, memo, Ref} from 'react'
import {DivProps, Id} from '../../types'
import {clsx, defaultSensors, onDndDragEnd, toArray} from '../../utils'
import {classes, style} from './selectedList.style'
import {AlertProps} from '../alert'
import {useSelectionContext} from '../selectionContext'
import {SelectedItem} from './selectedItem'
import {DragDropProvider} from '@dnd-kit/react'
import {DragDropEvents} from '@dnd-kit/abstract'

export interface SelectedListProps<V extends Id = Id> extends DivProps {
    ref?: Ref<any>
    value?: V[]
    itemProps?(value: V, index: number): AlertProps | Promise<AlertProps>
    onClose?(value: V, index: number): void
    sortable?: boolean
    onSort?(value: V[]): void
}

export const SelectedList = memo(<V extends Id = Id>({
    value,
    itemProps,
    onClose,
    sortable,
    onSort,
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

    const dragEndHandler: DragDropEvents<any, any, any>['dragend'] = e => {
        const newValue = onDndDragEnd(e, arr!)
        if (newValue) {
            onSort?.(newValue)
            setInnerValue?.(newValue)
        }
    }

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            <DragDropProvider sensors={defaultSensors} onDragEnd={dragEndHandler}>
                {arr?.map((v, i) =>
                    <SelectedItem
                        key={v as any}
                        value={v}
                        index={i}
                        itemProps={itemProps}
                        onClose={closeHandler}
                        sortable={sortable}
                    />
                )}
            </DragDropProvider>
        </div>
    )
}) as any as <V extends Id = Id>(props: SelectedListProps<V>) => ReactElement