import { request, config } from 'utils'

const { api } = config
const { desctabs } = api

export async function query (params) {
  return request({
    url: desctabs,
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: desctabs,
    method: 'delete',
    data: params,
  })
}
