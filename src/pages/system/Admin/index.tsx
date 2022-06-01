import { ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Avatar } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import type { TableItem } from './data.d';
import { getList, updateItem, addItem, removeItem } from './service';
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
 * @param rows
 */
const handleRemove = async (rows: TableItem[]) => {
  const hide = message.loading('正在删除');
  if (!rows) return true;
  try {
    await removeItem(rows.map((row) => row.id));
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

const AdminTable: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableItem>();
  const [selectedRows, setSelectedRows] = useState<TableItem[]>([]);
  const [allRows, setAllRows] = useState<TableItem[]>([]);

  const handleList = async (params: any, sorter: any, filter: any) => {
    const result = getList({ ...params, sorter, filter });
    result.then((res) => {
      setAllRows(res.data);
    });
    return result;
  };

  const columns: ProColumns<TableItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
      sorter: true,
      hideInForm: true,
    },
    {
      title: '帐号',
      dataIndex: 'username',
      sorter: true,
      render: (dom, record) => (
        <>
          <Avatar src={record.avatar} />
          {dom}
        </>
      ),
    },
    {
      title: '密码',
      dataIndex: 'password',
      search: false,
      hideInTable: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '禁用', status: 'Error' },
        1: { text: '正常', status: 'Success' },
      },
      search: false,
      filters: true,
      hideInForm: true,
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
          key="edit"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <Popconfirm
          key="delconfirm"
          title={`是否确认删除吗?`}
          okText="是"
          cancelText="否"
          onConfirm={async () => {
            await handleRemove([record]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          <a>删除</a>
        </Popconfirm>,
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
            key="add"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
          <Button
            type="primary"
            key="export"
            onClick={() => {
              ExportExcel(columns, allRows);
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
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<TableItem, TableItem>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
        />
      </CreateForm>

      {currentRow?.id && (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
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
      )}
    </PageContainer>
  );
};

export default AdminTable;
