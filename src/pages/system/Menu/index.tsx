import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';
import type { TableItem } from './data.d';
import { getList, updateItem, addItem, removeItem } from './service';

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

const MenuTable: React.FC = () => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [datas, setDatas] = useState([]);

  const [currentRow, setCurrentRow] = useState<TableItem>();

  const refresh = async () => {
    getList().then((res) => {
      setDatas(res.data);
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  const columns: ProColumns<TableItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '路径',
      dataIndex: 'path',
    },
    {
      title: '图标',
      dataIndex: 'icon',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '禁用', status: 'Error' },
        1: { text: '正常', status: 'Success' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
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
            refresh();
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      {datas.length > 0 && (
        <ProTable<TableItem>
          columns={columns}
          dataSource={datas}
          search={false}
          pagination={false}
          rowKey="id"
          expandable={{
            defaultExpandAllRows: true,
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              key="add"
              onClick={() => {
                handleUpdateModalVisible(true);
                setCurrentRow(undefined);
              }}
            >
              <PlusOutlined /> 新建
            </Button>,
          ]}
        />
      )}

      <UpdateForm
        onSubmit={async (value) => {
          const success = value.id ? await handleUpdate(value) : await handleAdd(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            refresh();
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />
    </PageContainer>
  );
};

export default MenuTable;
