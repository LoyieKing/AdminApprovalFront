import Axios from 'axios';
import { getLoginUser } from 'commons';
const BASE_URL = "/api/"

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

export default axios