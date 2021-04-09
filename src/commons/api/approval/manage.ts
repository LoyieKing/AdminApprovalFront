import axios from "../axios";
import { HttpResponse } from "../types";
import { InfoClass } from "./info/manage";

export type ApprovalTable = {
    id: number
    name: string
    category: string
    infoClasses: number[]
    ownerOrganizes: number[]
}

export function getApprovalTables(): HttpResponse<ApprovalTable[]> {
    return axios.get("approvaltable")
}

export function updateApprovalTable(data: ApprovalTable): HttpResponse {
    return axios.post("approvaltable/update", data)
}

export function deleteApprovalTable(id: number): HttpResponse {
    return axios.post("approvaltable/delete", undefined, { params: { id } })
}