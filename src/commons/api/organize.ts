import axios from "./axios";
import { HttpResponse } from "./types";


export type Organize = {
    id: number
    name: string
    icon?: string
    categoryId: number
    subOrganizes: Organize[]
}

export type OrganizeCat = {
    id: number
    name: string

    /**
     * 0-长期组织
     * 1-短期组织
     */
    category: 0 | 1
}

export function getOrganizeCats(): HttpResponse<OrganizeCat[]> {
    return axios.get("sysmanage/OrganizeCat")
}

export function getOrganizeCat(id: number): HttpResponse<OrganizeCat> {
    return axios.get("sysmanage/OrganizeCat/one", { params: { id } })
}

export function updateOrganizeCat(id: number, name: string, cat: number): HttpResponse<never> {
    name = encodeURIComponent(name)
    return axios.post(`sysmanage/OrganizeCat/update`, undefined, {
        params: {
            id, name, cat
        }
    })
}

export function deleteOrganizeCat(ids: number[]): HttpResponse<never> { 
    return axios.post(`sysmanage/OrganizeCat/delete`, ids)
}

export function getOrganizes(): HttpResponse<Organize[]> {
    return axios.get("sysmanage/organize")
}

export function updateOrganize(id: number, name: string, cat: number, parent: number): HttpResponse<never> {
    return axios.post("sysmanage/organize/update", undefined, { params: { id, name, cat, parent } })
}

export function deleteOrganize(id: number): HttpResponse<never> {
    return axios.post("sysmanage/organize/delete", undefined, { params: { id } })
}