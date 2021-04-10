import axios from "./axios";
import { HttpResponse } from "./types";

export type UserOrganize = {
    id: number
    userId: number
    organizeId: number
    dutyLevel: number
}

export function getUserOrganizes(): HttpResponse<UserOrganize[]> {
    return axios.get("sysmanage/userorganize")
}

export function updateUserOrganize(data: UserOrganize): HttpResponse {
    return axios.post("sysmanage/userorganize/update", data)
}

export function deleteUserOrganize(id: number): HttpResponse {
    return axios.post("sysmanage/userorganize/delete", undefined, { params: { id } })
}