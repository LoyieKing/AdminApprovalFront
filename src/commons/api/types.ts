import { AxiosResponse } from "axios"



export type Response<T> = { success: true, data: T } | { success: false, message: string }
export type HttpResponse<T = never> = Promise<AxiosResponse<Response<T>>>


export type Pagination = {
    /**
     * 一页的行数
     */
    rows: number;
    /**
     * 当前页
     */
    page: number;
    /**
     * 总页数
     */
    total: number;

    /**
     * 总记录数
     */
    records: number;
}

export type PaginationQuery = {
    /**
     * 一页的行数
     */
    rows: number;
    /**
     * 当前页
     */
    page: number;
}
