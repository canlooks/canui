import {Fragment, memo, useMemo, useState} from 'react'
import {useRouter, useRouteStack} from '@canlooks/react-router'
import {IRouteItem, topMenu} from '../../app/routes'
import {Divider, Flex, FlexProps, Icon, MenuItem, Segmented, Tooltip, Typography} from '@'
import {classes} from './layout.style'
import {faArrowUpAZ, faLayerGroup} from '@fortawesome/free-solid-svg-icons'
import {Id} from '@/types'
import {categorizedComponents, componentRoutesMap} from '../../app/routes.components'

export const SideMenu = memo((props: FlexProps) => {
    const [, topRoute, sideRoute] = useRouteStack()

    const {navigate} = useRouter()

    const itemClick = (id: string) => {
        navigate(`/${topRoute.id}/${id}`)
    }

    const [currentRoute] = topMenu.get(topRoute.id)!

    const [orderType, setOrderType] = useState<Id>('group')

    const renderedMenu = useMemo(() => {
        const renderItem = ({id, label}: IRouteItem) => (
            <MenuItem
                key={id}
                size="large"
                label={label}
                selected={id === sideRoute?.id}
                onClick={() => itemClick(id!)}
            />
        )
        if (currentRoute.id === 'components' && orderType === 'group') {
            return categorizedComponents.flatMap(([category, ids]) => {
                return ids.length
                    ? <Fragment key={category}>
                        <Divider className={classes.categoryDivider} textAlign="start">{category}</Divider>
                        {ids.map(id => {
                            const [component] = componentRoutesMap.get(id)!
                            return renderItem(component)
                        })}
                    </Fragment>
                    : []
            })
        }
        return currentRoute.children?.flatMap(v => {
            return v.id ? renderItem(v) : []
        })
    }, [sideRoute, currentRoute, orderType])

    return (
        <Flex
            {...props}
            className="scrollbar"
            direction="column"
            overflowY="auto"
        >
            <Flex className={classes.sideMenuTitle} alignItems="center" justifyContent="space-between">
                <Typography color="text.placeholder">{currentRoute.label}</Typography>
                {currentRoute.id === 'components' &&
                    <Segmented
                        options={[
                            {
                                value: 'group',
                                label: (
                                    <Tooltip title="分组">
                                        <Icon className={classes.segmentedLabel} icon={faLayerGroup}/>
                                    </Tooltip>
                                )
                            },
                            {
                                value: 'ordered',
                                label: (
                                    <Tooltip title="首字母顺序">
                                        <Icon className={classes.segmentedLabel} icon={faArrowUpAZ}/>
                                    </Tooltip>
                                )
                            }
                        ]}
                        value={orderType}
                        onChange={setOrderType}
                    />
                }
            </Flex>
            {renderedMenu}
        </Flex>
    )
})