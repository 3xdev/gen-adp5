import { PlusOutlined, ExportOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { Space, Button, message, Drawer, Popconfirm, Image, Tag } from 'antd';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { useUpdateEffect } from 'ahooks';
import { history, Link } from 'umi';
import ProProvider from '@ant-design/pro-provider';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import ModalForm from './components/ModalForm';
import type { Props, TableSchema, TableOption, TableItem } from './data.d';
import { getProTableSchema, getFormilySchema, getSuggest } from '@/services/ant-design-pro/api';
import { getList, getItem, updateItem, addItem, removeItem, restItem } from './service';
import ExportExcel from '@/components/ExportExcel';
import Mustache from 'mustache';

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

const ListTable: React.FC<Props> = (props) => {
  const provider = useContext(ProProvider);

  const [schema, setSchema] = useState<TableSchema>({ rowKey: 'id', options: [], columns: [] });
  const [tableOption, setTableOption] = useState<TableOption>({
    type: '',
    key: '',
    title: '',
    target: '',
    request: {},
    body: {},
  });
  const [formSchema, setFormSchema] = useState([{}]);
  const [formilyJson, setFormilyJson] = useState({});
  const [formilyValues, setFormilyValues] = useState<TableItem>();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableItem>();
  const responseRows = useRef<TableItem[]>([]);

  const handleList = async (params: any, sorter: any, filter: any) => {
    const result = getList(props.table, { ...params, ...props.query, sorter, filter });
    result.then((res) => {
      responseRows.current = res.data;
    });
    return result;
  };

  const renderColumnsOptions = (option: any, record: any) => {
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
          getItem(props.table, record[schema.rowKey]).then((res) => {
            setFormilyValues(res);
            setShowUpdateForm(true);
          });
        };
        break;
      case 'delete':
        _handle = async () => {
          await handleRemove(props.table, record[schema.rowKey]);
          setCurrentRow(undefined);
          actionRef.current?.reloadAndRest?.();
        };
        break;
      case 'modal':
        _handle = async () => {
          getItem(props.table, record[schema.rowKey]).then((res) => {
            setFormilyValues({ ...res, ...props.query });
            setShowModalForm(true);
            setTableOption(option);
          });
        };
        break;
      case 'page':
        _handle = () => {
          history.push(Mustache.render(option.target, { ...record, ids: record[schema.rowKey] }));
        };
        break;
      case 'request':
        _handle = async () => {
          await restItem(
            option.request.method,
            option.request.url,
            record[schema.rowKey],
            option.body,
          );
          actionRef.current?.reloadAndRest?.();
        };
        break;
    }

    return ['delete', 'request'].includes(option.type) ? (
      <Popconfirm key={option.action} title={`确定${option.title}吗?`} onConfirm={_handle}>
        <a key={option.action}>{option.title}</a>
      </Popconfirm>
    ) : (
      <a key={option.action} onClick={_handle}>
        {option.title}
      </a>
    );
  };

  const renderToolbarOptions = (option: any, columns: any) => {
    let _handle = () => {};
    let _icon = <></>;
    switch (option.type) {
      case 'add':
        _handle = () => {
          setFormilyValues(props.query);
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
          setFormilyValues({ ids: '0', ...props.query });
          setShowModalForm(true);
          setTableOption(option);
        };
        break;
      case 'page':
        _handle = () => {
          history.push(Mustache.render(option.target, {}));
        };
        break;
      case 'request':
        _handle = async () => {
          await restItem(option.request.method, option.request.url, '0', option?.body);
          actionRef.current?.reloadAndRest?.();
        };
        break;
    }
    return ['request'].includes(option.type) ? (
      <Popconfirm key={option.action} title={`确定${option.title}吗?`} onConfirm={_handle}>
        <Button key={option.action}>
          {_icon} {option.title}
        </Button>
      </Popconfirm>
    ) : (
      <Button type="primary" key={option.action} onClick={_handle}>
        {_icon} {option.title}
      </Button>
    );
  };

  const renderBatchOptions = (option: any, { selectedRowKeys }: any) => {
    let _handle = () => {};
    switch (option.type) {
      case 'bdelete':
        _handle = async () => {
          await handleRemove(props.table, selectedRowKeys.join(','));
          actionRef.current?.reloadAndRest?.();
        };
        break;
      case 'modal':
        _handle = () => {
          setFormilyValues({ ids: selectedRowKeys.join(','), ...props.query });
          setShowModalForm(true);
          setTableOption(option);
        };
        break;
      case 'page':
        _handle = () => {
          history.push(Mustache.render(option.target, { ids: selectedRowKeys.join(',') }));
        };
        break;
      case 'request':
        _handle = async () => {
          await restItem(
            option.request.method,
            option.request.url,
            selectedRowKeys.join(','),
            option.body,
          );
          actionRef.current?.reloadAndRest?.();
        };
        break;
    }
    return selectedRowKeys.length ? (
      ['bdelete', 'request'].includes(option.type) ? (
        <Popconfirm key={option.action} title={`确定${option.title}吗?`} onConfirm={_handle}>
          <Button key={option.action}>{option.title}</Button>
        </Popconfirm>
      ) : (
        <Button key={option.action} onClick={_handle}>
          {option.title}
        </Button>
      )
    ) : (
      <Button key={option.action} disabled>
        {option.title}
      </Button>
    );
  };

  useEffect(() => {
    getProTableSchema(props.table).then((res) => {
      if (props?.hiddenColumns) {
        res.columns = res.columns.filter((column: any) => {
          return !props.hiddenColumns?.includes(column.dataIndex?.toString());
        });
      }
      res.columns.forEach((column: any) => {
        if (column?.sorter) {
          column.key = props.table + '-' + column.dataIndex;
        }
        if (column?.requestTable) {
          column.request = async (search: any) => {
            if (!search.keyWords) {
              return [];
            }
            return new Promise((resolve) => {
              getSuggest(column.requestTable, search.keyWords).then((sres) => {
                resolve(sres.data);
              });
            });
          };
        }
        if (column?.templateText || column?.templateLinkTo) {
          column.render = (_: any, record: any) =>
            column?.templateLinkTo ? (
              <Link to={Mustache.render(column.templateLinkTo, record)}>
                {column?.templateText ? Mustache.render(column.templateText, record) : _}
              </Link>
            ) : column?.templateText ? (
              Mustache.render(column.templateText, record)
            ) : (
              _
            );
        }
        if (props?.renderColumns?.[column.dataIndex]) {
          column.render = props.renderColumns?.[column.dataIndex];
        }
      });
      if (res.columns.every((column: any) => column?.hideInSearch)) {
        res.search = false;
      }
      if (res.options.columns?.length) {
        res.columns.push({
          title: '操作',
          dataIndex: 'option',
          valueType: 'option',
          render: (_: any, record: any) =>
            res.options.columns.map((option: any) =>
              props?.renderColumnsOptions?.[option.action]
                ? props?.renderColumnsOptions?.[option.action](option, record)
                : renderColumnsOptions(option, record),
            ),
        });
      }
      if (res.options.toolbar?.length) {
        res.toolBarRender = () =>
          res.options.toolbar.map((option: any) =>
            props?.renderToolbarOptions?.[option.action]
              ? props?.renderToolbarOptions?.[option.action](option, res.columns)
              : renderToolbarOptions(option, res.columns),
          );
      }
      if (res.options.batch?.length > 0) {
        res.rowSelection = {
          alwaysShowAlert: true,
        };
        res.tableAlertOptionRender = ({ selectedRowKeys, selectedRows }: any) => {
          return (
            <Space size={12}>
              {res.options.batch.map((option: any) =>
                props?.renderBatchOptions?.[option.action]
                  ? props?.renderBatchOptions?.[option.action](option, {
                      selectedRowKeys,
                      selectedRows,
                    })
                  : renderBatchOptions(option, { selectedRowKeys, selectedRows }),
              )}
            </Space>
          );
        };
      }
      setSchema(res);
      // 读取操作表单
      [...res.options.columns, ...res.options.toolbar, ...res.options.batch].forEach(
        (option: any) => {
          if (option.type == 'modal') {
            getFormilySchema('form', option.target).then((sres) => {
              formSchema[option.target] = sres;
              setFormSchema(formSchema);
            });
          }
        },
      );
    });
    getFormilySchema('table', props.table).then((res) => {
      setFormilyJson(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.table]);

  useUpdateEffect(() => {
    actionRef.current?.reset?.();
  }, [schema]);

  return (
    <ProProvider.Provider
      value={{
        ...provider,
        valueTypeMap: {
          customImages: {
            render: (files) => {
              return files && files.length > 0 ? (
                <Image.PreviewGroup>
                  {files.map((file: string) => (
                    <Image width={36} key={file} src={file} />
                  ))}
                </Image.PreviewGroup>
              ) : (
                <>-</>
              );
            },
          },
          customAttachments: {
            render: (files) => {
              return files && files.length > 0 ? (
                <>
                  {files.map((file: string) => (
                    <Tag
                      icon={<CloudDownloadOutlined />}
                      key={file.slice(file.lastIndexOf('/') + 1)}
                    >
                      {file.slice(file.lastIndexOf('/') + 1)}
                    </Tag>
                  ))}
                </>
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
        request={(params, sorter, filter) => handleList(params, sorter, filter)}
        beforeSearchSubmit={(params: any) => {
          actionRef.current?.clearSelected?.();
          return params;
        }}
        {...schema}
        {...props.proTableProps}
      />

      <UpdateForm
        onSubmit={async (value) => {
          const success = value[schema.rowKey]
            ? await handleUpdate(props.table, value)
            : await handleAdd(props.table, value);
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
            tableOption?.request?.method,
            tableOption?.request?.url,
            value.ids ?? value.id,
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
        schema={formSchema[tableOption.target]}
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
  );
};

export default ListTable;
