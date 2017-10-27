import { request, config } from 'utils';

const { api } = config;
const { city_users } = api;

export async function query(params) {
  return request({
    url: city_users,
    method: 'get',
    data: params,
  });
}

export async function remove(params) {
  return request({
    url: city_users,
    method: 'delete',
    data: params,
  });
}
