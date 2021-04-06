import { message } from 'antd';
import { useState } from 'react';
import { Response } from './api/types';


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

export function purifyResponse<T>(resp: Response<T>, onError?: (resp: Response<T>) => void): T | undefined {
    if (resp.success) {
        return resp.data
    } else if (resp.success === false) {
        message.error(resp.message)
        onError?.call(this, resp)
    } else {
        message.error("响应错误")
        throw resp
    }
}