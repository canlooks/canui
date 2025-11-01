import {Loading} from '../loading'
import {LoadingIndicator} from '../loadingIndicator'
import {MenuItem, MenuItemProps} from '../menuItem'
import {Placeholder} from '../placeholder'
import {classes} from './cascade.style'
import {Collapse} from '../transitionBase'
import {useCascadeContext} from './cascade'
import {MenuOptionType} from '../optionsBase'
import {Id} from '../../types'
import {isUnset, mergeComponentProps} from '../../utils'
import {Icon} from '../icon'
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight'

export function CascadePanel({
    options,
    index = 0
}: {
    options?: MenuOptionType[]
    index?: number
}) {
    const {
        innerLoading, loadingOption, multiple, showCheckbox,
        primaryKey, labelKey, childrenKey, pathifiedValue,
        selectionStatus, optionsMap,
        openedPanels, onOptionClick, onCheckboxClick,
        verticalIndex, setVerticalIndex, horizontalIndex
    } = useCascadeContext()

    const onPointerEnter = () => {
        setVerticalIndex(-1)
    }

    const isSelected = (id: any) => {
        if (isUnset(id)) {
            return false
        }
        if (multiple) {
            return (pathifiedValue as Id[][])?.some(path => path[index] === id)
        }
        return (pathifiedValue as Id[])?.[index] === id
    }

    const renderOptions = () => {
        if (!options?.length) {
            return <Placeholder/>
        }
        return options.map((option, i) => {
            if (!option || typeof option !== 'object') {
                return option
            }
            const {_parentId, ...opt} = option
            const optVal = opt[primaryKey]
            const status = selectionStatus?.get(optVal)
            const opened = openedPanels[index] === optVal
            const hasChildren = !!opt[childrenKey]?.length

            return (
                <MenuItem
                    {...mergeComponentProps<MenuItemProps>(
                        {
                            showCheckbox
                        },
                        opt,
                        {
                            checkboxProps: mergeComponentProps(
                                opt?.checkboxProps,
                                showCheckbox
                                    ? {
                                        indeterminate: status === 1,
                                        checked: status === 2,
                                        async onClick(e) {
                                            e.stopPropagation()
                                            onCheckboxClick(opt, index)
                                        }
                                    }
                                    : void 0
                            ),
                            selected: isSelected(optVal) || (opened && hasChildren),
                            focused: horizontalIndex === index && verticalIndex === i,
                            label: opt[labelKey],
                            onClick: () => onOptionClick(opt, index),
                            onPointerEnter,
                            suffix: innerLoading && loadingOption === optVal
                                ? <LoadingIndicator/>
                                : hasChildren && <Icon icon={faChevronRight}/>,
                            children: null
                        }
                    )}
                    key={optVal}
                />
            )
        })
    }

    const nextOptions = optionsMap!.get(openedPanels[index])?.[childrenKey]

    return (
        <>
            {index === 0
                ? <Loading className={classes.panel} open={innerLoading && typeof loadingOption === 'undefined'}>
                    {renderOptions()}
                </Loading>
                : <div className={classes.panel}>
                    {renderOptions()}
                </div>
            }
            {!!nextOptions?.length &&
                <Collapse className={classes.panelContainer} in orientation="horizontal">
                    <CascadePanel
                        options={nextOptions}
                        index={index + 1}
                    />
                </Collapse>
            }
        </>
    )
}