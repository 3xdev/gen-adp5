import { request } from 'umi';

export async function getList(params?: Record<string, any>) {
  return request('/api/admin/configs', {
    params,
  });
}

export async function removeItem(ids: number[]) {
  return request(`/api/admin/configs/${ids.join(',')}`, {
    method: 'DELETE',
  });
}

export async function addItem(params: Record<string, any>) {
  return request('/api/admin/configs', {
    method: 'POST',
    data: params,
  });
}

export async function updateItem(params: Record<string, any>) {
  return request(`/api/admin/configs/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
