import { request } from 'umi';

export async function getList(params?: Record<string, any>) {
  return request('/api/admin/system_form', {
    params,
  });
}

export async function getItem(code: string) {
  return request(`/api/admin/system_form/${code}`);
}

export async function removeItem(keys: string[]) {
  return request(`/api/admin/system_form/${keys.join(',')}`, {
    method: 'DELETE',
  });
}

export async function addItem(params: Record<string, any>) {
  return request('/api/admin/system_form', {
    method: 'POST',
    data: params,
  });
}

export async function updateItem(params: Record<string, any>) {
  return request(`/api/admin/system_form/${params.code}`, {
    method: 'PUT',
    data: params,
  });
}
