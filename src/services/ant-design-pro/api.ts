// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户 GET /api/admin/profile */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.CurrentUser>('/api/admin/profile', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 解除登录接口 DELETE /api/admin/token */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/token', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/admin/token */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/admin/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 全部表格 */
export async function allTables() {
  return request('/api/admin/system_table?pageSize=99999', {
    method: 'GET',
  });
}

/** 全部字典 */
export async function allDicts() {
  return request('/api/admin/system_dict?pageSize=99999', {
    method: 'GET',
  });
}

/** 全部角色 */
export async function allRoles() {
  return request('/api/admin/system_role?pageSize=99999', {
    method: 'GET',
  });
}

/** 获取字典 */
export async function getDicts(name: string) {
  return request(`/api/admin/system_dict/${name}`, {
    method: 'GET',
  });
}

/** 获取管理员菜单 */
export async function getMenus() {
  return request('/api/admin/menus', {
    method: 'GET',
  });
}

/** 获取suggest */
export async function getSuggest(table: string, keyword: string) {
  return request(`/api/admin/suggest/${table}?keyword=${keyword}`);
}

/** 获取schema */
export async function getProTableSchema(table: string) {
  return request(`/api/admin/schema/protable/${table}`);
}
export async function getFormilySchema(type: string, code: string) {
  return request(`/api/admin/schema/formily/${type}/${code}`);
}

/** 此处后端没有提供注释 GET /api/admin/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/admin/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 上传图片 */
export async function uploadImages(file: any) {
  const formData = new FormData();
  formData.append('file', file);
  return request(`/api/admin/upload/image/img`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: formData,
  });
}
