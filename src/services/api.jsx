import axios from "axios";

const api = axios.create({
    baseURL: "https://appapi.intelnet.com.br",
    // baseURL: "http://192.168.88.81:8000",
    // baseURL: "http://192.168.0.9:8000",
})

export default api;