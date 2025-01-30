import axios from 'axios'
import { message } from "antd";

export interface ResType  {
    errno: number,
    data?: ResDataType,
    msg?: string
}

export interface ResDataType {
    [key: string]: any
}

const instance = axios.create({
    timeout: 10000,
})

instance.interceptors.response.use(async (response) => {
    const res = (response.data || {}) as ResType
    const { errno, data, msg } = res
    if(errno!== 0) {
        if(msg) {
            await message.error(msg)
        }
        throw new Error(msg)
    }
    return data as any
})

export default instance