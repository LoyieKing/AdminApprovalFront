import axios from "commons/api/axios";
import { HttpResponse } from "commons/api/types";

export type InfoClass = {
    id: number
    name: string
    category: string
    expiredDays: number
    inputType: string
    reusable: boolean
}

export function getInfoClasses(): HttpResponse<InfoClass[]> {
    return axios.get("infoclass")
}

export function updateInfoClasses(classes: InfoClass[]): HttpResponse {
    return axios.post("infoclass/update", classes)
}

export function deleteInfoClass(id: number): HttpResponse {
    return axios.post("infoclass/delete", undefined, { params: { id } })
}