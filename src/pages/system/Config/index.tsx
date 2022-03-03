import { PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import type { TableItem } from './data.d';
import { getList, updateItem, addItem, removeItem } from './service';
import { getDicts } from '@/services/ant-design-pro/api';
import ExportExcel from '@/components/ExportExcel';

/**
 * 添加
 *
 * @param fields
 */
const handleAdd = async (fields: TableItem) => {
  const hide = message.loading('正在添加');
  try {
    await addItem({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

/**
 * 更新
 *
 * @param fields
 */
const handleUpdate = async (fields: Partial<TableItem>) => {
  const hide = message.loading('正在更新');
  try {
    await updateItem({ ...fields });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

/**
 * 删除
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeItem(selectedRows.map((row) => row.id));
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

const ConfigTable: React.FC = () => {
  /** 更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const [tabs, setTabs] = useState([]);
  const [components, setComponents] = useState([]);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableItem>();
  const [selectedRows, setSelectedRows] = useState<TableItem[]>([]);
  const [responseRows, setResponseRows] = useState<TableItem[]>([]);

  const handleList = async (params: any, sorter: any, filter: any) => {
    const result = getList({ ...params, sorter, filter });
    result.then((res) => {
      setResponseRows(res.data);
    });
    return result;
  };

  useEffect(() => {
    getDicts('config_tab').then((res) => {
      const items: any = [];
      res.items.forEach((item: any) => {
        items[item.value] = item.label;
      });
      setTabs(items);
    });
    getDicts('config_component').then((res) => {
      const items: any = [];
      res.items.forEach((item: any) => {
        items[item.value] = item.label;
      });
      setComponents(items);
    });
  }, []);

  const columns: ProColumns<TableItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
      sorter: true,
    },
    {
      title: '分组',
      dataIndex: 'tab',
      valueEnum: { ...tabs },
      search: false,
      filters: true,
    },
    {
      title: '编码',
      dataIndex: 'code',
      sorter: true,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '组件',
      dataIndex: 'component',
      valueEnum: { ...components },
      search: false,
      filters: true,
    },
    {
      title: '描述说明',
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      search: false,
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <a
          key="remove"
          onClick={async () => {
            await handleRemove([record]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableItem>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="create"
            onClick={() => {
              handleUpdateModalVisible(true);
              setCurrentRow(undefined);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
          <Button
            type="primary"
            key="export"
            onClick={() => {
              ExportExcel(columns, responseRows);
            }}
          >
            <ExportOutlined /> 导出
          </Button>,
        ]}
        request={(params, sorter, filter) => handleList(params, sorter, filter)}
        columns={columns}
        rowSelection={{
          onChange: (_, rows) => {
            setSelectedRows(rows);
          },
        }}
      />
      {selectedRows?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> 项
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRows);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <UpdateForm
        onSubmit={async (value) => {
          const success = value.id ? await handleUpdate(value) : await handleAdd(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<TableItem>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<TableItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ConfigTable;
