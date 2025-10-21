import {Dispatch, SetStateAction, memo} from 'react'
import {Tooltip} from '../tooltip'
import {Bubble} from '../bubble'
import {MenuItem} from '../menuItem'
import {Button} from '../button'
import {Size} from '../../types'
import {Icon} from '../icon'
import {faArrowsUpDown} from '@fortawesome/free-solid-svg-icons/faArrowsUpDown'

export const CurdResizable = memo(({innerSize, setInnerSize}: {
    innerSize: Size
    setInnerSize: Dispatch<SetStateAction<Size>>
}) => {
    return (
        <Tooltip title="表格尺寸" clickToClose>
            <Bubble
                placement="bottom"
                trigger="click"
                content={
                    <>
                        <MenuItem
                            value="small"
                            label="小"
                            selected={innerSize === 'small'}
                            onClick={() => setInnerSize('small')}
                        />
                        <MenuItem
                            value="medium"
                            label="中"
                            selected={innerSize === 'medium'}
                            onClick={() => setInnerSize('medium')}
                        />
                        <MenuItem
                            value="large"
                            label="大"
                            selected={innerSize === 'large'}
                            onClick={() => setInnerSize('large')}
                        />
                    </>
                }
            >
                <Button
                    shape="circular"
                    variant="text"
                    color="text.secondary"
                >
                    <Icon icon={faArrowsUpDown}/>
                </Button>
            </Bubble>
        </Tooltip>
    )
})