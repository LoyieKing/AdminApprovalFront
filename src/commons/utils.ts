import { useState } from 'react';


type Function<TParam extends any[], TReturn> = (...params: TParam) => TReturn

export function usePromise<TParam extends any[], TReturn>(func: Function<TParam, Promise<TReturn>>): [boolean, Function<TParam, Promise<TReturn>>] {
    const [loading, setLoading] = useState(false)
    const decorFunc = (...params: TParam): Promise<TReturn> => {
        setLoading(true)
        return func(...params).finally(() => {
            setLoading(false)
        })
    }
    return [loading, decorFunc]
}