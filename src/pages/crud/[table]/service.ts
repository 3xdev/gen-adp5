import { request } from 'umi';

export async function getProTableSchema(table: string) {
  return request(`/api/admin/schema/protable/${table}`);
}

export async function getList(table: string, params?: Record<string, any>) {
  return request(`/api/admin/${table}`, {
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
