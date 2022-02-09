import { PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Modal, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { useUpdateEffect } from 'ahooks';
import { useParams } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import type { RouteParams, TableSchema, TableItem } from './data.d';
import {
  getList,
  getProTableSchema,
  getFormilySchema,
  updateItem,
  addItem,
  removeItem,
} from './service';
import ExportExcel from '@/components/ExportExcel';

/**
 * 添加
 *
 * @param fields
 */
const handleAdd = async (table: string, fields: TableItem) => {
  const hide = message.loading('正在添加');
  try {
    await addItem(table, { ...fields });
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
const handleUpdate = async (table: string, fields: Partial<TableItem>) => {
  const hide = message.loading('正在更新');
  try {
    await updateItem(table, { ...fields });
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
const handleRemove = async (table: string, selectedRows: TableItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeItem(
      table,
      selectedRows.map((row) => row.id),
    );
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
  const routeParams: RouteParams = useParams();

  const [schema, setSchema] = useState<TableSchema>({ rowKey: 'id', options: [], columns: [] });
  const [formilyJson, setFormilyJson] = useState({});

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableItem>();
  const [selectedRows, setSelectedRows] = useState<TableItem[]>([]);
  const [responseRows, setResponseRows] = useState<TableItem[]>([]);

  const handleList = async (params: any, sorter: any, filter: any) => {
    const result = getList(routeParams.table, { ...params, sorter, filter });
    result.then((res) => {
      setResponseRows(res.data);
    });
    return result;
  };

  const renderColumnsOptions = (table: string, option: any, record: any) => {
    let _handle = () => {};
    switch (option.type) {
      case 'view':
        _handle = () => {
          setCurrentRow(record);
          setShowDetail(true);
        };
        break;
      case 'edit':
        _handle = () => {
          setCurrentRow(record);
          handleUpdateModalVisible(true);
        };
        break;
      case 'delete':
        _handle = async () => {
          await handleRemove(table, [record]);
          actionRef.current?.reloadAndRest?.();
        };
        break;
    }

    return option.confirm ? (
      <Popconfirm
        key={option.type}
        title={`是否确认${option.title}吗?`}
        okText="是"
        cancelText="否"
        onConfirm={_handle}
      >
        <a>{option.title}</a>
      </Popconfirm>
    ) : (
      <a key={option.type} onClick={_handle}>
        {option.title}
      </a>
    );
  };

  const renderToolbarOptions = (columns: any, option: any) => {
    switch (option.type) {
      case 'add':
        return (
          <Button
            type="primary"
            key="create"
            onClick={() => {
              handleUpdateModalVisible(true);
              setCurrentRow(undefined);
            }}
          >
            <PlusOutlined /> 新建
          </Button>
        );
      case 'export':
        return (
          <Button
            type="primary"
            key="export"
            onClick={() => {
              ExportExcel(columns, responseRows);
            }}
          >
            <ExportOutlined /> 导出
          </Button>
        );
      default:
        return <></>;
    }
  };

  const renderBatchOptions = (table: string, option: any) => {
    let _handle = () => {};
    switch (option.type) {
      case 'bdelete':
        _handle = async () => {
          await handleRemove(table, selectedRows);
          setSelectedRows([]);
          actionRef.current?.reload();
        };
        break;
    }

    return <Button onClick={_handle}>{option.title}</Button>;
  };

  const rowSelection = {
    onChange: (_: any, rows: any) => {
      setSelectedRows(rows);
    },
  };

  useEffect(() => {
    getProTableSchema(routeParams.table).then((res) => {
      if (res.options.columns?.length > 0) {
        res.columns.push({
          title: '操作',
          dataIndex: 'option',
          valueType: 'option',
          render: (_: any, record: any) =>
            res.options.columns.map((option: any) =>
              renderColumnsOptions(routeParams.table, option, record),
            ),
        });
      }
      if (res.options.toolbar?.length > 0) {
        res.toolBarRender = () =>
          res.options.toolbar.map((option: any) => renderToolbarOptions(res.columns, option));
      }
      if (res.options.batch?.length > 0) {
        res.rowSelection = rowSelection;
      }
      setSchema(res);
    });
    getFormilySchema(routeParams.table).then((res) => {
      setFormilyJson(res);
    });
  }, [routeParams.table]);

  useUpdateEffect(() => {
    actionRef.current?.reloadAndRest?.();
  }, [schema]);

  return (
    <PageContainer>
      <ProTable<TableItem>
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        request={(params, sorter, filter) => handleList(params, sorter, filter)}
        {...schema}
      />
      {selectedRows?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> 项
            </div>
          }
        >
          {schema.options.batch.map((option: any) => renderBatchOptions(routeParams.table, option))}
        </FooterToolbar>
      )}

      <UpdateForm
        onSubmit={async (value) => {
          const success = value.id
            ? await handleUpdate(routeParams.table, value)
            : await handleAdd(routeParams.table, value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        schema={formilyJson}
        values={currentRow || {}}
      />

      <Modal
        destroyOnClose
        title="修改"
        visible={showForm}
        onCancel={() => {
          setCurrentRow(undefined);
          setShowForm(false);
        }}
        footer={null}
      >
        {currentRow?.id && (
          <ProTable<TableItem, TableItem>
            onSubmit={async (value) => {
              console.log(value);
              const success = await handleAdd(routeParams.table, value);
              if (success) {
                setCurrentRow(undefined);
                setShowForm(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            type="form"
            dataSource={[currentRow]}
            {...schema}
          />
        )}
      </Modal>

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
            columns={schema.columns as ProDescriptionsItemProps<TableItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ConfigTable;
