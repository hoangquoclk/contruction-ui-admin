import type { AxiosInstance } from "axios"
import axios from "axios"

export const InstanceAxios: AxiosInstance = axios.create({
  baseURL: "http://api.kientrucnetdepviet.vn/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

InstanceAxios.interceptors.request.use((config) => {
  return config
})
