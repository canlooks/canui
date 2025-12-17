'use client'

import {CacheProvider} from '@emotion/react'
import createCache from '@emotion/cache'
import {useServerInsertedHTML} from 'next/navigation'
import {ReactNode, useState} from 'react'

export default function EmotionProvider({
    children
}: {
    children?: ReactNode
}) {
    const [{cache, flush}] = useState(() => {
        const cache = createCache({key: 'css'})
        cache.compat = true
        const {insert} = cache
        let inserted: string[] = []
        cache.insert = (...args) => {
            const serialized = args[1]
            if (!cache.inserted[serialized.name]) {
                inserted.push(serialized.name)
            }
            return insert(...args)
        }
        return {
            cache,
            flush: () => {
                const _inserted = inserted
                inserted = []
                return _inserted
            }
        }
    })

    useServerInsertedHTML(() => {
        const names = flush()
        if (names.length === 0) {
            return
        }
        let styles = ''
        for (const name of names) {
            styles += cache.inserted[name]
        }

        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{
                    __html: styles
                }}
            />
        )
    })

    return <CacheProvider value={cache}>{children}</CacheProvider>
}
