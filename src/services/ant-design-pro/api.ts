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
  return request('/api/admin/table?pageSize=99999', {
    method: 'GET',
  });
}

/** 全部字典 */
export async function allDicts() {
  return request('/api/admin/dict?pageSize=99999', {
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
  return request(`/api/admin/dict/${name}`, {
    method: 'GET',
  });
}

/** 获取菜单 */
export async function getMenus() {
  return request('/api/admin/menu?status=1', {
    method: 'GET',
  });
}

/** 获取schema */
export async function getProTableSchema(table: string) {
  return request(`/api/admin/schema/protable/${table}`);
}
export async function getFormilySchema(table: string) {
  return request(`/api/admin/schema/formily/${table}`);
}

/** 此处后端没有提供注释 GET /api/admin/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/admin/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/admin/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/admin/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/admin/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/admin/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/admin/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/admin/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/admin/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}
