import { request } from 'umi';

export async function getList(params?: Record<string, any>) {
  return request('/api/admins', {
    params,
  });
}

export async function removeItem(ids: number[]) {
  return request(`/api/admins/${ids.join(',')}`, {
    method: 'DELETE',
  });
}

export async function addItem(params: Record<string, any>) {
  return request('/api/admins', {
    method: 'POST',
    data: params,
  });
}

export async function updateItem(params: Record<string, any>) {
  return request(`/api/admins/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
