import {Component, ErrorInfo, ReactNode, cloneElement, createContext, isValidElement, useContext} from 'react'
import {ErrorBoundary} from './errorBoundary'

export type BoundaryProps<Data = any, Params = any, Args = any> = {
    children?: ReactNode | ((data: Data | null, reload: (...params: Params[]) => void) => ReactNode)
    onError?(error: Error, errorInfo: ErrorInfo): void
    renderError?: ReactNode | ((errorProps: {
        error: any
        reload?(...params: Params[]): void
    }) => ReactNode)
    renderLoading?: ReactNode | ((...args: Args[]) => ReactNode)
    loadData?(passLoadingArgs: (...args: Args[]) => void, ...params: Params[]): Data | Promise<Data>
}

type BoundaryContext<Data = any, Params = any> = {
    data?: Data | null
    reload?(...params: Params[]): void
}

const BoundaryContext = createContext<BoundaryContext>({})

export function useBoundaryContext<Data = any, Params = any>(): BoundaryContext<Data, Params> {
    return useContext(BoundaryContext)
}

type BoundaryState<Data = any> = {
    error: any | null
    loading: boolean
    loadingComponent: ReactNode
    progress: number
    data: Data | null
}

export class Boundary<Data = any, Params = any, Args = any> extends Component<BoundaryProps<Data, Params, Args>, BoundaryState<Data>> {
    static ErrorBoundary = ErrorBoundary

    static defaultProps: BoundaryProps = {
        renderError: <ErrorBoundary/>
    }

    static getDerivedStateFromError(error: any) {
        return {error}
    }

    override state: BoundaryState<Data> = {
        error: null,
        progress: 0,
        data: null,
        ... this.props.loadData
            ? {
                loading: true,
                loadingComponent: typeof this.props.renderLoading === 'function'
                    ? this.props.renderLoading()
                    : this.props.renderLoading
            }
            : {
                loading: false,
                loadingComponent: null
            }
    }

    private passLoadingArgs = (...args: Args[]) => {
        typeof this.props.renderLoading === 'function' && this.setState({
            loadingComponent: this.props.renderLoading(...args)
        })
    }

    private reload = async (...params: Params[]) => {
        const {loadData} = this.props
        if (loadData) {
            this.setState({loading: true})
            try {
                const data = await loadData(this.passLoadingArgs, ...params)
                !this.isUnmounted && this.setState({
                    loading: false,
                    data,
                    error: null
                })
            } catch (error) {
                !this.isUnmounted && this.setState({
                    loading: false,
                    data: null,
                    error
                })
                throw error
            }
        } else {
            this.setState({error: null})
        }
    }

    override async componentDidMount() {
        await this.reload()
    }

    private isUnmounted = false

    override componentWillUnmount() {
        this.isUnmounted = true
    }

    override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        this.props.onError?.(error, errorInfo)
    }

    private renderError = () => {
        const errorProps = {
            error: this.state.error!,
            reload: this.reload
        }
        const {renderError} = this.props
        return typeof renderError === 'function'
            ? renderError(errorProps)
            : isValidElement(renderError)
                ? cloneElement(renderError, errorProps)
                : renderError
    }

    private renderChildren = () => {
        return typeof this.props.children === 'function'
            ? this.props.children(this.state.data, this.reload)
            : this.props.children
    }

    override render() {
        const {loading, loadingComponent, error} = this.state

        return loading
            ? loadingComponent
            : error
                ? this.renderError()
                : <BoundaryContext value={{
                    data: this.state.data,
                    reload: this.reload
                }}>
                    {this.renderChildren()}
                </BoundaryContext>
    }
}