import {memo} from 'react'
import {Button} from '../button'
import {classes} from './pagination.style'
import {usePaginationContext} from './pagination'
import {clsx} from '../../utils'
import {useTheme} from '../theme'
import {DivProps} from '../../types'
import {Icon} from '../icon'
import {faEllipsis} from '@fortawesome/free-solid-svg-icons/faEllipsis'
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons/faAngleLeft'
import {faAngleRight} from '@fortawesome/free-solid-svg-icons/faAngleRight'

export interface PaginationPagerProps extends DivProps {
}

export const PaginationPager = memo((props: PaginationPagerProps) => {
    const {text} = useTheme()

    const {size, pageCount, page, onPageChange} = usePaginationContext()

    const renderPageButton = (i: number, ellipsis?: boolean) => {
        const btnPage = i + 1
        const isActive = !ellipsis && btnPage === page
        return (
            <Button
                key={i}
                className={classes.button}
                variant={isActive ? 'outlined' : 'text'}
                color={isActive ? 'primary' : text.primary}
                size={size}
                readOnly={isActive}
                onClick={() => onPageChange(btnPage)}
            >
                {ellipsis ? <Icon icon={faEllipsis}/> : btnPage}
            </Button>
        )
    }

    const renderPageList = () => {
        if (pageCount <= 9) {
            // 少于9页无需省略号
            return Array(pageCount).fill(void 0).map((_, i) => {
                return renderPageButton(i)
            })
        }
        if (page < 6) {
            // 当前页小于6，只需右侧省略号
            return Array(9).fill(void 0).map((_, i) => {
                return i === 8
                    ? renderPageButton(pageCount - 1)
                    : renderPageButton(i, i === 7)
            })
        }
        if (page > pageCount - 5) {
            // 只需左侧省略号
            return Array(9).fill(void 0).map((_, i) => {
                return i === 0
                    ? renderPageButton(i)
                    : renderPageButton(pageCount - 9 + i, i === 1)
            })
        }
        // 两侧都有省略号
        return Array(9).fill(void 0).map((_, i) => {
            return i === 0
                ? renderPageButton(i)
                : i === 8
                    ? renderPageButton(pageCount - 1)
                    : renderPageButton(page + i - 5, i === 1 || i === 7)
        })
    }

    return (
        <div
            {...props}
            className={clsx(classes.pager, props.className)}
        >
            <Button
                className={classes.button}
                variant="text"
                size={size}
                color="text.secondary"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            >
                <Icon icon={faAngleLeft}/>
            </Button>
            {renderPageList()}
            <Button
                className={classes.button}
                variant="text"
                size={size}
                color="text.secondary"
                disabled={page === pageCount}
                onClick={() => onPageChange(page + 1)}
            >
                <Icon icon={faAngleRight}/>
            </Button>
        </div>
    )
})