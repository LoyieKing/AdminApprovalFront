import { AxiosResponse } from "axios";
import { getLoginUser } from "commons";
import axios from './axios';
import { HttpResponse, PaginationQuery } from "./types";


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

export function deleteUser(id: number): HttpResponse<never> {
    return axios.post(`sysmanage/user/delete?id=${id}`)
}

export function deleteUsers(ids: number[]): HttpResponse<never> {
    return axios.post(`sysmanage/user/deletes`, ids)
}