import { request, config } from 'utils'

const { api } = config
const { city_user } = api

export async function query (params) {
  return request({
    url: city_user,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: city_user.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: city_user,
    method: 'delete',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: city_user,
    method: 'patch',
    data: params,
  })
}
