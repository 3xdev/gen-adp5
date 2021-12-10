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
      }),
    [values],
  );

  return (
    <Modal
      destroyOnClose
      title={values.add ? '添加' : '编辑'}
      width={640}
      visible={updateModalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form form={form} labelCol={6} wrapperCol={16}>
        <SchemaField>
          <SchemaField.String
            name="key_"
            title="代码"
            x-decorator="FormItem"
            x-component="Input"
            required
          />
          <SchemaField.String
            name="label"
            title="名称"
            x-decorator="FormItem"
            x-component="Input"
            required
          />
          <SchemaField.String
            name="intro"
            title="说明"
            x-decorator="FormItem"
            x-component="Input.TextArea"
          />

          <SchemaField.Array
            name="items"
            x-decorator="FormItem"
            x-component="ArrayTable"
            x-component-props={{ pagination: false }}
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
                  name="sort_"
                  x-decorator="FormItem"
                  x-component="ArrayTable.Index"
                />
              </SchemaField.Void>
              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: '条目代码' }}
              >
                <SchemaField.String
                  name="key_"
                  x-decorator="FormItem"
                  x-component="Input"
                  required
                />
              </SchemaField.Void>
              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: '条目名称' }}
              >
                <SchemaField.String
                  name="label"
                  x-decorator="FormItem"
                  x-component="Input"
                  required
                />
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
            <SchemaField.Void x-component="ArrayTable.Addition" title="添加条目" />
          </SchemaField.Array>
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
