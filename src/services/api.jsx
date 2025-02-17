import axios from "axios";

const api = axios.create({
    baseURL: "https://appapi.intelnet.com.br/api",
})

export default api;