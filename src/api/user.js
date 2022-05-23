import { api } from 'boot/axios'

export function login (data) {
  return api({
    url: '/login',
    method: 'post',
    data
  })
}

export function logout (data) {
  return api({
    url: '/logout',
    method: 'post'
  })
}
