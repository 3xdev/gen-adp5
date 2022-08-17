import React, { useMemo, useState, useEffect } from 'react';
import { history, useParams } from 'umi';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  Form,
  FormItem,
  DatePicker,
  Checkbox,
  Cascader,
  Editable,
  Input,
  NumberPicker,
  Switch,
  Password,
  PreviewText,
  Radio,
  Reset,
  Select,
  Space,
  Submit,
  TimePicker,
  Transfer,
  TreeSelect,
  Upload,
  FormGrid,
  FormLayout,
  FormTab,
  FormCollapse,
  ArrayTable,
  ArrayItems,
  ArrayCards,
  FormButtonGroup,
} from '@formily/antd';
import { Button, message, Card, Slider, Rate } from 'antd';
import ProCard from '@ant-design/pro-card';
import type { RouteParams, TableItem } from '../data.d';
import { getItem, updateItem } from '../service';
import { allTables, allDicts, getDicts } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-layout';

const Text: React.FC<{
  value?: string;
  content?: string;
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p';
}> = ({ value, mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode;
  return React.createElement(tagName, props, value || content);
};

const SchemaField = createSchemaField({
  components: {
    Space,
    FormGrid,
    FormLayout,
    FormTab,
    FormCollapse,
    ArrayTable,
    ArrayItems,
    ArrayCards,
    FormItem,
    DatePicker,
    Checkbox,
    Cascader,
    Editable,
    Input,
    Text,
    NumberPicker,
    Switch,
    Password,
    PreviewText,
    Radio,
    Reset,
    Select,
    Submit,
    TimePicker,
    Transfer,
    TreeSelect,
    Upload,
    Card,
    Slider,
    Rate,
  },
});

const handleUpdate = async (fields: Partial<TableItem>) => {
  const hide = message.loading('正在提交');
  try {
    await updateItem({ ...fields });
    hide();
    message.success('提交成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

const ColForm: React.FC = () => {
  const routeParams: RouteParams = useParams();

  const [values, setValues] = useState([]);

  useEffect(() => {
    getItem(routeParams.code).then((res) => {
      res.props_string = JSON.stringify(res.props);
      setValues(res);
    });
  }, [routeParams.code]);

  const form = useMemo(
    () =>
      createForm({
        initialValues: values,
        effects() {
          const rels: any = [
            { value: 'dict', label: '字典', children: [] },
            { value: 'table', label: '表格', children: [] },
            { value: 'suggest', label: '搜索', children: [] },
          ];
          getDicts('common_status').then((res) => {
            form.setFieldState('status', { dataSource: res.items });
          });
          getDicts('table_col_value_type').then((res) => {
            form.setFieldState('cols.*.value_type', { dataSource: res.items });
          });
          getDicts('table_option_type_columns').then((res) => {
            form.setFieldState('options.columns.*.type', { dataSource: res.items });
          });
          getDicts('table_option_type_toolbar').then((res) => {
            form.setFieldState('options.toolbar.*.type', { dataSource: res.items });
          });
          getDicts('table_option_type_batch').then((res) => {
            form.setFieldState('options.batch.*.type', { dataSource: res.items });
          });
          allDicts().then((res) => {
            res.data.forEach((item: any) => {
              rels[0].children.push({ value: item.key_, label: item.label });
            });
            allTables().then((tres) => {
              tres.data.forEach((item: any) => {
                rels[1].children.push({ value: item.code, label: item.name });
                rels[2].children.push({ value: item.code, label: item.name });
              });
              form.setFieldState('cols.*.value_enum_rel', { dataSource: rels });
            });
          });
        },
      }),
    [values],
  );

  return (
    <PageContainer>
      <ProCard>
        <Form form={form} labelCol={6} wrapperCol={16}>
          <SchemaField>
            <SchemaField.String
              name="code"
              title="代码"
              x-decorator="FormItem"
              x-component="Input"
              readOnly
              required
            />
            <SchemaField.String
              name="name"
              title="名称"
              x-decorator="FormItem"
              x-component="Input"
              required
            />
            <SchemaField.Markup
              name="status"
              title="状态"
              x-decorator="FormItem"
              x-component="Select"
            />
            <SchemaField.String
              name="props_string"
              title="属性"
              x-decorator="FormItem"
              x-component="Input.TextArea"
              x-component-props={{ style: { height: '160px' } }}
            />
            <SchemaField.Array
              name="cols"
              x-decorator="FormItem"
              x-component="ArrayTable"
              x-component-props={{
                title: () => '列',
                pagination: {
                  pageSize: 999,
                },
              }}
            >
              <SchemaField.Object>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '排序' }}
                >
                  <SchemaField.Void x-decorator="FormItem" x-component="ArrayTable.SortHandle" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '序号' }}
                >
                  <SchemaField.String
                    name="sort"
                    x-decorator="FormItem"
                    x-component="ArrayTable.Index"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '列名' }}
                >
                  <SchemaField.String
                    name="data_index"
                    x-decorator="FormItem"
                    x-component="Input"
                    x-component-props={{
                      style: {
                        width: 98,
                      },
                    }}
                    required
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '标题' }}
                >
                  <SchemaField.String
                    name="title"
                    x-decorator="FormItem"
                    x-component="Input"
                    x-component-props={{
                      style: {
                        width: 88,
                      },
                    }}
                    required
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '提示' }}
                >
                  <SchemaField.String
                    name="tip"
                    x-decorator="FormItem"
                    x-component="Input"
                    x-component-props={{
                      style: {
                        width: 80,
                      },
                    }}
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '查询不显' }}
                >
                  <SchemaField.Boolean
                    name="hide_in_search"
                    x-decorator="FormItem"
                    x-component="Switch"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '列表不显' }}
                >
                  <SchemaField.Boolean
                    name="hide_in_table"
                    x-decorator="FormItem"
                    x-component="Switch"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '查看不显' }}
                >
                  <SchemaField.Boolean
                    name="hide_in_descriptions"
                    x-decorator="FormItem"
                    x-component="Switch"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '编辑不显' }}
                >
                  <SchemaField.Boolean
                    name="hide_in_form"
                    x-decorator="FormItem"
                    x-component="Switch"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '类型' }}
                >
                  <SchemaField.Markup
                    name="value_type"
                    x-decorator="FormItem"
                    x-component="Select"
                    x-component-props={{
                      style: {
                        width: 110,
                      },
                    }}
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '关联' }}
                >
                  <SchemaField.Markup
                    name="value_enum_rel"
                    x-decorator="FormItem"
                    x-component="Cascader"
                    x-component-props={{
                      style: {
                        width: 110,
                      },
                    }}
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '扩展' }}
                >
                  <SchemaField.Void x-component="Editable.Popover" name="void_table" title="列表">
                    <SchemaField.String
                      name="width"
                      title="列表宽度"
                      x-decorator="FormItem"
                      x-component="NumberPicker"
                      x-component-props={{
                        style: {
                          width: 80,
                        },
                      }}
                    />
                    <SchemaField.String
                      name="col_size"
                      title="查询格数"
                      x-decorator="FormItem"
                      x-component="NumberPicker"
                      x-component-props={{
                        style: {
                          width: 60,
                        },
                      }}
                    />
                    <SchemaField.Boolean
                      name="filters"
                      title="表头筛选"
                      x-decorator="FormItem"
                      x-component="Switch"
                    />
                    <SchemaField.Boolean
                      name="sorter"
                      title="表头排序"
                      x-decorator="FormItem"
                      x-component="Switch"
                    />
                    <SchemaField.Boolean
                      name="ellipsis"
                      title="自动缩略"
                      x-decorator="FormItem"
                      x-component="Switch"
                    />
                    <SchemaField.Boolean
                      name="copyable"
                      title="支持复制"
                      x-decorator="FormItem"
                      x-component="Switch"
                    />
                    <SchemaField.String
                      name="template_text"
                      title="文本模板"
                      x-decorator="FormItem"
                      x-component="Input"
                      x-component-props={{
                        style: {
                          width: 180,
                        },
                      }}
                    />
                    <SchemaField.String
                      name="template_link_to"
                      title="跳转模板"
                      x-decorator="FormItem"
                      x-component="Input"
                      x-component-props={{
                        style: {
                          width: 180,
                        },
                      }}
                    />
                  </SchemaField.Void>
                  <SchemaField.Void x-component="Editable.Popover" name="void_form" title="编辑">
                    <SchemaField.String
                      name="default_value"
                      title="默认值"
                      x-decorator="FormItem"
                      x-component="Input"
                    />
                    <SchemaField.String
                      name="component_props"
                      title="组件属性"
                      x-decorator="FormItem"
                      x-component="Input.TextArea"
                    />
                    <SchemaField.String
                      name="decorator_props"
                      title="容器属性"
                      x-decorator="FormItem"
                      x-component="Input.TextArea"
                    />
                    <SchemaField.String
                      name="reactions"
                      title="联动"
                      x-decorator="FormItem"
                      x-component="Input.TextArea"
                    />
                    <SchemaField.String
                      name="validator"
                      title="验证"
                      x-decorator="FormItem"
                      x-component="Input.TextArea"
                    />
                    <SchemaField.Boolean
                      name="required"
                      title="必填"
                      x-decorator="FormItem"
                      x-component="Switch"
                    />
                  </SchemaField.Void>
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '操作', dataIndex: 'operations' }}
                >
                  <SchemaField.Void x-component="FormItem">
                    <SchemaField.Void x-component="ArrayTable.Remove" />
                    <SchemaField.Void x-component="ArrayTable.MoveDown" />
                    <SchemaField.Void x-component="ArrayTable.MoveUp" />
                  </SchemaField.Void>
                </SchemaField.Void>
              </SchemaField.Object>
              <SchemaField.Void x-component="ArrayTable.Addition" title="添加列" />
            </SchemaField.Array>
            <SchemaField.Array
              name="options.columns"
              x-decorator="FormItem"
              x-component="ArrayTable"
              x-component-props={{
                title: () => '列操作',
                pagination: {
                  pageSize: 999,
                },
              }}
            >
              <SchemaField.Object>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '排序' }}
                >
                  <SchemaField.Void x-decorator="FormItem" x-component="ArrayTable.SortHandle" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '序号' }}
                >
                  <SchemaField.String
                    name="sort"
                    x-decorator="FormItem"
                    x-component="ArrayTable.Index"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '类型' }}
                >
                  <SchemaField.Markup name="type" x-decorator="FormItem" x-component="Select" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '操作名' }}
                >
                  <SchemaField.String
                    name="key"
                    x-decorator="FormItem"
                    x-component="Input"
                    required
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '标题' }}
                >
                  <SchemaField.String
                    name="title"
                    x-decorator="FormItem"
                    x-component="Input"
                    required
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '表单/页面' }}
                >
                  <SchemaField.String name="path" x-decorator="FormItem" x-component="Input" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '请求体/参数' }}
                >
                  <SchemaField.String name="body" x-decorator="FormItem" x-component="Input" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '操作', dataIndex: 'operations' }}
                >
                  <SchemaField.Void x-component="FormItem">
                    <SchemaField.Void x-component="ArrayTable.Remove" />
                    <SchemaField.Void x-component="ArrayTable.MoveDown" />
                    <SchemaField.Void x-component="ArrayTable.MoveUp" />
                  </SchemaField.Void>
                </SchemaField.Void>
              </SchemaField.Object>
              <SchemaField.Void x-component="ArrayTable.Addition" title="添加列操作" />
            </SchemaField.Array>
            <SchemaField.Array
              name="options.toolbar"
              x-decorator="FormItem"
              x-component="ArrayTable"
              x-component-props={{
                title: () => '工具栏操作',
                pagination: {
                  pageSize: 999,
                },
              }}
            >
              <SchemaField.Object>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '排序' }}
                >
                  <SchemaField.Void x-decorator="FormItem" x-component="ArrayTable.SortHandle" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '序号' }}
                >
                  <SchemaField.String
                    name="sort"
                    x-decorator="FormItem"
                    x-component="ArrayTable.Index"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '类型' }}
                >
                  <SchemaField.Markup name="type" x-decorator="FormItem" x-component="Select" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '操作名' }}
                >
                  <SchemaField.String
                    name="key"
                    x-decorator="FormItem"
                    x-component="Input"
                    required
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '标题' }}
                >
                  <SchemaField.String
                    name="title"
                    x-decorator="FormItem"
                    x-component="Input"
                    required
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '表单/页面' }}
                >
                  <SchemaField.String name="path" x-decorator="FormItem" x-component="Input" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '请求体/参数' }}
                >
                  <SchemaField.String name="body" x-decorator="FormItem" x-component="Input" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '操作', dataIndex: 'operations' }}
                >
                  <SchemaField.Void x-component="FormItem">
                    <SchemaField.Void x-component="ArrayTable.Remove" />
                    <SchemaField.Void x-component="ArrayTable.MoveDown" />
                    <SchemaField.Void x-component="ArrayTable.MoveUp" />
                  </SchemaField.Void>
                </SchemaField.Void>
              </SchemaField.Object>
              <SchemaField.Void x-component="ArrayTable.Addition" title="添加工具栏操作" />
            </SchemaField.Array>
            <SchemaField.Array
              name="options.batch"
              x-decorator="FormItem"
              x-component="ArrayTable"
              x-component-props={{
                title: () => '批量操作',
                pagination: {
                  pageSize: 999,
                },
              }}
            >
              <SchemaField.Object>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '排序' }}
                >
                  <SchemaField.Void x-decorator="FormItem" x-component="ArrayTable.SortHandle" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '序号' }}
                >
                  <SchemaField.String
                    name="sort"
                    x-decorator="FormItem"
                    x-component="ArrayTable.Index"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '类型' }}
                >
                  <SchemaField.Markup name="type" x-decorator="FormItem" x-component="Select" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '操作名' }}
                >
                  <SchemaField.String
                    name="key"
                    x-decorator="FormItem"
                    x-component="Input"
                    required
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '标题' }}
                >
                  <SchemaField.String
                    name="title"
                    x-decorator="FormItem"
                    x-component="Input"
                    required
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '表单/页面' }}
                >
                  <SchemaField.String name="path" x-decorator="FormItem" x-component="Input" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '请求体/参数' }}
                >
                  <SchemaField.String name="body" x-decorator="FormItem" x-component="Input" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: '操作', dataIndex: 'operations' }}
                >
                  <SchemaField.Void x-component="FormItem">
                    <SchemaField.Void x-component="ArrayTable.Remove" />
                    <SchemaField.Void x-component="ArrayTable.MoveDown" />
                    <SchemaField.Void x-component="ArrayTable.MoveUp" />
                  </SchemaField.Void>
                </SchemaField.Void>
              </SchemaField.Object>
              <SchemaField.Void x-component="ArrayTable.Addition" title="添加批量操作" />
            </SchemaField.Array>
          </SchemaField>
          <FormButtonGroup.FormItem>
            <Reset>重置</Reset>
            <Button
              key="cancel"
              onClick={() => {
                history.goBack();
              }}
            >
              取消
            </Button>
            <Submit
              onSubmit={async (fields: any) => {
                await handleUpdate(fields);
                history.goBack();
              }}
            >
              提交
            </Submit>
          </FormButtonGroup.FormItem>
        </Form>
      </ProCard>
    </PageContainer>
  );
};

export default ColForm;
