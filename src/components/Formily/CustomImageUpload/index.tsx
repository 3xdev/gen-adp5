import { Upload as AntdUpload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from '@formily/react';

const getState = (target: any) => {
  if (target?.success === false) return 'error';
  if (target?.failed === true) return 'error';
  if (target?.error) return 'error';
  return target?.state || target?.status;
};
const getURL = (target: any) => {
  return target?.url || target?.downloadURL || target?.imgURL;
};
const normalizeFileList = (fileList: any[]) => {
  if (fileList && fileList.length) {
    return fileList.map((file, index) => {
      return {
        ...file,
        uid: file.uid || `rc-upload-${index}`,
        status: getState(file.response) || getState(file),
        url: getURL(file) || getURL(file?.response),
      };
    });
  }
  return [];
};
const buildFileList = (fileString: string) => {
  return fileString.split(',').map((file, index) => {
    return {
      uid: `rc-upload-${index}`,
      status: 'done',
      url: file,
    };
  });
};
function useUploadProps(props: any) {
  const onChange = (param: any) => {
    props.onChange(
      normalizeFileList(param.fileList)
        .filter((file: any) => file.status === 'done')
        .map((file: any) => file.url)
        .join(','),
    );
  };
  return {
    ...props,
    action: '/api/admin/upload/image/img',
    accept: 'image/*',
    listType: 'picture-card',
    defaultFileList: props.value ? buildFileList(props.value) : [],
    onChange,
  };
}

const CustomImageUpload = connect((props: any) => {
  const token = localStorage.getItem('token') || '';
  return (
    <AntdUpload
      {...useUploadProps(props)}
      headers={{
        Authorization: `Bearer ${token}`,
      }}
    >
      {props.children || <UploadOutlined style={{ fontSize: 20 }} />}
    </AntdUpload>
  );
});

export default CustomImageUpload;
