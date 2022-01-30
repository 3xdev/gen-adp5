import { PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
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
import { getList, getProTableSchema, updateItem, addItem, removeItem } from './service';
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
  const routeParams: RouteParams = useParams();

  const [schema, setSchema] = useState<TableSchema>({ rowKey: 'id', columns: [] });

  const [showDetail, setShowDetail] = useState<boolean>(false);

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

  useEffect(() => {
    getProTableSchema(routeParams.table).then((res) => {
      setSchema(res);
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
              ExportExcel(schema.columns, responseRows);
            }}
          >
            <ExportOutlined /> 导出
          </Button>,
        ]}
        request={(params, sorter, filter) => handleList(params, sorter, filter)}
        rowSelection={{
          onChange: (_, rows) => {
            setSelectedRows(rows);
          },
        }}
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
          <Button
            onClick={async () => {
              await handleRemove(selectedRows);
              setSelectedRows([]);
              actionRef.current?.reload();
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
            actionRef.current?.reload();
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
            columns={schema.columns as ProDescriptionsItemProps<TableItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ConfigTable;
