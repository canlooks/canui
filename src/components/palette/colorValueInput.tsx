import {ReactNode} from 'react'
import {Input} from '../input'
import {classes} from './palette.style'
import {FixInputNumberParam, fixInputNumber, useDerivedState} from '../../utils'
import {DivProps} from '../../types'
import Color from 'color'

interface ColorValueInputProps extends Omit<DivProps, 'onChange'>, FixInputNumberParam {
    value: string | number
    label: ReactNode
    onChange(value: string): void
    hex?: boolean
}

export function ColorValueInput({
    value,
    label,
    onChange,
    hex,
    min,
    max,
    precision,
    ...props
}: ColorValueInputProps) {
    const [innerValue, _setInputValue] = useDerivedState(hex ? value.toString().slice(1) : value + '')
    const setInputValue = (val: string) => {
        _setInputValue(val)
        if (hex) {
            hexValidator(val) && onChange('#' + val)
        } else {
            const fixedValue = fixInputNumber(val, {min, max, precision})
            fixedValue && onChange(fixedValue)
        }
    }

    const hexValidator = (val: string) => {
        try {
            Color('#' + val, 'hex')
            return true
        } catch (e) {
            return false
        }
    }

    const blurHandler = () => {
        if (hex) {
            if (!hexValidator(innerValue.current)) {
                _setInputValue(value.toString().slice(1))
            }
        } else {
            const fixedValue = fixInputNumber(innerValue.current, {min, max, precision}) || value + ''
            if (fixedValue !== innerValue.current) {
                _setInputValue(fixedValue)
                onChange(fixedValue)
            }
        }
    }

    return (
        <div {...props} className={classes.inputItem}>
            <Input
                className={classes.input}
                size="small"
                clearable={false}
                value={innerValue.current}
                onChange={e => setInputValue(e.target.value)}
                onBlur={blurHandler}
                prefix={hex && '#'}
            />
            <div className={classes.inputItemLabel}>{label}</div>
        </div>
    )
}