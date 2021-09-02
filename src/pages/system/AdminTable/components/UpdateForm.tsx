import React from 'react';
import { Form, Input, Modal, Select, Button } from 'antd';
import type { TableItem } from '../data.d';

export interface UpdateFormProps {
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: Partial<TableItem>) => void;
  updateModalVisible: boolean;
  values: Partial<TableItem>;
}
const FormItem = Form.Item;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const formVals = props.values;
  const [form] = Form.useForm();

  const { onSubmit: handleUpdate, onCancel: handleUpdateModalVisible, updateModalVisible } = props;

  const handleSubmit = async () => {
    const fieldsValue = await form.validateFields();
    handleUpdate({ ...formVals, ...fieldsValue });
  };

  const renderContent = () => {
    return (
      <>
        <FormItem name="username" label="帐号">
          <Input disabled />
        </FormItem>
        <FormItem name="nickname" label="昵称">
          <Input />
        </FormItem>
        <FormItem name="mobile" label="手机号">
          <Input />
        </FormItem>
        <FormItem name="password" label="密码" initialValue="">
          <Input placeholder="为空不修改密码" />
        </FormItem>
        <FormItem name="status" label="状态" rules={[{ required: true, message: '请选择！' }]}>
          <Select style={{ width: '100%' }}>
            <Option value={0}>禁用</Option>
            <Option value={1}>正常</Option>
          </Select>
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false)}>取消</Button>
        <Button type="primary" onClick={() => handleSubmit()}>
          确定
        </Button>
      </>
    );
  };

  return (
    <Modal
      destroyOnClose
      title="修改"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form {...formLayout} form={form} initialValues={formVals}>
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
