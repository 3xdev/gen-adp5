import React, { useMemo } from 'react';
import { Modal } from 'antd';
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
import { Card, Slider, Rate } from 'antd';
import { allTables, allDicts, getDicts } from '@/services/ant-design-pro/api';

const Text: React.FC<{
  content?: string;
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p';
}> = ({ mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode;
  return React.createElement(tagName, props, content);
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

export interface UpdateFormProps {
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: any) => void;
  updateModalVisible: boolean;
  values: any;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { updateModalVisible, values, onCancel, onSubmit } = props;
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

          getDicts('config_tab').then((res) => {
            form.setFieldState('tab', { dataSource: res.items });
          });

          getDicts('table_col_value_type').then((res) => {
            form.setFieldState('component', { dataSource: res.items });
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
              form.setFieldState('value_enum_rel', { dataSource: rels });
            });
          });
        },
      }),
    [values],
  );

  return (
    <Modal
      destroyOnClose
      title={values.id ? '编辑' : '添加'}
      width={640}
      visible={updateModalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form form={form} labelCol={6} wrapperCol={16}>
        <SchemaField>
          <SchemaField.Markup
            name="tab"
            title="分组"
            x-decorator="FormItem"
            x-component="Select"
            required
          />
          <SchemaField.Markup
            name="component"
            title="组件"
            x-decorator="FormItem"
            x-component="Select"
            required
          />
          <SchemaField.String
            name="code"
            title="编码"
            x-decorator="FormItem"
            x-component="Input"
            required
          />
          <SchemaField.String
            name="title"
            title="标题"
            x-decorator="FormItem"
            x-component="Input"
            required
          />
          <SchemaField.String name="tip" title="提示" x-decorator="FormItem" x-component="Input" />
          <SchemaField.Markup
            name="value_enum_rel"
            title="关联"
            x-decorator="FormItem"
            x-component="Cascader"
          />
          <SchemaField.String
            name="component_props"
            title="组件属性"
            default="{}"
            x-decorator="FormItem"
            x-component="Input.TextArea"
          />
          <SchemaField.String
            name="decorator_props"
            title="容器属性"
            default="{}"
            x-decorator="FormItem"
            x-component="Input.TextArea"
          />
          <SchemaField.String
            name="reactions"
            title="联动"
            default="{}"
            x-decorator="FormItem"
            x-component="Input.TextArea"
          />
          <SchemaField.String
            name="validator"
            title="验证"
            default="{}"
            x-decorator="FormItem"
            x-component="Input.TextArea"
          />
        </SchemaField>
        <FormButtonGroup.FormItem>
          <Reset>重置</Reset>
          <Submit onSubmit={onSubmit}>提交</Submit>
        </FormButtonGroup.FormItem>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
