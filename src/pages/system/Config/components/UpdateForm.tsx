import React, { useMemo } from 'react';
import { Modal } from 'antd';
import { createForm, onFieldReact } from '@formily/core';
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
import { allDicts, getDicts } from '@/services/ant-design-pro/api';

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
          getDicts('config_tab').then((res) => {
            form.setFieldState('tab', { dataSource: res.items });
          });

          getDicts('table_col_value_type').then((res) => {
            form.setFieldState('component', { dataSource: res.items });
          });

          allDicts().then((res) => {
            const items: any = [];
            res.data.forEach((item: any) => {
              items.push({ value: item.key_, label: item.label });
            });
            form.setFieldState('dict_key', { dataSource: items });
          });

          onFieldReact('dict_key', (field) => {
            field.display = ['select', 'radio', 'checkbox'].includes(
              field.query('component').value(),
            )
              ? 'visible'
              : 'none';
          });
        },
      }),
    [values],
  );

  return (
    <Modal
      destroyOnClose
      title={values.id ? '??????' : '??????'}
      width={640}
      visible={updateModalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form form={form} labelCol={6} wrapperCol={16}>
        <SchemaField>
          <SchemaField.Markup
            name="tab"
            title="??????"
            x-decorator="FormItem"
            x-component="Select"
            required
          />
          <SchemaField.Markup
            name="component"
            title="??????"
            x-decorator="FormItem"
            x-component="Select"
            required
          />
          <SchemaField.String
            name="code"
            title="??????"
            x-decorator="FormItem"
            x-component="Input"
            required
          />
          <SchemaField.String
            name="title"
            title="??????"
            x-decorator="FormItem"
            x-component="Input"
            required
          />
          <SchemaField.String
            name="description"
            title="????????????"
            x-decorator="FormItem"
            x-component="Input"
          />
          <SchemaField.Markup
            name="dict_key"
            title="????????????"
            x-decorator="FormItem"
            x-component="Select"
          />
          <SchemaField.String
            name="extend"
            title="????????????"
            x-decorator="FormItem"
            x-component="Input.TextArea"
          />
        </SchemaField>
        <FormButtonGroup.FormItem>
          <Reset>??????</Reset>
          <Submit onSubmit={onSubmit}>??????</Submit>
        </FormButtonGroup.FormItem>
      </Form>
    </Modal>
  );
};

export default UpdateForm;
