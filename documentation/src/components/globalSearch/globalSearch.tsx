import {memo, useEffect, useState} from 'react'
import {Button, Icon, Input, Typography} from '@'
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import {classes, style} from './globalSearch.style'

export const GlobalSearch = memo(() => {
    const [open, setOpen] = useState(false)

    const openFn = () => {
        setOpen(true)
    }

    useEffect(() => {
        const keydown = (e: KeyboardEvent) => {
            if (e.key === 'k' && e.ctrlKey) {
                e.preventDefault()
                openFn()
            }
        }
        addEventListener('keydown', keydown)
        return () => {
            removeEventListener('keydown', keydown)
        }
    }, [])

    return (
        <div css={style}>
            <Input
                className={classes.searchInput}
                placeholder="搜索"
                prefix={<Icon icon={faMagnifyingGlass}/>}
                suffix={
                    <Typography.kbd>Ctrl+K</Typography.kbd>
                }
                readOnly
                onClick={openFn}
            />
            <Button
                className={classes.searchButton}
                variant="plain"
                color="text.disabled"
                onClick={openFn}
                prefix={<Icon icon={faMagnifyingGlass}/>}
            />
        </div>
    )
})