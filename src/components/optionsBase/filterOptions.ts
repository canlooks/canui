import {Children, isValidElement, ReactNode, useMemo} from 'react'
import {Id} from '../../types'
import {MenuOptionType, OptionsBaseProps} from './optionsBase'

export function useFilterOptions<O extends MenuOptionType<V>, V extends Id = Id>({
    searchValue,
    options,
    children,
    filterPredicate,
    labelKey = 'label',
    searchTokenKey = 'searchToken',
    _optionsAlreadyFilter
}: Pick<OptionsBaseProps<O, V>, 'searchValue' | 'children' | 'options' | 'filterPredicate' | 'labelKey' | 'searchTokenKey' | '_optionsAlreadyFilter'>): (O | ReactNode)[] {
    return useMemo(() => {
        if (_optionsAlreadyFilter) {
            return options || Children.toArray(children)
        }
        const trimmedSearchValue = searchValue?.trim()
        if (!trimmedSearchValue) {
            return options || Children.toArray(children)
        }
        const splitValue = trimmedSearchValue.split(' ')
        const filterFn = (opt: O, index: number) => {
            let ret = false
            if (filterPredicate) {
                ret = filterPredicate(trimmedSearchValue!, opt, index)
            } else {
                const searchToken = typeof opt[labelKey] === 'string' ? opt[labelKey] : opt[searchTokenKey]
                if (typeof searchToken === 'string') {
                    ret = splitValue.some(k => {
                        return k && searchToken.toLowerCase().includes(k.toLowerCase())
                    })
                }
            }
            return ret
        }
        return options
            ? options.filter(filterFn)
            : Children.toArray(children).filter((c, index) => {
                return isValidElement(c) && filterFn(c.props as O, index)
            })
    }, [searchValue, filterPredicate, options, children, labelKey, searchTokenKey, _optionsAlreadyFilter])
}