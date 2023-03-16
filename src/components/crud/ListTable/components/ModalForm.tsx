import React, { useMemo } from 'react';
import { Modal } from 'antd';
import type { IFieldState } from '@formily/core';
import { createForm, onFieldInit, onFieldReact } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { action, observable } from '@formily/reactive';
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
import CustomImageUpload from '@/components/Formily/CustomImageUpload';
import CustomAttachmentUpload from '@/components/Formily/CustomAttachmentUpload';
import CustomRelationPickup from '@/components/Formily/CustomRelationPickup';
import CustomRichText from '@/components/Formily/CustomRichText';
import { getSuggest } from '@/services/ant-design-pro/api';

const Text: React.FC<{
  content?: string;
  mode?: 'normal' | 'h1' | 'h2' | 'h3' | 'p';
}> = ({ mode, content, ...props }) => {
  const tagName = mode === 'normal' || !mode ? 'div' : mode;
  return React.createElement(tagName, props, content);
};

const fetchSuggestData = async (table: string, keyword: string, query: Record<string, any>) => {
  if (!keyword) {
    return [];
  }
  return new Promise((resolve) => {
    getSuggest(table, keyword, query).then((res) => {
      resolve(res.data);
    });
  });
};

const useSuggestDataSource = (
  name: string,
  table: string,
  query: Record<string, any>,
  service: (
    table: string,
    keyword: string,
    query: Record<string, any>,
  ) => Promise<{ label: string; value: any }[]>,
) => {
  const keyword = observable.ref('');

  onFieldInit(name, (field) => {
    field.setComponentProps({
      onSearch: (value: string) => {
        keyword.value = value;
      },
    });
  });

  onFieldReact(name, (field: IFieldState) => {
    field.loading = true;
    service(table, keyword.value || field.value, query).then(
      action.bound!((data) => {
        field.dataSource = data;
        field.loading = false;
      }),
    );
  });
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
    CustomImageUpload,
    CustomAttachmentUpload,
    CustomRelationPickup,
    CustomRichText,
  },
});

export interface ModalFormProps {
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: any) => void;
  updateModalVisible: boolean;
  title: string;
  schema: any;
  values: any;
}

const ModalForm: React.FC<ModalFormProps> = (props) => {
  const { updateModalVisible, title, schema, values, onCancel, onSubmit } = props;
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
      title={title}
      width={800}
      open={updateModalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form form={form} labelCol={6} wrapperCol={16}>
        <SchemaField schema={schema} scope={{ useSuggestDataSource, fetchSuggestData }} />
        <FormButtonGroup.FormItem>
          <Reset>重置</Reset>
          <Submit onSubmit={onSubmit}>提交</Submit>
        </FormButtonGroup.FormItem>
      </Form>
    </Modal>
  );
};

export default ModalForm;
