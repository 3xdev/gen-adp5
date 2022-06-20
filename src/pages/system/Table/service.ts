import { request } from 'umi';

export async function getList(params?: Record<string, any>) {
  return request('/api/admin/system_table', {
    params,
  });
}

export async function getItem(code: string) {
  return request(`/api/admin/system_table/${code}`);
}

export async function removeItem(keys: string[]) {
  return request(`/api/admin/system_table/${keys.join(',')}`, {
    method: 'DELETE',
  });
}

export async function addItem(params: Record<string, any>) {
  return request('/api/admin/system_table', {
    method: 'POST',
    data: params,
  });
}

export async function updateItem(params: Record<string, any>) {
  return request(`/api/admin/system_table/${params.code}`, {
    method: 'PUT',
    data: params,
  });
}
