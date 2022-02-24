import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
export function regsiter(data) {
  return request({
    url: '/user/regsiter',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function all() {
  return request({
    url: '/user/all',
    method: 'get',
    params: {}
  })
}

export function rAll() {
  return request({
    url: '/user/rall',
    method: 'get',
    params: {}
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
