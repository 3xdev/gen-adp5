import { request } from 'umi';

export async function getList() {
  return request('/api/admin/system_menu');
}

export async function removeItem(ids: number[]) {
  return request(`/api/admin/system_menu/${ids.join(',')}`, {
    method: 'DELETE',
  });
}

export async function addItem(params: Record<string, any>) {
  return request('/api/admin/system_menu', {
    method: 'POST',
    data: params,
  });
}

export async function updateItem(params: Record<string, any>) {
  return request(`/api/admin/system_menu/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
