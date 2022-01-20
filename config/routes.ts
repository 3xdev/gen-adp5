export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ name: '登录', path: '/user/login', component: './user/Login' }] },
      { component: './404' },
    ],
  },
  { path: '/welcome', component: './Welcome' },
  {
    path: '/system/setting',
    component: './system/Setting',
  },
  {
    path: '/system/dict',
    component: './system/DictTable',
  },
  {
    path: '/system/config',
    component: './system/ConfigTable',
  },
  {
    path: '/system/admin',
    component: './system/AdminTable',
  },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
