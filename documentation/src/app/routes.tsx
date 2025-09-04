import {Redirect, RouteItem} from '@canlooks/react-router'
import {Layout} from '../views/layout/layout'
import {ReactNode} from 'react'
import {guideRoutes} from './routes.guide'
import {componentRoutes} from './routes.components'
import {MarkdownParser} from '../components/markdownParser/markdownParser'

export interface IRouteItem extends RouteItem {
    id?: string
    label?: ReactNode
    children?: IRouteItem[]
}

const markdownRoutes = (parent: string, routes: { id: string, label: string }[]): IRouteItem[] => {
    return [
        ...routes.map(({id, label}) => ({
            id,
            path: id,
            label,
            element: <MarkdownParser path={`/${parent}/${id}.md`}/>
        })),
        {
            path: '*',
            element: <Redirect to={`/${parent}/${routes[0].id}`}/>
        }
    ]
}

export const routes: IRouteItem[] = [
    {
        path: '/',
        element: <Layout/>,
        children: [
            {
                id: 'guide',
                path: 'guide',
                label: '指引',
                children: markdownRoutes('guide', guideRoutes)
            },
            {
                id: 'components',
                path: 'components',
                label: '组件',
                children: markdownRoutes('components', componentRoutes)
            },
            {
                path: '*',
                element: <Redirect to="/guide"/>
            }
        ]
    }
]

export const topMenu = Map.groupBy(routes[0].children!, item => item.id)