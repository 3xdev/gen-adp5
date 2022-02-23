import { request } from 'umi';

export async function getList(table: string, params?: Record<string, any>) {
  return request(`/api/admin/crud/${table}`, {
    params,
  });
}

export async function getItem(table: string, id: any) {
  return request(`/api/admin/crud/${table}/${id}`);
}

export async function removeItem(table: string, ids: any) {
  return request(`/api/admin/crud/${table}/${ids}`, {
    method: 'DELETE',
  });
}

export async function addItem(table: string, params: Record<string, any>) {
  return request(`/api/admin/crud/${table}`, {
    method: 'POST',
    data: params,
  });
}

export async function updateItem(table: string, params: Record<string, any>) {
  return request(`/api/admin/crud/${table}/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
