## Gen 管理端

### 组件选型

- @ant-design/charts 图表
- @ant-design/pro-table 表格模板
- @formily/core Formily 表单解决方案
- braft-editor 富文本
- xlsx Excel 处理

### 安装依赖

```bash
yarn
```

### 开发启动

```bash
yarn start:dev
```

### 编译

```bash
yarn build
```

### 代码检查

```bash
yarn lint
```

### 自动修复 lint 错误

```bash
yarn lint:fix
```

### 管理操作

#### 菜单管理

| 规范 | 类型           | 访问路由     |
| ---- | -------------- | ------------ |
| CRUD | 表格列表及操作 | /crud/:table |

#### 表格管理

##### 表格属性

```json
{
  "rowKey": "id"
}
```

- rowKey 主键（必填）
- 更多参考 ProTable 文档

##### 列

- 设置 列 文本模板

示例：

name 列表扩展 文本模板 设为 {{id}}.{{name}}

id = 1 的 name 列 渲染 为 路由跳转 到 1.test

- 设置 列 跳转模板

示例：

name 列表扩展 跳转模板 设为 /product/brand/{{id}}

id = 1 的 name 列 渲染 为 路由跳转 到 /product/brand/1
