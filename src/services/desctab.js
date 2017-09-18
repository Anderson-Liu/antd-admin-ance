import { request, config } from 'utils'

const { api } = config
const { desctab } = api

export async function query (params) {
  return request({
    url: desctab,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: desctab.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: desctab,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: desctab,
    method: 'patch',
    data: params,
  })
}
