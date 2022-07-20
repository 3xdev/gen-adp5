/* eslint-disable no-underscore-dangle */
/* eslint-disable default-case */
import { PlusOutlined, ExportOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Popconfirm, Image } from 'antd';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useUpdateEffect } from 'ahooks';
import { history, useParams } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProProvider from '@ant-design/pro-provider';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import ModalForm from './components/ModalForm';
import type { RouteParams, TableSchema, TableOption, TableItem } from './data.d';
import { getProTableSchema, getFormilySchema } from '@/services/ant-design-pro/api';
import { getList, getItem, updateItem, addItem, removeItem, restItem } from './service';
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

const BasicTable: React.FC = () => {
  const routeParams: RouteParams = useParams();

  const provider = useContext(ProProvider);

  const [schema, setSchema] = useState<TableSchema>({ rowKey: 'id', options: [], columns: [] });
  const [tableOption, setTableOption] = useState<TableOption>({
    type: '',
    key: '',
    title: '',
    method: '',
    path: '',
  });
  const [formSchema, setFormSchema] = useState([{}]);
  const [formilyJson, setFormilyJson] = useState({});
  const [formilyValues, setFormilyValues] = useState<TableItem>();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableItem>();
  const [selectedRows, setSelectedRows] = useState<TableItem[]>([]);
  const responseRows = useRef<TableItem[]>([]);

  const handleList = async (params: any, sorter: any, filter: any) => {
    const result = getList(routeParams.table, { ...params, sorter, filter });
    result.then((res) => {
      responseRows.current = res.data;
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
            setShowUpdateForm(true);
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
      case 'modal':
        _handle = async () => {
          getItem(routeParams.table, record[schema.rowKey]).then((res) => {
            setFormilyValues(res);
            setShowModalForm(true);
            setTableOption(option);
          });
        };
        break;
      case 'page':
        _handle = () => {
          history.push(option.path + '/' + record[schema.rowKey]);
        };
        break;
      case 'request':
        _handle = async () => {
          await restItem(option.method, option.path + '/' + record[schema.rowKey], option.body);
          setSelectedRows([]);
          actionRef.current?.reloadAndRest?.();
        };
        break;
    }

    return ['delete', 'request'].includes(option.type) ? (
      <Popconfirm key={option.key} title={`确定${option.title}吗?`} onConfirm={_handle}>
        <a>{option.title}</a>
      </Popconfirm>
    ) : (
      <a key={option.key} onClick={_handle}>
        {option.title}
      </a>
    );
  };

  const renderToolbarOptions = (columns: any, option: any) => {
    let _handle = () => {};
    let _icon = <></>;
    switch (option.type) {
      case 'add':
        _handle = () => {
          setFormilyValues({});
          setShowUpdateForm(true);
        };
        _icon = <PlusOutlined />;
        break;
      case 'export':
        _handle = () => {
          ExportExcel(columns, responseRows.current);
        };
        _icon = <ExportOutlined />;
        break;
      case 'modal':
        _handle = () => {
          setFormilyValues({ ids: '0' });
          setShowModalForm(true);
          setTableOption(option);
        };
        break;
      case 'page':
        _handle = () => {
          history.push(option.path);
        };
        break;
      case 'request':
        _handle = async () => {
          await restItem(option.method, option.path + '/0', option.body);
          actionRef.current?.reloadAndRest?.();
        };
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
          actionRef.current?.reloadAndRest?.();
        };
        break;
      case 'modal':
        _handle = () => {
          setFormilyValues({ ids: selectedRows.map((row) => row[schema.rowKey]).join(',') });
          setShowModalForm(true);
          setTableOption(option);
        };
        break;
      case 'page':
        _handle = () => {
          history.push(option.path + '/' + selectedRows.map((row) => row[schema.rowKey]).join(','));
        };
        break;
      case 'request':
        _handle = async () => {
          await restItem(
            option.method,
            option.path + '/' + selectedRows.map((row) => row[schema.rowKey]).join(','),
            option.body,
          );
          setSelectedRows([]);
          actionRef.current?.reloadAndRest?.();
        };
        break;
    }
    return ['bdelete', 'request'].includes(option.type) ? (
      <Popconfirm key={option.key} title={`确定${option.title}吗?`} onConfirm={_handle}>
        <Button>{option.title}</Button>
      </Popconfirm>
    ) : (
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
          res.options.toolbar.map((option: any) => renderToolbarOptions(res.columns, option));
      }
      if (res.options.batch?.length > 0) {
        res.rowSelection = {
          onChange: (_: any, rows: any) => {
            setSelectedRows(rows);
          },
        };
      }
      setSchema(res);
      // 读取操作表单
      [...res.options.columns, ...res.options.toolbar, ...res.options.batch].forEach(
        (option: any) => {
          if (option.type == 'modal') {
            getFormilySchema('form', option.key).then((sres) => {
              formSchema[option.key] = sres;
              setFormSchema(formSchema);
            });
          }
        },
      );
    });
    getFormilySchema('table', routeParams.table).then((res) => {
      setFormilyJson(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeParams.table]);

  useUpdateEffect(() => {
    actionRef.current?.reloadAndRest?.();
  }, [schema]);

  return (
    <PageContainer>
      <ProProvider.Provider
        value={{
          ...provider,
          valueTypeMap: {
            customImages: {
              render: (text) => {
                return text ? (
                  <Image.PreviewGroup>
                    {text.split(',').map((item: string) => (
                      <Image width={32} key={item} src={item} />
                    ))}
                  </Image.PreviewGroup>
                ) : (
                  <>-</>
                );
              },
            },
          },
        }}
      >
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
            {schema.options.batch.map((option: any) =>
              renderBatchOptions(routeParams.table, option),
            )}
          </FooterToolbar>
        )}

        <UpdateForm
          onSubmit={async (value) => {
            const success = value[schema.rowKey]
              ? await handleUpdate(routeParams.table, value)
              : await handleAdd(routeParams.table, value);
            if (success) {
              setShowUpdateForm(false);
              setCurrentRow(undefined);
              actionRef.current?.reload();
            }
          }}
          onCancel={() => {
            setShowUpdateForm(false);
          }}
          updateModalVisible={showUpdateForm}
          schema={formilyJson}
          values={formilyValues}
        />

        <ModalForm
          onSubmit={async (value) => {
            const success = await restItem(
              tableOption.method,
              `${tableOption.path}/${value.ids ? value.ids : value.id}`,
              value,
            );
            if (success) {
              setShowModalForm(false);
              setCurrentRow(undefined);
              actionRef.current?.reload();
            }
          }}
          onCancel={() => {
            setShowModalForm(false);
          }}
          updateModalVisible={showModalForm}
          title={tableOption.title}
          schema={formSchema[tableOption.key]}
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
      </ProProvider.Provider>
    </PageContainer>
  );
};

export default BasicTable;
