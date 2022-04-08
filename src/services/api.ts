import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';


let isRefreshing = false;
let failedRequestQueue = [];

export function setupApiClient(context = undefined) {

  // Buscando todos os cookies
  let cookies = parseCookies(context);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['nextauth.token']}`,
    }
  });

  // Interceptano resposta vindo do backend e recebe 2 parametros successo e error
  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        // Renovar token
        cookies = parseCookies(context);

        const { 'nextauth.refreshToken': refreshToken } = cookies;
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          // Refreshtoken
          api.post('/refresh', {
            refreshToken,
          }).then(response => {
            const { token } = response.data;

            // cookies (undefined, nomeDaAplicação, nomeDotoken)
            setCookie(context, 'nextauth.token', token, {
              maxAge: 60 * 60 * 24 * 30,  // 30 days
              path: '/'
            });

            setCookie(context, 'nextauth.refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30,  // 30 days
              path: '/'
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            failedRequestQueue.forEach(request => request.onSuccess(token));
            failedRequestQueue = [];
          }).catch(error => {
            failedRequestQueue.forEach(request => request.onFailure(error));
            failedRequestQueue = [];

            if (typeof window !== 'undefined') {
              signOut()
            }
          }).finally(() => {
            isRefreshing = false;
          });
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            onFailure: (error: AxiosError) => {
              reject(error);
            },
          })
        })

      } else {
        // Deslogar usuario
        if (typeof window !== 'undefined') {
          signOut();
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }
    }

    return Promise.reject(error);
  });

  return api;
}