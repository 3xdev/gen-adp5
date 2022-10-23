# Gen 管理端

## 组件选型

- @ant-design/charts 图表
- @ant-design/pro-table 表格模板
- @formily/core Formily 表单解决方案
- braft-editor 富文本
- xlsx Excel 处理

## 安装依赖

```bash
yarn
```

## 开发启动

```bash
yarn start:dev
```

## 编译

```bash
yarn build
```

## 代码检查

```bash
yarn lint
```

## 自动修复 lint 错误

```bash
yarn lint:fix
```

## 管理操作

### 菜单管理

| 规范 | 类型           | 访问路由     |
| ---- | -------------- | ------------ |
| CRUD | 表格列表及操作 | /crud/:table |

### 表格管理

#### 表格属性

```json
{
  "rowKey": "id"
}
```

- rowKey 主键（必填）
- 更多参考 ProTable 文档

#### 列

- 设置 列 文本模板  
  示例：  
  name 列表扩展 文本模板 设为 {{id}}.{{name}}  
  id = 1 的 name 列 渲染 为 路由跳转 到 1.test
- 设置 列 跳转模板  
  示例：  
  name 列表扩展 跳转模板 设为 /product/brand/{{id}}  
  id = 1 的 name 列 渲染 为 路由跳转 到 /product/brand/1
- 设置 列 编辑扩展（组件属性）  
  [Formily Ant Design](https://antd.formilyjs.org/zh-CN/components)

  ```json
  // 多行文本框 展示字数提示
  {
    "placeholder": "请输入活动描述",
    "showCount": true,
    "maxLength": 300
  }

  // 搜索下拉框 附加搜索器条件约束
  {
    "placeholder": "商品名称 \/ 商品编号",
    "customQuery": {
        "company_agent_id": 0
    }
  }
  ```

- 设置 列 编辑扩展（容器属性）  
  [Formily Ant Design](https://antd.formilyjs.org/zh-CN/components)
- 设置 列 编辑扩展（联动）  
  [Schema 联动协议](https://react.formilyjs.org/zh-CN/api/shared/schema#schemareactions)
- 设置 列 编辑扩展（验证）  
  [字段校验器](https://core.formilyjs.org/zh-CN/api/models/field#fieldvalidator)

#### 操作

- 添加 操作 类型 表单弹窗  
  操作名：表单处理对应控制器代码中的方法名 表单/页面：关联表单代码
- 添加 操作 类型 跳转页面  
  表单/页面：前端路由地址（示例：/user/{{user_id}}）

## 开发

### Formily 联动示例

```typescript
// 多选框 全选（被动联动）
<SchemaField.Boolean
  name="all"
  title="全选"
  x-component="Checkbox"
  x-decorator="FormItem"
/>
<SchemaField.Markup
  name="goods"
  title="商品管理"
  enum={[
    { value: 'get', label: '读取' },
    { value: 'update', label: '编辑' },
    { value: 'delete', label: '删除/批量删除' },
    { value: 'create', label: '新建' },
  ]}
  x-component="Checkbox.Group"
  x-decorator="FormItem"
  x-reactions={{
    dependencies: ['all'],
    fulfill: {
      state: {
        value: '{{$deps[0] ? $self.dataSource.map(ds => ds.value) : []}}',
      },
    },
  }}
/>
<SchemaField.Markup
  name="order"
  title="订单管理"
  enum={[
    { value: 'get', label: '读取' },
    { value: 'update', label: '编辑' },
    { value: 'delete', label: '删除/批量删除' },
    { value: 'create', label: '新建' },
  ]}
  x-component="Checkbox.Group"
  x-decorator="FormItem"
  x-reactions={{
    dependencies: ['all'],
    fulfill: {
      state: {
        value: '{{$deps[0] ? $self.dataSource.map(ds => ds.value) : []}}',
      },
    },
  }}
/>
```

### 表格访问权限

```typescript
// 引入获取权限Hooks/权限控制组件
import { useAccess, Access } from 'umi';

// 获取权限集合
const access = useAccess();

// 方式1：通过判断权限展示
{
  access.canGetTable('order') ? (
    <TabPane tab="订单记录" key="order">
      ...
    </TabPane>
  ) : (
    <></>
  );
}

// 方式2：通过Access组件展示
<Access accessible={access.canGetTable('order')} fallback={<div>Can not get content.</div>}>
  ...
</Access>;
```

### crud ListTable 组件

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| table | 表格代码 | string | - |
| query | 附加查询条件 | Record<string, any> | - |
| proTableProps | 透传 protable 属性 | Record<string, any> | - |
| hiddenColumns | 要隐藏列 | string[] | - |
| renderColumns | 列展示的 render | (text: ReactNode,record: T) => ReactNode | ReactNode[] |
| renderColumnsOptions | 列操作的 render | (option: T,record: U) => ReactNode | ReactNode[] |
| renderToolbarOptions | 工具栏的 render | (option: T,columns: U) => ReactNode | ReactNode[] |
| renderBatchOptions | 批处理的 render | (option: T,{ selectedRowKeys: Key[], selectedRows: U[] }) => ReactNode | ReactNode[] |

```typescript
<ListTable
  table="goods"
  proTableProps={{
    pagination: { showSizeChanger: true, pageSizeOptions: [10, 100, 1000] },
  }}
  hiddenColumns={['stock_number', 'user,realname']}
  appendColumns={[
    {
      title: '新1',
      dataIndex: ['user', 'realname'],
    },
    {
      title: '新2',
      dataIndex: 'test2',
      render: (text, record) => <>{record.no}</>,
    },
  ]}
  renderColumns={{
    // 调用弹窗组件
    no: (text: any, record: any) => (
      <a
        onClick={() => {
          setPropsLogsModal({ visible: true, spu_id: record.id });
        }}
      >
        {text}({record?.stock_number})
      </a>
    ),
    // 路由到关联页
    'product_brand,name': (text: any, record: any) => (
      <Link to={`/product/brand/${record.product_brand_id}`}>{text}</Link>
    ),
  }}
  appendColumnsOptions={[
    {
      action: 'testco',
      title: '列操作1',
    },
    {
      type: 'modal',
      action: 'good_edit',
      title: '列操作2',
      target: 'good_edit',
    },
  ]}
  renderColumnsOptions={{
    // 自定义列操作，覆盖表格设计中原先的操作
    putUpdate: (option: any, record: any) => (
      <Button
        key={option.action}
        onClick={() => {
          console.log(option, record);
        }}
      >
        {option.title}
      </Button>
    ),
    // 根据情况展示列操作
    testco: (option: any, record: any) =>
      record.status == 0 ? (
        <a key={option.action} href={`/product/brand/${record.product_brand_id}`}>
          {option.title}
        </a>
      ) : (
        <></>
      ),
  }}
  appendToolbarOptions={[
    {
      type: 'add',
      action: 'testto',
      title: '工具样操作1',
    },
  ]}
  renderToolbarOptions={{
    // 自定义工具栏操作，覆盖表格设计中原先的操作
    create: (option: any) => (
      <Button
        key={option.action}
        onClick={() => {
          console.log(option);
        }}
      >
        {option.title}
      </Button>
    ),
  }}
  renderBatchOptions={{
    // 自定义批量操作，覆盖表格设计中原先的操作
    delete: (option: any, { selectedRowKeys }: any) => (
      <a
        key={option.action}
        onClick={() => {
          console.log(selectedRowKeys);
        }}
      >
        {option.title}
      </a>
    ),
  }}
/>
```
