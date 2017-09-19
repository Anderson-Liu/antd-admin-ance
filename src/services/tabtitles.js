import { request, config } from 'utils'

const { api } = config
const { tabtitles } = api

export async function query (params) {
  return request({
    url: tabtitles,
    method: 'get',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: tabtitles,
    method: 'delete',
    data: params,
  })
}
