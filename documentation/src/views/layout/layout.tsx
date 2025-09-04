import {Button, Flex, Icon, Tooltip} from '@'
import logo from '/logo.png'
import {classes, style} from './layout.style'
import {version} from '../../../../package.json'
import {faBars} from '@fortawesome/free-solid-svg-icons'
import {faGithub} from '@fortawesome/free-brands-svg-icons'
import {PageContent} from './pageContent'
import {memo} from 'react'
import {TopTabs} from './topTabs'
import {SideMenu} from './sideMenu'
import {Appearance} from './appearance'
import {GlobalSearch} from '../../components/globalSearch/globalSearch'

const sideGap = 24
const contentGap = 60

export const Layout = memo(() => {
    return (
        <div
            css={style}
            className={classes.root}
        >
            <Flex className={classes.contentWrap}>
                <Flex
                    className={classes.sideLeft}
                    width={300}
                    height="100vh"
                    direction="column"
                >
                    <Flex
                        className={classes.header}
                        gap={12}
                        padding="9px 0"
                    >
                        <img src={logo} height="100%" alt="logo"/>
                        <div className={classes.title}><span>Canlooks</span> UI</div>
                    </Flex>
                    <SideMenu
                        flex={1}
                        paddingRight={sideGap}
                    />
                    <Flex
                        className={classes.footer}
                        height={50}
                        alignItems="center"
                        justifyContent="space-between"
                        marginRight={sideGap}
                    >
                        <div className={classes.copyright}>© C.Canliang</div>
                        <div className={classes.copyright}>v{version}</div>
                    </Flex>
                </Flex>
                <Flex
                    className={classes.sideRight}
                    flex={1}
                    direction="column"
                    minWidth={0}
                    minHeight="100vh"
                >
                    <Flex
                        className={classes.header}
                        justifyContent="space-between"
                        paddingLeft={contentGap}
                    >
                        <Button className={classes.menuButton} variant="ghost">
                            <Icon icon={faBars}/>
                        </Button>
                        <TopTabs/>
                        <Flex gap={9} alignItems="center">
                            <GlobalSearch/>
                            <Appearance/>
                            <Tooltip title="Github">
                                <Button variant="plain" color="text.disabled">
                                    <Icon icon={faGithub}/>
                                </Button>
                            </Tooltip>
                        </Flex>
                    </Flex>
                    <PageContent
                        paddingLeft={contentGap}
                        gap={contentGap}
                    />
                </Flex>
            </Flex>
        </div>
    )
})