import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/loudong/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/loudong/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/loudong/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/loudong/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/loudong/update',
    method: 'post',
    data
  })
}
