import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import useGlobalStore from '../store/useGlobalStore';

import { checkStatus } from './checkStatus';

// 请求响应参数（不包含data）
export interface Result {
  code: string | number;
  message: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
  data: T;
}

export enum ResultEnum {
  SUCCESS = 200,
  ERROR = 500,
  OVERDUE = 401,
  TIMEOUT = 30000,
  TYPE = 'success',
}

const config = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: 'https://test-xfans-api.d.buidlerdao.xyz',
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true,
};

const contractConfig = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: 'https://test-mpc-xfans-api.buidlerdao.xyz/',
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true,
};

class RequestHttp {
  showMsg: boolean;
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig<ResultData<any>>) {
    // instantiation
    this.service = axios.create(config);
    this.showMsg = true;
    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token =
          useGlobalStore.getState().token ?? JSON.parse(localStorage.getItem('token')!).state.token;
        if (config.headers && typeof config.headers.set === 'function') {
          config.headers.set('Authorization', 'Bearer ' + token);
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response;

        // 登陆失效
        if (data.code == ResultEnum.OVERDUE) {
          useGlobalStore.setState({
            token: '',
            message: data.message,
            messageType: 'error',
            messageOpen: true,
          });
          return Promise.reject(data);
        }
        // 全局错误信息拦截（防止下载文件的时候返回数据流，没有 code 直接报错）
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          useGlobalStore.setState({
            message: data.message,
            messageType: 'error',
            messageOpen: true,
          });
          return Promise.reject(data);
        }
        // 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
        return data;
      },
      async (error: AxiosError) => {
        const { response } = error;

        if (this.showMsg) {
          // 请求超时 && 网络错误单独判断，没有 response
          if (error.message.indexOf('timeout') !== -1) {
            useGlobalStore.setState({
              message: '请求超时！请您稍后重试',
              messageType: 'error',
              messageOpen: true,
            });
          }
          if (error.message.indexOf('Network Error') !== -1) {
            useGlobalStore.setState({
              message: '网络错误！请您稍后重试',
              messageType: 'error',
              messageOpen: true,
            });
          }
          // 根据服务器响应的错误状态码，做不同的处理
          if (response) {
            checkStatus(response.status);
          }
          this.showMsg = false;
          setTimeout(() => {
            this.showMsg = true;
          }, 3000);
        }
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) window.location.replace('/500');
        return Promise.reject(error);
      }
    );
  }

  /**
   * @description 常用请求方法封装
   */
  get<T>(url: string, params?: object, _object = {}): Promise<T> {
    return this.service.get(url, { params, ..._object });
  }
  post<T>(url: string, params?: object | string, _object = {}): Promise<T> {
    return this.service.post(url, params, _object);
  }
  post2<T>(url: string, showMsg: boolean, params?: object | string, _object = {}): Promise<T> {
    this.showMsg = showMsg;
    return this.service.post(url, params, _object);
  }
  put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, _object);
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ..._object });
  }
  download(url: string, params?: object, _object = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ..._object, responseType: 'blob' });
  }
}

export default new RequestHttp(config);
export const contractRequestHttp = new RequestHttp(contractConfig);
