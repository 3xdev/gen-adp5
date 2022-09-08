import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ListTable from '@/components/crud/ListTable';
import { Button, Modal } from 'antd';
import { Link } from 'umi';

const BasicTable: React.FC = () => {
  const [propsLogsModal, setPropsLogsModal] = useState({ visible: false, spu_id: 0 });

  return (
    <PageContainer>
      <ListTable
        table="product_spu"
        proTableProps={{
          pagination: { showSizeChanger: true, pageSizeOptions: [10, 100, 1000] },
        }}
        hiddenColumns={['content', 'product_category,name']}
        renderColumns={{
          // 调用弹窗组件
          name: (text: any, record: any) => (
            <a
              onClick={() => {
                setPropsLogsModal({ visible: true, spu_id: record.id });
              }}
            >
              {text}({record?.product_brand.name})
            </a>
          ),
          // 路由到关联页
          'product_brand,name': (text: any, record: any) => (
            <Link to={`/product/brand/${record.product_brand_id}`}>{text}</Link>
          ),
        }}
        renderColumnsOptions={{
          // 自定义列操作，覆盖表格设计中原先的操作
          update: (option: any, record: any) => (
            <Button
              key={option.action}
              onClick={() => {
                console.log(option, record);
              }}
            >
              {option.title}
            </Button>
          ),
          // 根据情况展示列操作
          putCancel: (option: any, record: any) =>
            record.status == 0 ? (
              <a key={option.action} href={`/product/brand/${record.product_brand_id}`}>
                {option.title}
              </a>
            ) : (
              <></>
            ),
        }}
        renderToolbarOptions={{
          // 自定义工具栏操作，覆盖表格设计中原先的操作
          create: (option: any) => (
            <a
              key={option.action}
              onClick={() => {
                console.log(option);
              }}
            >
              {option.title}
            </a>
          ),
        }}
        renderBatchOptions={{
          // 自定义批量操作，覆盖表格设计中原先的操作
          delete: (option: any, { selectedRowKeys }: any) => (
            <a
              key={option.action}
              onClick={() => {
                console.log(selectedRowKeys);
              }}
            >
              {option.title}
            </a>
          ),
        }}
      />
      <Modal
        destroyOnClose
        title="明细"
        visible={propsLogsModal.visible}
        onCancel={() => setPropsLogsModal({ visible: false, spu_id: 0 })}
        footer={null}
      >
        {propsLogsModal.spu_id}
      </Modal>
    </PageContainer>
  );
};

export default BasicTable;
