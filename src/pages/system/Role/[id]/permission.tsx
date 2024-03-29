/* eslint-disable no-underscore-dangle */
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
import { getTable, getPermission, putPermission } from '../service';
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

const PForm: React.FC = () => {
  const routeParams: RouteParams = useParams();

  const [values, setValues] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    getPermission(routeParams.id).then((res) => {
      console.log(res);
      setValues(res);
    });
    getTable().then((res) => {
      setTables(res.data);
    });
  }, [routeParams.id]);

  const form = useMemo(
    () =>
      createForm({
        initialValues: values,
      }),
    [values],
  );

  const handleUpdate = async (fields: Partial<TableItem>) => {
    const hide = message.loading('正在提交');
    try {
      await putPermission(routeParams.id, { ...fields });
      hide();
      message.success('提交成功');
      return true;
    } catch (error) {
      hide();
      return false;
    }
  };

  return (
    <PageContainer>
      <ProCard>
        <Form form={form} labelCol={6} wrapperCol={16}>
          <SchemaField>
            <SchemaField.Boolean
              name="all"
              title="全选"
              x-component="Checkbox"
              x-decorator="FormItem"
            />
            {tables.map((table: any) => (
              <>
                <SchemaField.Markup
                  name={table.code}
                  title={table.name}
                  enum={table.actions}
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
              </>
            ))}
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

export default PForm;
