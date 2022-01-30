import { request } from 'umi';

export async function getList(params?: Record<string, any>) {
  return request('/api/admin/dict', {
    params,
  });
}

export async function removeItem(keys: string[]) {
  return request(`/api/admin/dict/${keys.join(',')}`, {
    method: 'DELETE',
  });
}

export async function addItem(params: Record<string, any>) {
  return request('/api/admin/dict', {
    method: 'POST',
    data: params,
  });
}

export async function updateItem(params: Record<string, any>) {
  return request(`/api/admin/dict/${params.key_}`, {
    method: 'PUT',
    data: params,
  });
}
