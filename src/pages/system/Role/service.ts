import { request } from 'umi';

export async function getList(params?: Record<string, any>) {
  return request('/api/admin/system_role', {
    params,
  });
}

export async function removeItem(ids: number[]) {
  return request(`/api/admin/system_role/${ids.join(',')}`, {
    method: 'DELETE',
  });
}

export async function addItem(params: Record<string, any>) {
  return request('/api/admin/system_role', {
    method: 'POST',
    data: params,
  });
}

export async function updateItem(params: Record<string, any>) {
  return request(`/api/admin/system_role/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function getTable() {
  return request('/api/admin/system_role/table');
}

export async function getPermission(id: string) {
  return request(`/api/admin/system_role/permission/${id}`);
}

export async function putPermission(id: string, params: Record<string, any>) {
  return request(`/api/admin/system_role/permission/${id}`, {
    method: 'PUT',
    data: params,
  });
}
