import { request } from 'umi';

export async function getConfigs() {
  return request('/api/admin/config?pageSize=99999', {
    method: 'GET',
  });
}

export async function updateSetting(params: Record<string, any>) {
  return request('/api/admin/setting', {
    method: 'PUT',
    data: params,
  });
}
