Promise.withResolvers ||= function withResolvers<T>() {
    if (!this) throw new TypeError('Promise.withResolvers called on non-object')
    const out = {} as {
        promise: Promise<T>
        resolve: (value: T | PromiseLike<T>) => void
        reject: (reason?: any) => void
    }
    out.promise = new this((resolve, reject) => {
        out.resolve = resolve
        out.reject = reject
    })
    return out
}

export {}