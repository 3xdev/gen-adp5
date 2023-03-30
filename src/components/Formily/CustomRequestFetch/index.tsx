import { Input as AntdInput } from 'antd';
import { connect } from '@formily/react';
import omit from 'rc-util/lib/omit';
import { useState } from 'react';
import { requestFetch } from '@/services/ant-design-pro/api';
const { Search } = AntdInput;

const CustomRequestFetch = connect((props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  // 排除自定义组件属性
  const inputProps = omit(props, ['method', 'url', 'params', 'target']);
  const handleRequest = () => {
    setLoading(true);
    requestFetch(props.method, props.url, props.params)
      .then((res) => {
        //todo: 返回数据处理
        console.log(res.data);
      })
      .finally(() => setLoading(false));
  };
  return <Search {...inputProps} onSearch={handleRequest} loading={loading} />;
});

export default CustomRequestFetch;
