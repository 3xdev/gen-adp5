import React, { useState, useEffect } from 'react';
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
import { Card, Slider, Rate, message } from 'antd';
import CustomImageUpload from '@/components/Formily/CustomImageUpload';
import CustomRichText from '@/components/Formily/CustomRichText';
import { updateSetting } from './service';
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
    CustomImageUpload,
    CustomRichText,
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

  useEffect(() => {
    getFormilySchema('form', 'setting').then((res) => {
      setSchema(res);
    });
  }, []);

  const form = createForm({});

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
