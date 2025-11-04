import {memo} from 'react'
import {clsx} from '../../utils'
import {classes, style} from './errorBoundary.style'
import {Placeholder, PlaceholderProps} from '../placeholder'
import {Button} from '../button'
import {Icon} from '../icon'
import {faRotateRight} from '@fortawesome/free-solid-svg-icons/faRotateRight'

export interface ErrorBoundaryProps extends PlaceholderProps {
    error?: any | null
    reload?(): void
    reloadable?: boolean
}

const placeholderSlots: PlaceholderProps['slots'] = {
    description: 'pre'
}

export const ErrorBoundary = memo(({
    error,
    reload,
    reloadable,
    ...props
}: ErrorBoundaryProps) => {
    const renderDescriptions = () => {
        if (error instanceof Error) {
            return error.stack
        }
        const errorType = typeof error
        if (['string', 'number', 'boolean'].includes(errorType)) {
            return error.toString()
        }
    }

    return (
        <Placeholder
            status="error"
            description={renderDescriptions()}
            slots={placeholderSlots}
            extra={reloadable &&
                <Button
                    variant="outlined"
                    color="text.secondary"
                    prefix={<Icon icon={faRotateRight}/>}
                    onClick={reload}
                >
                    重新加载
                </Button>
            }
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        />
    )
})