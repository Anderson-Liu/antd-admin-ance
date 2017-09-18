import { request, config } from 'utils'

const { api } = config
const { ppt } = api

export async function query (params) {
  return request({
    url: ppt,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: ppt.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: ppt,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: ppt,
    method: 'patch',
    data: params,
  })
}
