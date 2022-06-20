import { request } from 'umi';

export async function getList(params?: Record<string, any>) {
  return request('/api/admin/system_admin', {
    params,
  });
}

export async function removeItem(ids: number[]) {
  return request(`/api/admin/system_admin/${ids.join(',')}`, {
    method: 'DELETE',
  });
}

export async function addItem(params: Record<string, any>) {
  return request('/api/admin/system_admin', {
    method: 'POST',
    data: params,
  });
}

export async function updateItem(params: Record<string, any>) {
  return request(`/api/admin/system_admin/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
