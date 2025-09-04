import {ReactElement, memo} from 'react'
import {classes} from './upload.style'
import {LoadingIndicator} from '../loadingIndicator'
import {Button} from '../button'
import {Progress} from '../progress'
import {useTheme} from '../theme'
import {ItemProps, useItemStatus} from './itemStatus'
import {Icon} from '../icon'
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons/faCircleCheck'
import {faCircleXmark} from '@fortawesome/free-solid-svg-icons/faCircleXmark'
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark'
import {faPaperclip} from '@fortawesome/free-solid-svg-icons/faPaperclip'

export const FileItem = memo(<R, A extends any[]>(props: ItemProps<R, A>) => {
    const {status, progress} = useItemStatus(props)

    const {colors} = useTheme()

    const statusToIcon: any = {
        'default': <Icon icon={faPaperclip}/>,
        uploading: <LoadingIndicator/>,
        success: <Icon icon={faCircleCheck} style={{color: colors.success.main}}/>,
        error: <Icon icon={faCircleXmark} style={{color: colors.error.main}}/>
    }

    return (
        <div className={classes.file} data-status={status}>
            <div className={classes.icon}>
                {statusToIcon[status]}
            </div>
            <div className={classes.info}>
                <div className={classes.name}>{props.file.name}</div>
                {status !== 'default' &&
                    <Progress
                        className={classes.progress}
                        barWidth={2}
                        showInfo={false}
                        value={progress}
                        status={status === 'uploading' ? 'processing' : status}
                    />
                }
            </div>
            <div className={classes.control}>
                <Button
                    variant="plain"
                    color="error"
                    onClick={props.onRemove}
                >
                    <Icon icon={faXmark}/>
                </Button>
            </div>
        </div>
    )
}) as <R, A extends any[]>(props: ItemProps<R, A>) => ReactElement