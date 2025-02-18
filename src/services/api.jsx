import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.88.81:8000",
})

export default api;