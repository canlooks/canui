import {ReactElement, memo, useMemo, useRef} from 'react'
import {classes} from './cascade.style'
import {Highlight} from '../highlight'
import {joinNodes, useKeyboard} from '../../utils'
import {MenuItem} from '../menuItem'
import {usePopperContext} from '../popper'
import {OptionType} from '../selectionContext'
import {Id} from '../../types'

type SearchResultProps<O extends OptionType<V>, V extends Id = Id> = {
    primaryKey: keyof O
    labelKey: keyof O
    childrenKey: keyof O
    searchTokenKey: keyof O
    options?: O[]
    searchValue: string
    onSelect(value: V): void
    selectionStatus: Map<V, 1 | 2>
}

export const SearchResult = memo(<O extends OptionType<V>, V extends Id = Id>({
    primaryKey,
    labelKey,
    childrenKey,
    searchTokenKey,
    options,
    searchValue,
    onSelect,
    selectionStatus
}: SearchResultProps<O, V>) => {
    const allLabelIsString = useRef(true)

    const flattedOptions = useMemo(() => {
        allLabelIsString.current = true
        const ret: {options: O[], searchToken: string}[] = []
        const fn = (arr?: O[], optionsPath: O[] = [], searchTokenPath: string = '') => {
            arr?.forEach(item => {
                if (item && typeof item === 'object') {
                    let searchToken
                    if (typeof item[labelKey] === 'string') {
                        searchToken = item[labelKey]
                    } else {
                        searchToken = item[searchTokenKey]
                        allLabelIsString.current = false
                    }
                    if (searchToken) {
                        item[childrenKey]?.length
                            ? fn(item[childrenKey], [...optionsPath, item], `${searchTokenPath} ${searchToken}`)
                            : ret.push({
                                options: [...optionsPath, item],
                                searchToken: `${searchTokenPath} ${searchToken}`
                            })
                    }
                }
            })
        }
        fn(options)
        return ret
    }, [options, labelKey, childrenKey, searchTokenKey])

    const filteredOptions = useMemo(() => {
        if (!searchValue) {
            return flattedOptions
        }
        const split = searchValue.split(' ')
        return flattedOptions.filter(({searchToken}) => {
            return split.some(k => {
                return k && searchToken.toLowerCase().includes(k.toLowerCase())
            })
        })
    }, [searchValue, flattedOptions])

    const {open, setOpen} = usePopperContext()

    const {verticalIndex} = useKeyboard({
        allowVertical: true,
        verticalCount: filteredOptions?.length,
        open,
        setOpen,
        onEnter({verticalIndex}) {
            const opt = filteredOptions[verticalIndex]
            opt && typeof opt === 'object' && onSelect(opt.options[opt.options.length - 1][primaryKey])
        }
    })

    return (
        <div className={classes.searchResult}>
            {filteredOptions.map((opt, i) => {
                const optVal = opt.options[opt.options.length - 1][primaryKey]
                return (
                    <MenuItem
                        key={optVal}
                        label={
                            allLabelIsString.current
                                ? <Highlight keywords={searchValue?.split(' ')}>
                                    {opt.options.map(o => o[labelKey]).join(' / ')}
                                </Highlight>
                                : joinNodes(opt.options, o => o[labelKey])
                        }
                        selected={selectionStatus.get(optVal) === 2}
                        focused={verticalIndex.current === i}
                        onClick={() => onSelect(optVal)}
                    />
                )
            })}
        </div>
    )
}) as <O extends OptionType<V>, V extends Id = Id>(props: SearchResultProps<O, V>) => ReactElement