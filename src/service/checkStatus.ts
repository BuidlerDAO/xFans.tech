import * as toaster from '../components/Toaster';
import useGlobalStore from '../store/useGlobalStore';
// import { message } from "antd";

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = (status: number) => {
  switch (status) {
    case 400:
      toaster.error(toaster.ToastMessage.REQUEST_FAILURE_RETRY);
      break;
    case 401:
      toaster.error(toaster.ToastMessage.LOGIN_FAILURE_RETRY);
      break;
    case 403:
      toaster.error(toaster.ToastMessage.NO_PERMISSION);
      break;
    case 404:
      toaster.error(toaster.ToastMessage.NO_RESOURCE);
      break;
    case 405:
      toaster.error(toaster.ToastMessage.REQUEST_METHOD_ERROR);
      break;
    case 408:
      toaster.error(toaster.ToastMessage.REQUEST_TIMEOUT_RETRY);
      break;
    case 500:
      toaster.error(toaster.ToastMessage.SERVICE_ERROR);
      break;
    case 502:
      toaster.error(toaster.ToastMessage.GATEWAY_ERROR);
      break;
    case 503:
      toaster.error(toaster.ToastMessage.SERVICE_UNAVALIABLE);
      break;
    case 504:
      toaster.error(toaster.ToastMessage.GATEWAY_TIMEOUT);
      break;
    default:
      toaster.error(toaster.ToastMessage.REQUEST_FAILURE);
  }
};
