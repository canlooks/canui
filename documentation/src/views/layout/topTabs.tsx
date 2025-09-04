import {memo, useMemo} from 'react'
import {classes} from './layout.style'
import {Tabs, TabType} from '@'
import {useRouter, useRouteStack} from '@canlooks/react-router'
import {topMenu} from '../../app/routes'

export const TopTabs = memo(() => {
    const [, topRoute] = useRouteStack()

    const tabs: TabType[] = useMemo(() => {
        const result: TabType[] = []
        for (const [id, [route]] of topMenu) {
            result.push({
                label: route.label,
                value: id
            })
        }
        return result
    }, [topMenu])

    const {navigate} = useRouter()

    const tabChange = (id: string) => {
        navigate('/' + id)
    }

    return (
        <Tabs
            className={classes.tabs}
            tabs={tabs}
            value={topRoute?.id}
            onChange={tabChange}
        />
    )
})