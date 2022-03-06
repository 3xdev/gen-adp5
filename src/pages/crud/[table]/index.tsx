/* eslint-disable no-underscore-dangle */
/* eslint-disable default-case */
import { PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Popconfirm } from 'antd';
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
import { getProTableSchema, getFormilySchema } from '@/services/ant-design-pro/api';
import { getList, getItem, updateItem, addItem, removeItem } from './service';
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
 */
const handleRemove = async (table: string, ids: any) => {
  const hide = message.loading('正在删除');
  if (!ids) return true;
  try {
    await removeItem(table, ids);
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

const ConfigTable: React.FC = () => {
  const routeParams: RouteParams = useParams();

  const [schema, setSchema] = useState<TableSchema>({ rowKey: 'id', options: [], columns: [] });
  const [formilyJson, setFormilyJson] = useState({});
  const [formilyValues, setFormilyValues] = useState<TableItem>();

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
        _handle = async () => {
          getItem(routeParams.table, record[schema.rowKey]).then((res) => {
            setFormilyValues(res);
            setShowForm(true);
          });
        };
        break;
      case 'delete':
        _handle = async () => {
          await handleRemove(table, record[schema.rowKey]);
          setCurrentRow(undefined);
          actionRef.current?.reloadAndRest?.();
        };
        break;
    }

    return option.confirm ? (
      <Popconfirm
        key={option.key}
        title={`是否确认${option.title}吗?`}
        okText="是"
        cancelText="否"
        onConfirm={_handle}
      >
        <a>{option.title}</a>
      </Popconfirm>
    ) : (
      <a key={option.key} onClick={_handle}>
        {option.title}
      </a>
    );
  };

  const renderToolbarOptions = (columns: any, option: any, records: any) => {
    let _handle = () => {};
    let _icon = <></>;
    switch (option.type) {
      case 'add':
        _handle = () => {
          setFormilyValues({});
          setShowForm(true);
        };
        _icon = <PlusOutlined />;
        break;
      case 'export':
        _handle = () => {
          ExportExcel(columns, records);
        };
        _icon = <ExportOutlined />;
        break;
    }
    return (
      <Button type="primary" key={option.key} onClick={_handle}>
        {_icon} {option.title}
      </Button>
    );
  };

  const renderBatchOptions = (table: string, option: any) => {
    let _handle = () => {};
    switch (option.type) {
      case 'bdelete':
        _handle = async () => {
          await handleRemove(table, selectedRows.map((row) => row[schema.rowKey]).join(','));
          setSelectedRows([]);
          actionRef.current?.reload();
        };
        break;
    }
    return (
      <Button key={option.key} onClick={_handle}>
        {option.title}
      </Button>
    );
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
          res.options.toolbar.map((option: any) =>
            renderToolbarOptions(res.columns, option, responseRows),
          );
      }
      if (res.options.batch?.length > 0) {
        res.rowSelection = {
          onChange: (_: any, rows: any) => {
            setSelectedRows(rows);
          },
        };
      }
      setSchema(res);
    });
    getFormilySchema(routeParams.table).then((res) => {
      setFormilyJson(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          const success = value[schema.rowKey]
            ? await handleUpdate(routeParams.table, value)
            : await handleAdd(routeParams.table, value);
          if (success) {
            setFormilyValues(undefined);
            setShowForm(false);
            setCurrentRow(undefined);
            actionRef.current?.reload();
          }
        }}
        onCancel={() => {
          setFormilyValues(undefined);
          setShowForm(false);
        }}
        updateModalVisible={showForm}
        schema={formilyJson}
        values={formilyValues}
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
        {currentRow && (
          <ProDescriptions<TableItem>
            column={2}
            dataSource={currentRow}
            columns={schema.columns as ProDescriptionsItemProps<TableItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ConfigTable;
