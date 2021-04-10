import axios from "../axios";
import { HttpResponse } from "../types";


export type ApprovalInstance = {
    id: number
    desc: string
    prototype: string
    values: {
        id: number
        name: string
        type: string
        value: string
        status: string
    }[]
    creator: string
    modifer: string
    state: string
}

export function getApprovalInstances(): HttpResponse<ApprovalInstance[]> {
    return axios.get("approvalinstance")
}

export function getWaitingApprovalInstances(): HttpResponse<ApprovalInstance[]> {
    return axios.get("approvalinstance/waiting")
}


type NewApprovalParam = {
    prototypeId: number
    values: { [infoId: number]: string }
    description: string
}
export function newApprovalInstance(param: NewApprovalParam): HttpResponse {
    return axios.post("approvalinstance/new", param)
}


export function updateApprovalStatus(id: number, status: string, infoStatus: { id: number, status: string }[]): HttpResponse {
    return axios.post("approvalinstance/updatestatus", infoStatus, { params: { id, status } })
}