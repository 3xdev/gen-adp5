import { request } from 'umi';

export async function getList(params?: Record<string, any>) {
  return request('/api/admin/admin', {
    params,
  });
}

export async function removeItem(ids: number[]) {
  return request(`/api/admin/admin/${ids.join(',')}`, {
    method: 'DELETE',
  });
}

export async function addItem(params: Record<string, any>) {
  return request('/api/admin/admin', {
    method: 'POST',
    data: params,
  });
}

export async function updateItem(params: Record<string, any>) {
  return request(`/api/admin/admin/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
