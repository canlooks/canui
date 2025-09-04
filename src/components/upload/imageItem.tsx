import {ReactElement, memo, useState} from 'react'
import {ItemProps, useItemStatus} from './itemStatus'
import {classes} from './upload.style'
import {Image} from '../image'
import {Button} from '../button'
import {Progress} from '../progress'
import {clsx} from '../../utils'
import {Icon} from '../icon'
import {faTrashCan} from '@fortawesome/free-regular-svg-icons/faTrashCan'
import {faEye} from '@fortawesome/free-regular-svg-icons/faEye'

interface ImageItemProps<R, A extends any[]> extends ItemProps<R, A> {
}

export const ImageItem = memo(<R, A extends any[]>(props: ImageItemProps<R, A>) => {
    const [previewOpen, setPreviewOpen] = useState(false)

    const {status, progress} = useItemStatus(props)

    return (
        <div className={classes.imageWrap}>
            <Image
                className={classes.image}
                src={props.file.url}
                previewProps={{
                    open: previewOpen,
                    onOpenChange: setPreviewOpen
                }}
                actions={[
                    <Button
                        key="preview"
                        size="small"
                        variant="text"
                        shape="circular"
                        color="text.secondary"
                        onClick={() => setPreviewOpen(true)}
                    >
                        <Icon icon={faEye}/>
                    </Button>,
                    <Button
                        key="delete"
                        size="small"
                        variant="text"
                        shape="circular"
                        color="error"
                        onClick={props.onRemove}
                    >
                        <Icon icon={faTrashCan}/>
                    </Button>
                ]}
            >
                {status !== 'default' &&
                    <div className={clsx(classes.progress)}>
                        <Progress
                            variant="circular"
                            showInfo={status !== 'uploading'}
                            value={progress}
                            status={status === 'uploading' ? 'processing' : status}
                        />
                    </div>
                }
            </Image>
        </div>
    )
}) as <R, A extends any[]>(props: ItemProps<R, A>) => ReactElement