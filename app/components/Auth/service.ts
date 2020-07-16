import { AxiosRequestConfig, AxiosError } from 'axios';

export const onAxiosInterceptorSuccess = (
  config: AxiosRequestConfig,
  idToken: string
) => {
  config.headers = { authorization: `Bearer ${idToken}` };
  return config;
};

export const onAxiosInterceptorFailure = (error: AxiosError) =>
  Promise.reject(error);
