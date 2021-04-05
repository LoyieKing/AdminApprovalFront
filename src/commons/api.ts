import { AxiosResponse } from "axios";
import Axios from 'axios';
import { getLoginUser } from "commons";


const BASE_URL = "https://localhost:9246/api/"

const axios = Axios.create({
    baseURL: BASE_URL,
    withCredentials: true //接收Set-Cookie
})

axios.interceptors.request.use(req => {
    let user = getLoginUser()
    let token = user?.token
    if (token) {
        req.headers["Authorization"] = "Bear " + token
    }
    return req
})

type Response<T> = { success: true, data: T } | { success: false, message: string }
type HttpResponse<T = any> = Promise<AxiosResponse<Response<T>>>

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

/**
 * 获取验证码
 */
export function getAuthCode(): Promise<AxiosResponse<any>> {
    return axios.get("login/getauthcode", { "responseType": "blob" })
}

/**
 * 请求登录，登录结果保存在cookie中
 */
export function login(username: string, password: string, code: string, codeSession: string): HttpResponse<string> {
    return axios.post("login/checklogin", { username, password, code }, {
        headers: {
            "vcode-session": codeSession
        }
    })
}

/**
 * 登出
 */
export function outLogin(): HttpResponse {
    return axios.get("login/outlogin")
}

export type UserEntity = {
    userName: string;
    realName: string;
    avatar?: string;
    gender?: string;
    birthday?: string;
    contract: string;
    isAdministartor?: boolean;
    enableMark?: boolean;
    password: string;
}

export function getUsers(pagination: PaginationQuery, keyword: string):
    HttpResponse<{
        rows: UserEntity[];
        total: number;
        page: number;
        records: number;
    }> {
    return axios.get(`sysmanage/user?keyword=${keyword}&pagination=${JSON.stringify(pagination)}`)
}

export function getUser(id: number): HttpResponse<UserEntity> {
    return axios.get(`sysmanage/user/one?id=${id}`)
}

export function updateUser(entity: UserEntity): HttpResponse<never> {
    return axios.post(`sysmanage/user/update`, entity)
}