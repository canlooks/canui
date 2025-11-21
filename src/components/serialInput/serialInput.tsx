import {Fragment, memo, ReactNode, useRef} from 'react'
import {Flex, FlexProps} from '../flex'
import {classes, style} from './serialInput.style'
import {Input, InputProps} from '../input'
import {clsx, mergeComponentProps, useControlled} from '../../utils'
import {InputBaseRef} from '../inputBase'

export interface SerialInputProps<V = string> extends Omit<FlexProps, 'defaultValue' | 'onChange'> {
    separator?: ReactNode | ((index: number) => ReactNode)
    count?: number
    defaultValue?: V[]
    value?: V[]
    onChange?: (value: V[]) => void
    onItemChange?: (value: V, index: number, values: V[]) => void
    inputProps?: InputProps
    renderInputs?(inputProps: InputProps, index: number): ReactNode
    /**
     * 当前输入框的值长度达到jumpLength时，自动将焦点跳转到下一个输入框，
     * `0`表示不自动跳转，默认为`1`
     */
    jumpLength?: number
    /** 所有输入框完成输入后触发，{@link SerialInputProps.jumpLength}不为`0`时有效 */
    onFinish?(value: V[]): void
}

export const SerialInput = memo(({
    separator,
    count = 1,
    defaultValue,
    value,
    onChange,
    onItemChange,
    inputProps,
    renderInputs,
    jumpLength = 1,
    onFinish,
    ...props
}: SerialInputProps) => {
    const inputRefs = useRef<InputBaseRef[]>([])
    inputRefs.current = []

    const [innerValue, setInnerValue] = useControlled(defaultValue || Array(count).fill(''), value, onChange)

    return (
        <Flex
            alignItems="center"
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            {Array(count * 2 - 1).fill(void 0).map((_, i) => {
                if (i % 2 === 0) {
                    const index = i / 2
                    const _inputProps: InputProps = mergeComponentProps(
                        inputProps,
                        {
                            ref: r => {
                                r && inputRefs.current.push(r)
                            },
                            className: classes.inputItem,
                            clearable: false,
                            value: innerValue.current[index],
                            onChange: ({target: {value}}) => {
                                const prevLength = innerValue.current[index].length || 0
                                const newValue = [...innerValue.current]
                                const curr = newValue[index] = value
                                setInnerValue(newValue)

                                if (jumpLength > 0 && prevLength === jumpLength - 1 && curr.length === jumpLength) {
                                    if (index < count - 1) {
                                        // 聚焦后一个输入框
                                        inputRefs.current[index + 1].focus()
                                    } else if (index === count - 1) {
                                        onFinish?.(newValue)
                                    }
                                }
                            },
                            onKeyDown: (e) => {
                                switch (e.key) {
                                    case 'Backspace':
                                        if (innerValue.current[index].length === 0 && index > 0) {
                                            const prevInput = inputRefs.current[index - 1]
                                            prevInput.focus()
                                            const selectionIndex = innerValue.current[index - 1].length
                                            prevInput.setSelectionRange(selectionIndex, selectionIndex)
                                        }
                                        break
                                    case 'ArrowRight':
                                        if (index < count - 1) {
                                            e.preventDefault()
                                            inputRefs.current[index + 1].focus()
                                        }
                                        break
                                    case 'ArrowLeft':
                                        if (index > 0) {
                                            e.preventDefault()
                                            inputRefs.current[index - 1].focus()
                                        }
                                }
                            }
                        }
                    )

                    return renderInputs
                        ? renderInputs(_inputProps, index)
                        : <Input {..._inputProps} key={i}/>
                }

                return separator
                    ? <Fragment key={i}>{typeof separator === 'function' ? separator(i / 2 - 1) : separator}</Fragment>
                    : null
            })}
        </Flex>
    )
})