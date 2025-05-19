import { get } from "lodash"
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios"
import type { Params } from "react-router"
import { generatePath } from "react-router"
import { InstanceAxios } from "@/api/service/instance-axios.ts"
import { HandleResponseError } from "@/api/service/handle-error.ts"

export type TApiConfig<K = any> = {
  uri: string
  method: K extends Method ? K : Method
}

export type TURLParams<Key extends string | number | symbol = string> = {
  readonly [key in Key]?: string | number | undefined
}

class HttpRestService {
  constructor(private axiosInstance: AxiosInstance) {}

  async get<T>(route: string, configs?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance
      .get(route, configs)
      .then((data) => get(data, "data"))
      .catch(HandleResponseError)
  }

  async post<P, R>(
    route: string,
    payload?: P,
    configs?: AxiosRequestConfig
  ): Promise<R> {
    return this.axiosInstance
      .post(route, payload, configs)
      .then((data) => get(data, "data"))
      .catch(HandleResponseError)
  }

  async patch<P, R>(
    route: string,
    payload?: P,
    configs?: AxiosRequestConfig
  ): Promise<R> {
    return this.axiosInstance
      .patch(route, payload, configs)
      .then((data) => get(data, "data"))
      .catch(HandleResponseError)
  }

  async put<P, R>(
    route: string,
    payload?: P,
    configs?: AxiosRequestConfig
  ): Promise<R> {
    return this.axiosInstance
      .put(route, payload, configs)
      .then((data) => get(data, "data"))
      .catch(HandleResponseError)
  }

  async delete<R>(route: string, configs?: AxiosRequestConfig): Promise<R> {
    return this.axiosInstance
      .delete(route, configs)
      .then((data) => get(data, "data"))
      .catch(HandleResponseError)
  }

  /**
   * fetch API
   * @param apiConfig.method request method (ex: GET, POST, PUT, DELETE, ...)
   * @param apiConfig.url request url (ex: /foo/bar)
   * @param configs axios configs
   * @param urlParams url params (ex: /foo/:id)
   * @param queryParams url params (ex: /foo?id=1)
   * @param payload payload data
   * @returns Promise<R>
   */
  async fetch<P, R, U = string, Q = string>({
    apiConfig: { method, uri },
    configs,
    urlParams,
    queryParams,
    payload,
  }: {
    apiConfig: TApiConfig
    urlParams?: U extends string | number | symbol ? TURLParams<U> : Partial<U>
    queryParams?: Q extends string | number | symbol
      ? TURLParams<Q>
      : Partial<Q>
    payload?: P
    configs?: AxiosRequestConfig<P>
  }): Promise<R> {
    return this.axiosInstance({
      ...configs,
      url: urlParams ? generatePath(uri, urlParams as Params) : uri,
      method,
      params: queryParams,
      data: payload,
    })
      .then((data: AxiosResponse<R>) => get(data, "data"))
      .catch(HandleResponseError)
  }
}

export const HttpService = new HttpRestService(InstanceAxios)
