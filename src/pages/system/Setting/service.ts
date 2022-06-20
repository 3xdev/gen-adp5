import { request } from 'umi';

export async function getConfigs() {
  return request('/api/admin/system_config?pageSize=99999', {
    method: 'GET',
  });
}

export async function updateSetting(params: Record<string, any>) {
  return request('/api/admin/system_setting', {
    method: 'PUT',
    data: params,
  });
}
