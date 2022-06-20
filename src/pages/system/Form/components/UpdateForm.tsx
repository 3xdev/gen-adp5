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

export interface UpdateFormProps {
  onCancel: () => void;
  onSubmit: (values: any) => void;
  updateModalVisible: boolean;
  values: any;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { updateModalVisible, values, onCancel, onSubmit } = props;
  values.schema_string = JSON.stringify(values.schema);
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
            name="code"
            title="代码"
            x-decorator="FormItem"
            x-component="Input"
            readOnly={values.add ? false : true}
            required
          />
          <SchemaField.String
            name="name"
            title="名称"
            x-decorator="FormItem"
            x-component="Input"
            required
          />
          <SchemaField.String
            name="schema_string"
            title="Schema"
            x-decorator="FormItem"
            x-component="Input.TextArea"
            x-component-props={{ style: { height: '320px' } }}
          />
          {values.add || (
            <SchemaField.Markup
              name="status"
              title="状态"
              x-decorator="FormItem"
              x-component="Select"
              enum={[
                { label: '禁用', value: 0 },
                { label: '正常', value: 1 },
              ]}
              required
            />
          )}
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
