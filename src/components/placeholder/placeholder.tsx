import {ReactNode, memo} from 'react'
import {classes, style} from './placeholder.style'
import {DivProps, SlotsAndProps, Status} from '../../types'
import {clsx} from '../../utils'
import {useTheme} from '../theme'

export const imagePreset = {
    emptyLight: 'data:image/png;base64,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',
    emptyDark: 'data:image/png;base64,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',
    success: 'data:image/png;base64,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',
    warning: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFx0lEQVR4nO2c22tcRRzHR2ur1tbaaq0xYeey24QGW1pTW6jgXRovtW2MTYKib74UfBahLIKCNeyemdkYWVBEUJT8Ez6Ib+qTovgiBG3JnpmzG+sFonTlt0mWNTUmntucy3zgB2V7cvr7/b47Z5o53xmELBaLxWKxWCwWi8VisVgslgQzN4e2/FS7+3aPswIE/Bk+M51X5mmXh7c1HXxYSTamJZvqDSXxGPwdXGM6z0wyXxnY4zrkmbWNXxueoKdas4XdpvPNFO163/Z/+9avF4rTZxdm9u4wnXcmaLfRddohJzfb/G445CT8rOn8U88iZ/v/d/NXAn7WdP6ppl0e3gaTq18B4FH0gyjdaLqO1OKK4ojf5q8G3MN0HalEidKtWpKJoAI0OJ706myX6XpSh+vgh4I2vzsKqoVHTNeTKlRloD+s5nfng8pAv+m6UkG7jK73OH06bAFcQU/BvU3Xl3iUgw+E3fzuKHDwAdP1JZofP8A3qSodj0qApqDj85WBm03XmVhakh6LqvndUSDpMdN1JpLWbGG35mwyagHg32hVBvaYrjdxuJw9GnnzV0cBp4+brjdReDMEx9X81fCmCTZddyJoz6Et3ibW+UMXQJDTn5XRDSjveBV2MO7m98wH96A883O9b7uu0eeMCSDIucvT+25BeUWL4olgjxH6PEQwEQonUB75pT54R8Px17SmpK9rQb9XnF5die80fOZThMvT7E6UJ9rI52tGyaY8SaeVIH9pQdu9AZ95gr7tbxTgUcgJ5YUFUSr6a37pBcWpt7b5PaHhGj/3bs3uZygPfPnyyNamxGf8CcDK/9H85ZHAWdnXY43js+36yFaUdcA85XvCrLHqRgJ0rvF5/wUHH0ZZpj0zvKPhBHjNyKmzoQBwjd/7SzLhvje0E2UVzyEP+G8Oi0EANgU5oixyhdN9gZov4xEAolEt9KHMudskfiI1Akj2VKZeXy7W6GDg5sv4BOiIUKODKDvuts0ba3VCBABXXTsLrjq3xo6G0nwZrwAQbpUdRWnGe4vtAmdaWgXQnE02HXwbSiuuwA+H1gxpQIA0u+qU6B8ItfnSjAAQUAtKE1G527QhAWDbU6r+W6pEaTj05ktzAiyPgsIwSo27TUTkbuPmBEiNq27RIccjab40K0BnFDjkOMq1u42bFQBqg03hKKkoSR+LrHiZAAGS7KprOphE2nzZsZFs/EIGrok4D3DyoaS521xBTkdeuCQXNhJAcXIh6jxcB59JlKvOq8XjbvM4vJQn7vrNp43APqHN5lJhB1Fi3G2CnIujaN3ZasTe1JwsXfvsJ0tasjdy56rTkt0fW9FyORSnrylOv1aC/tEJTr/yOHs17jygdqPNvyRKe/2627ISV2YNueqCuNsyFQKPGjkUZKFSLBkvXiYjWqJUjLX54CBTHJ81XbhOSICr7ps4T+pqCnzEdNE6YdEQ+EgszXcvDu0M5G4LMRRnLylZfNF0HstBJuCAkcgFaAjyoOliPUne1YJe6v4CJsi85lQaz2smYlfdwgy+y3iRgn6y3m/CrqAfms7v13pErrqOu43jJw1/819Rgvy5/kooWXIFPW82x4hcda5Dhkx/u5Sgn260GOdJ8rHpPKFXyXW3BRGAky82XA0V5HPzeYbsqnM5vc90UTpFAkC0aiG56uDQ1FDdbTl4BOmVs+pgpTiwAN479JDpYnTvJMyv3SHZOwl7ong+MflyeiiwALDYZLoQ3RucfbTOy5irnmTvG8+vNxxyMrAAMKEYL0T+MxQnFdiorQX9XXH6myfpt0rQi4nLU+Kx4AJEZbLKQagqHQ8sQChbi/IaAo8m4vjgvEazVrw3sACwwpf3147aZ8AGlcACdEZBNcRtRjmJVpiHhsPiUpyH6umUB/Qq9AU5uCGoah9HbN3GQ29gzox0MwfMCZ2JWeDRKE+51SmJTg8EHoWexPJGzGKxWCwWi8VisVgsFovFgtLK3/poa/OaSgE4AAAAAElFTkSuQmCC',
    error: 'data:image/png;base64,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',
    info: 'data:image/png;base64,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',
    searching: 'data:image/png;base64,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'
}

export interface PlaceholderProps extends Omit<DivProps, 'title'>, SlotsAndProps<{
    title: DivProps
    description: DivProps
    extra: DivProps
}> {
    status?: 'empty' | 'searching' | Status
    image?: ReactNode
    title?: ReactNode
    description?: ReactNode
    extra?: ReactNode
}

export const Placeholder = memo(({
    slots,
    slotProps,
    status = 'empty',
    image,
    title = status === 'warning' ? '警告'
        : status === 'error' ? '出错啦'
            : status === 'success' ? '成功'
                : void 0,
    description = status === 'empty' ? '暂无数据'
        : status === 'searching' ? '搜索中...'
            : void 0,
    extra,
    ...props
}: PlaceholderProps) => {
    const {mode} = useTheme()

    const {
        title: Title = 'div',
        description: Description = 'div',
        extra: Extra = 'div'
    } = slots || {}

    const {
        title: titleProps,
        description: descriptionProps,
        extra: extraProps
    } = slotProps || {}

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            {image ??
                <img
                    className={classes.image}
                    src={status === 'empty'
                        ? (mode === 'light' ? imagePreset.emptyLight : imagePreset.emptyDark)
                        : imagePreset[status]
                    }
                    alt=""
                />
            }
            {!!title &&
                <Title
                    {...titleProps}
                    className={clsx(classes.title, titleProps?.className)}
                >
                    {title}
                </Title>
            }
            {!!description &&
                <Description
                    {...descriptionProps}
                    className={clsx(classes.description, descriptionProps?.className)}
                >
                    {description}
                </Description>
            }
            {!!extra &&
                <Extra
                    {...extraProps}
                    className={clsx(classes.extra, extraProps?.className)}
                >
                    {extra}
                </Extra>
            }
        </div>
    )
})