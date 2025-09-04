import {ReactElement, ReactNode, createContext, memo, useContext, useMemo, useState} from 'react'
import {DivProps, Id, SelectableMultipleProps} from '../../types'
import {classes, style} from './transfer.style'
import {clsx, useControlled} from '../../utils'
import {MenuOptionType} from '../optionsBase'
import {Button, ButtonProps} from '../button'
import {TransferPanel} from './transferPanel'
import {Icon} from '../icon'
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import {faAngleRight} from '@fortawesome/free-solid-svg-icons/faAngleRight'

export interface TransferProps<O extends MenuOptionType<V>, V extends Id = Id> extends Omit<DivProps, 'defaultValue' | 'value' | 'onChange'>,
    Omit<SelectableMultipleProps<V>, 'multiple'> {
    options?: O[]
    /** 默认为`value` */
    primaryKey?: keyof O
    fullWidth?: boolean
    /** 默认为`true` */
    allowSelectAll?: boolean
    /** 默认为`true` */
    showHeader?: boolean
    /** 默认为`"选项"` */
    leftTitle?: ReactNode
    /** 默认为`"已选"` */
    rightTitle?: ReactNode
    /** 自定义渲染按钮 */
    renderButtons?(buttonProps: [ButtonProps, ButtonProps]): ReactNode
}

type TransferContext<O extends MenuOptionType<V>, V extends Id = Id> = {
    options?: O[]
    primaryKey?: V
    value?: V[]
    allowSelectAll?: boolean
    showHeader?: boolean
}

const TransferContext = createContext<TransferContext<any, any>>({})

export function useTransferContext<O extends MenuOptionType<V>, V extends Id = Id>(): Required<TransferContext<O, V>> {
    const {
        options = [],
        primaryKey = 'value',
        value = [],
        allowSelectAll = true,
        showHeader = true
    } = useContext(TransferContext)
    return {options, primaryKey, value, allowSelectAll, showHeader}
}

export const Transfer = memo(<O extends MenuOptionType<V>, V extends Id = Id>({
    options,
    primaryKey = 'value',
    fullWidth,
    allowSelectAll = true,
    showHeader = true,
    leftTitle = '选项',
    rightTitle = '已选',
    renderButtons,
    defaultValue,
    value,
    onChange,
    ...props
}: TransferProps<O, V>) => {
    const [innerValue, setInnerValue] = useControlled(defaultValue || [], value, onChange)

    const [leftSelected, setLeftSelected] = useState<V[]>([])
    const [rightSelected, setRightSelected] = useState<V[]>([])

    const toRight = () => {
        setInnerValue([...innerValue.current, ...leftSelected])
        setLeftSelected([])
    }

    const toLeft = () => {
        const rightSelectedSet = new Set(rightSelected)
        setInnerValue(innerValue.current.filter(v => !rightSelectedSet.has(v)))
        setRightSelected([])
    }

    const renderedButtons = (() => {
        const buttonsProps: [ButtonProps, ButtonProps] = [
            {
                disabled: !leftSelected.length,
                onClick: toRight,
                children: <Icon icon={faAngleRight}/>
            },
            {
                disabled: !rightSelected.length,
                onClick: toLeft,
                children: <Icon icon={faAngleLeft}/>
            }
        ]
        if (renderButtons) {
            return renderButtons(buttonsProps)
        }
        return [
            <Button key="toRight" {...buttonsProps[0]} />,
            <Button key="toLeft" {...buttonsProps[1]} />
        ]
    })()

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-full-width={fullWidth}
        >
            <TransferContext value={useMemo(() => ({
                options, value: innerValue.current, allowSelectAll, showHeader
            }), [
                options, innerValue.current, allowSelectAll, showHeader
            ])}>
                <TransferPanel
                    title={leftTitle}
                    selectedValue={leftSelected}
                    onChange={setLeftSelected}
                />
                {!!renderedButtons &&
                    <div className={classes.buttons}>
                        {renderedButtons}
                    </div>
                }
                <TransferPanel
                    type="right"
                    title={rightTitle}
                    selectedValue={rightSelected}
                    onChange={setRightSelected}
                />
            </TransferContext>
        </div>
    )
}) as <O extends MenuOptionType<V>, V extends Id = Id>(props: TransferProps<O, V>) => ReactElement