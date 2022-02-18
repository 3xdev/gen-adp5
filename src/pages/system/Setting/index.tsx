import React, { useMemo, useState, useEffect } from 'react';
import { createForm, onFormInit } from '@formily/core';
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
import { Card, Slider, Rate, message } from 'antd';
import { getConfigs, updateSetting } from './service';
import { getFormilySchema } from '@/services/ant-design-pro/api';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';

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

/**
 * 保存设置
 */
const handleSetting = async (fields: any) => {
  const hide = message.loading('正在更新');
  try {
    await updateSetting({ ...fields });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

const Setting: React.FC = () => {
  const [schema, setSchema] = useState({});
  const [values, setValues] = useState({});

  useEffect(() => {
    getConfigs().then((cres) => {
      const items: any = {};
      cres.data.forEach((item: any) => {
        items[item.code] = item.value;
      });
      setValues(items);
    });
  }, []);

  const form = useMemo(
    () =>
      createForm({
        initialValues: values,
        effects() {
          onFormInit(() => {
            getFormilySchema('setting').then((res) => {
              setSchema(res);
            });
          });
        },
      }),
    [values],
  );

  return (
    <PageContainer>
      <ProCard>
        <Form form={form} labelCol={3} wrapperCol={12}>
          <SchemaField schema={schema} />
          <FormButtonGroup.FormItem>
            <Reset>重置</Reset>
            <Submit onSubmit={handleSetting}>提交</Submit>
          </FormButtonGroup.FormItem>
        </Form>
      </ProCard>
    </PageContainer>
  );
};

export default Setting;
