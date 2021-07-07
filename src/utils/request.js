import axios from 'axios'

export function request(config) {
    const instance = axios.create({
        timeout: 5000,
        baseURL: 'http://127.0.0.1:3000'
    })
    // 拦截器的配置
    // instance.interceptors.request.use
    return instance(config)
}
