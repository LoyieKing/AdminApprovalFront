import axios from "commons/api/axios";
import { HttpResponse } from "commons/api/types";
import { InfoClass } from "./manage";

export type InfoInstance = {
    id: number
    value: string
    status: string
    creatorTime: string
    lastModifyTime: string
    infoClass: InfoClass
}

export function getInfoInstances(): HttpResponse<InfoInstance[]> {
    return axios.get("infoinstance")
}
