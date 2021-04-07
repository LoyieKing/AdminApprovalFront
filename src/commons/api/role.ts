import axios from "./axios";
import { HttpResponse } from "./types";


export type Role = {
    id: number
    name: string
    description?: string
    organizeCategoryId: number
    organizeDutyLevel: number
    availableMenus: string[]
    availableApprovals: string[]
}

export function getRoles(): HttpResponse<Role> {
    return axios.get("sysmanage/role")
}

export function updateRole(data: Partial<Role>): HttpResponse {
    return axios.post("sysmanage/role/update", data)
}

export function deleteRole(id: number): HttpResponse {
    return axios.post("sysmanage/role/delete", undefined, { params: { id } })
}