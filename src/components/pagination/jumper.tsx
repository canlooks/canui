import {Ref, memo, useState} from 'react'
import {DivProps} from '../../types'
import {clsx} from '../../utils'
import {classes} from './pagination.style'
import {Input, InputProps} from '../input'
import {usePaginationContext} from './pagination'
import {InputBaseRef} from '../inputBase'

export interface PaginationJumperProps extends DivProps {
    InputProps?: InputProps
    InputRef?: Ref<InputBaseRef>
}

export const PaginationJumper = memo(({
        InputProps,
        InputRef,
        ...props
    }: PaginationJumperProps) => {
        const {size, onPageChange, pageCount} = usePaginationContext()

        const [inputValue, setInputValue] = useState('')

        const changeFn = () => {
            const targetPage = parseInt(inputValue)
            if (!isNaN(targetPage)) {
                onPageChange(
                    Math.max(
                        1,
                        Math.min(targetPage, pageCount)
                    )
                )
            }
            setInputValue('')
        }

        return (
            <div
                {...props}
                className={clsx(classes.jumper, props.className)}
            >
                <span>跳至</span>
                <Input
                    size={size}
                    clearable={false}
                    {...InputProps}
                    ref={InputRef}
                    className={clsx(classes.input, InputProps?.className)}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onBlur={changeFn}
                    onKeyDown={e => e.key === 'Enter' && changeFn()}
                />
                <span>页</span>
            </div>
        )
    }
)