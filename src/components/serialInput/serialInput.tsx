import {Fragment, memo, ReactNode, useRef} from 'react'
import {Flex, FlexProps} from '../flex'
import {classes, style} from './serialInput.style'
import {Input, InputProps} from '../input'
import {clsx, mergeComponentProps, useControlled} from '../../utils'

export interface SerialInputProps<V = string> extends Omit<FlexProps, 'defaultValue' | 'onChange'> {
    separator?: ReactNode
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
    ...props
}: SerialInputProps) => {
    const inputRefs = useRef<HTMLInputElement[]>([])
    inputRefs.current = []

    const [innerValue, setInnerValue] = useControlled(defaultValue || [], value, onChange)

    return (
        <Flex
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            {Array(count * 2 - 1).fill(void 0).map((_, index) => {
                if (index % 2 === 1) {
                    const _inputProps: InputProps = mergeComponentProps(
                        inputProps,
                        {
                            inputProps: mergeComponentProps(
                                inputProps?.inputProps,
                                {
                                    ref: r => {
                                        r && inputRefs.current.push(r)
                                    }
                                }
                            ),
                            className: classes.inputItem,
                            value: innerValue.current[index],
                            onChange: e => {
                                const prevLength = innerValue.current[index]?.length || 0
                                const newValue = [...innerValue.current]
                                const curr = newValue[index] = e.target.value
                                setInnerValue(newValue)
                                if (jumpLength > 0 && index < count * 2 - 2 && prevLength === jumpLength - 1 && curr.length === jumpLength) {
                                    inputRefs.current[index + 1].focus()
                                }
                            }
                        }
                    )

                    return renderInputs
                        ? renderInputs(_inputProps, index)
                        : <Input {..._inputProps} key={index}/>
                }

                return <Fragment key={index}>{separator}</Fragment>
            })}
        </Flex>
    )
})