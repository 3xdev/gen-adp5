import { request } from 'umi';

export async function getProTableSchema(table: string) {
  return request(`/api/admin/schema/protable/${table}`);
}

export async function getFormilySchema(table: string) {
  return request(`/api/admin/schema/formily/${table}`);
}

export async function getList(table: string, params?: Record<string, any>) {
  return request(`/api/admin/${table}`, {
    params,
  });
}

export async function removeItem(table: string, ids: number[]) {
  return request(`/api/admin/${table}/${ids.join(',')}`, {
    method: 'DELETE',
  });
}

export async function addItem(table: string, params: Record<string, any>) {
  return request(`/api/admin/${table}`, {
    method: 'POST',
    data: params,
  });
}

export async function updateItem(table: string, params: Record<string, any>) {
  return request(`/api/admin/${table}/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
