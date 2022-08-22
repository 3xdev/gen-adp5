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
const buildFileList = (files: string[]) => {
  return files.map((file, index) => {
    return {
      uid: `rc-upload-${index}`,
      status: 'done',
      name: file.slice(file.lastIndexOf('/') + 1),
      url: file,
    };
  });
};
function useUploadProps(props: any) {
  const onChange = (param: any) => {
    props.onChange(
      props.multiple
        ? normalizeFileList(param.fileList)
            .filter((file: any) => file.status === 'done')
            .map((file: any) => file.url)
        : param.fileList && param.fileList.length
        ? getURL(param.fileList[0]) || getURL(param.fileList[0]?.response)
        : '',
    );
  };
  return {
    action: '/api/admin/upload/image/img',
    accept: 'image/*',
    listType: 'picture-card',
    ...props,
    defaultFileList: props.value ? buildFileList(props.multiple ? props.value : [props.value]) : [],
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
