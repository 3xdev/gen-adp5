import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import type { ResponseError, RequestOptionsInit } from 'umi-request';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import { currentUser as queryCurrentUser, getMenus } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrentUser();
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// 请求前拦截，自动填补JWT头
const jwtHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const token = localStorage.getItem('token') || '';
  const jwtHeader = { Authorization: `Bearer ${token}` };
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: jwtHeader },
  };
};
// 响应后拦截，自动刷新JWT
const tokenUpdateInterceptor = (response: Response) => {
  const authorization = response.headers.get('authorization');
  if (authorization) {
    localStorage.setItem('token', authorization.slice(7));
  }
  return response;
};
export const request: RequestConfig = {
  errorHandler: (error: ResponseError) => {
    if (error.response) {
      const { status, statusText } = error.response;
      notification.error({
        message: `${status}: ${statusText}`,
        description: error.data?.message,
      });
    } else {
      notification.error({
        message: '网络异常',
        description: '您的网络发生异常，无法连接服务器',
      });
    }
    throw error;
  },
  requestInterceptors: [jwtHeaderInterceptor],
  responseInterceptors: [tokenUpdateInterceptor],
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    menu: {
      params: {
        id: initialState?.currentUser?.id,
      },
      request: async (params) => {
        return params.id ? (await getMenus()).data : [];
      },
    },
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    // childrenRender: (children) => {
    //   if (initialState.loading) return <PageLoading />;
    //   return children;
    // },
    ...initialState?.settings,
  };
};
