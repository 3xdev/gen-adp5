import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Select, Button, Upload, notification } from 'antd';
import type { TableItem, UploadItem } from '../data.d';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { allRoles } from '@/services/ant-design-pro/api';

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
  const [roles, setRoles] = useState([]);
  const [uploadVal, setUploadVal] = useState<UploadItem>({ loading: false, url: formVals.avatar });
  const { onSubmit: handleUpdate, onCancel: handleUpdateModalVisible, updateModalVisible } = props;

  useEffect(() => {
    allRoles().then((res) => {
      const items: any = [];
      res.data.forEach((item: any) => {
        items[item.id] = item;
      });
      setRoles(items);
    });
  }, []);

  const handleSubmit = async () => {
    const fieldsValue = await form.validateFields();
    handleUpdate({ ...formVals, ...fieldsValue });
  };

  const handleUploadChange = (fileList: any) => {
    if (fileList.file.status === 'uploading') {
      setUploadVal({ loading: true });
      return;
    }
    if (fileList.file.status === 'error') {
      setUploadVal({ loading: false });
      notification.error({
        message: '上传失败',
        description: fileList.file.response.message,
      });
      return;
    }
    if (fileList.file.status === 'done') {
      setUploadVal({ loading: false, url: fileList.file.response.url });
      formVals.avatar = fileList.file.response.url;
    }
  };

  const token = localStorage.getItem('token') || '';
  const jwtHeader = { Authorization: `Bearer ${token}` };

  const renderContent = () => {
    const uploadButton = (
      <div>
        {uploadVal.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>上传</div>
      </div>
    );

    return (
      <>
        <FormItem label="头像">
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="/api/admin/upload/image/avatar"
            headers={jwtHeader}
            onChange={handleUploadChange}
          >
            {uploadVal.url ? <img src={uploadVal.url} style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </FormItem>
        <FormItem name="username" label="帐号">
          <Input />
        </FormItem>
        <FormItem name="roles" label="角色">
          <Select mode="multiple">
            {roles.map((role: any) => (
              <>
                <Option value={role.id}>{role.name}</Option>
              </>
            ))}
          </Select>
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
