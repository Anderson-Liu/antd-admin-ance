import { request, config } from 'utils'

const { api } = config
const { ppts } = api

export async function query (params) {
  return request({
    url: ppts,
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: ppts,
    method: 'delete',
    data: params,
  })
}
