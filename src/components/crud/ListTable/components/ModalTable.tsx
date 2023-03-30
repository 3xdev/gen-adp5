import React from 'react';
import { Modal } from 'antd';
import ListTable from '@/components/crud/ListTable';

export interface ModalTableProps {
  onCancel: () => void;
  updateModalVisible: boolean;
  title: string;
  table: string;
  query: any;
  tableProps: any;
}

const ModalTable: React.FC<ModalTableProps> = (props) => {
  const { onCancel, updateModalVisible, title, table, query, tableProps } = props;

  return (
    <Modal
      destroyOnClose
      title={title}
      width={800}
      open={updateModalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ListTable {...tableProps} table={table} query={query} />
    </Modal>
  );
};

export default ModalTable;
