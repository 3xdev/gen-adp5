export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ name: '登录', path: '/user/login', component: './user/Login' }] },
      { component: './404' },
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/system',
    name: '系统管理',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/system/setting',
        name: '系统配置',
        icon: 'table',
        component: './system/Setting',
      },
      {
        path: '/system/dict',
        name: '数据字典管理',
        icon: 'table',
        component: './system/DictTable',
      },
      {
        path: '/system/config',
        name: '配置项管理',
        icon: 'table',
        component: './system/ConfigTable',
      },
      {
        path: '/system/admin',
        name: '管理员管理',
        icon: 'table',
        component: './system/AdminTable',
      },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
