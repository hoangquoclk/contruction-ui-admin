import type { AxiosInstance } from "axios"
import axios from "axios"
import { API_URL } from "@/constants/map-env.ts"

export const InstanceAxios: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

InstanceAxios.interceptors.request.use((config) => {
  return config
})
