import {memo, useMemo} from 'react'
import {Button, Flex, FlexProps, Icon} from '@'
import {classes} from './layout.style'
import {Outlet, useRouter, useRouteStack} from '@canlooks/react-router'
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons'
import {AnchorContext, AnchorNavigation} from '../../components/anchorNavigation/anchorNavigation'

export const PageContent = memo((props: FlexProps) => {
    const [, topRoute, sideRoute] = useRouteStack()

    const currentIndex = useMemo(() => {
        return (sideRoute?.id && topRoute.children?.findIndex(item => item.id === sideRoute.id)) ?? -1
    }, [sideRoute?.id, topRoute.children])

    const {navigate} = useRouter()

    const renderPagingButton = (dir: number) => {
        const sibling = topRoute.children?.[currentIndex + dir]
        return !!sibling?.id &&
            <Button
                variant="text"
                prefix={dir < 0 && <Icon icon={faAngleLeft}/>}
                suffix={dir > 0 && <Icon icon={faAngleRight}/>}
                onClick={() => navigate(`/${topRoute.id}/${sibling.id}`)}
            >
                {sibling.label}
            </Button>
    }

    return (
        <Flex
            alignItems="flex-start"
            {...props}
            className={classes.pageContent}
        >
            <AnchorContext>
                <div className={classes.content}>
                    <Outlet/>
                    <Flex
                        className={classes.pageFooter}
                        alignItems="center"
                        justifyContent="space-between"
                        height={60}
                        marginTop={60}
                    >
                        <div>{renderPagingButton(-1)}</div>
                        <div>{renderPagingButton(1)}</div>
                    </Flex>
                </div>
                <div className={classes.navigation}>
                    <AnchorNavigation/>
                </div>
            </AnchorContext>
        </Flex>
    )
})