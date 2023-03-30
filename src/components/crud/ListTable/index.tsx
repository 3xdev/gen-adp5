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
import ModalTable from './components/ModalTable';
import type { Props, TableSchema, TableOption, TableItem } from './data.d';
import { getProTableSchema, getFormilySchema, getSuggest } from '@/services/ant-design-pro/api';
import { getList, exportList, getItem, updateItem, addItem, removeItem, restItem } from './service';
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
    action: '',
    title: '',
    target: '',
    request: {},
    body: {},
  });
  const [formSchema, setFormSchema] = useState([{}]);
  const [formilyJson, setFormilyJson] = useState({});
  const [formilyValues, setFormilyValues] = useState<TableItem>();
  const [tableQuery, setTableQuery] = useState<TableItem>();

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showModalForm, setShowModalForm] = useState<boolean>(false);
  const [showModalTable, setShowModalTable] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableItem>();
  const listParams = useRef<TableItem>();

  const handleList = async (params: any, sorter: any, filter: any) => {
    listParams.current = { ...params, ...props.query, sorter, filter };
    return getList(props.table, { ...params, ...props.query, sorter, filter });
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
            setFormilyValues({ ...props.query, ...res, ...option.body });
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
            setFormilyValues({ ...props.query, ...res, ...option.body });
            setShowModalForm(true);
            setTableOption(option);
          });
        };
        break;
      case 'table':
        _handle = async () => {
          console.log('-------');
          console.log(props, { ...props.query, id: record[schema.rowKey] });
          setTableQuery({ ...props.query, [option.body.query ?? 'id']: record[schema.rowKey] });
          setTableOption(option);
          setShowModalTable(true);
        };
        break;
      case 'page':
        _handle = () => {
          history.push(
            Mustache.render(option.target, { ...props.query, ...record, ...option.body }),
          );
        };
        break;
      case 'request':
        _handle = async () => {
          await restItem(option.request.method, option.request.url, record[schema.rowKey], {
            ...props.query,
            ...option.body,
          });
          actionRef.current?.reloadAndRest?.();
        };
        break;
    }

    return ['delete', 'request'].includes(option.type) ? (
      <Popconfirm key={option.title} title={`确定${option.title}吗?`} onConfirm={_handle}>
        <a key={option.title}>{option.title}</a>
      </Popconfirm>
    ) : (
      <a key={option.title} onClick={_handle}>
        {option.title}
      </a>
    );
  };

  const renderToolbarOptions = (option: any) => {
    let _handle = () => {};
    let _icon = <></>;
    switch (option.type) {
      case 'add':
        _handle = () => {
          setFormilyValues({ ...props.query, ...option.body });
          setShowUpdateForm(true);
        };
        _icon = <PlusOutlined />;
        break;
      case 'export':
        _handle = () => {
          exportList(props.table, listParams.current).then((res) => {
            window.open(window.URL.createObjectURL(res));
          });
        };
        _icon = <ExportOutlined />;
        break;
      case 'modal':
        _handle = () => {
          setFormilyValues({ ids: '0', ...props.query, ...option.body });
          setShowModalForm(true);
          setTableOption(option);
        };
        break;
      case 'page':
        _handle = () => {
          history.push(Mustache.render(option.target, { ...props.query, ...option.body }));
        };
        break;
      case 'request':
        _handle = async () => {
          await restItem(option.request.method, option.request.url, '0', {
            ...props.query,
            ...option.body,
          });
          actionRef.current?.reloadAndRest?.();
        };
        break;
    }
    return ['request'].includes(option.type) ? (
      <Popconfirm key={option.title} title={`确定${option.title}吗?`} onConfirm={_handle}>
        <Button key={option.title}>
          {_icon} {option.title}
        </Button>
      </Popconfirm>
    ) : (
      <Button type="primary" key={option.title} onClick={_handle}>
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
          await restItem(option.request.method, option.request.url, selectedRowKeys.join(','), {
            ...props.query,
            ...option.body,
          });
          actionRef.current?.reloadAndRest?.();
        };
        break;
    }
    return selectedRowKeys.length ? (
      ['bdelete', 'request'].includes(option.type) ? (
        <Popconfirm key={option.title} title={`确定${option.title}吗?`} onConfirm={_handle}>
          <Button key={option.title}>{option.title}</Button>
        </Popconfirm>
      ) : (
        <Button key={option.title} onClick={_handle}>
          {option.title}
        </Button>
      )
    ) : (
      <Button key={option.title} disabled>
        {option.title}
      </Button>
    );
  };

  useEffect(() => {
    getProTableSchema(props.table).then((res) => {
      if (props?.visibleColumns) {
        res.columns = res.columns.filter((column: any) => {
          return props.visibleColumns?.includes(column.dataIndex?.toString());
        });
      }
      if (props?.hiddenColumns) {
        res.columns = res.columns.filter((column: any) => {
          return !props.hiddenColumns?.includes(column.dataIndex?.toString());
        });
      }
      if (props?.appendColumns) {
        res.columns.push(...props.appendColumns);
      }
      res.columns.forEach((column: any) => {
        if (column?.sorter) {
          column.key = props.table + '-' + column.dataIndex?.toString();
        }
        if (props?.visibleSearch) {
          if (props.visibleSearch?.includes(column.dataIndex?.toString())) {
            column.hideInSearch = false;
          } else {
            column.hideInSearch = true;
          }
        }
        if (props?.hiddenSearch) {
          if (props.hiddenSearch?.includes(column.dataIndex?.toString())) {
            column.hideInSearch = true;
          }
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
      const forms = [];
      if (res.options.columns?.length) {
        if (props?.visibleColumnsOptions) {
          res.options.columns = res.options.columns.filter((option: any) => {
            return props.visibleColumnsOptions?.includes(option.action);
          });
        }
        if (props?.appendColumnsOptions) {
          res.options.columns.push(...props.appendColumnsOptions);
        }
        if (res.options.columns.length > 0) {
          forms.push(...res.options.columns);
          res.columns.push({
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            fixed: 'right',
            render: (_: any, record: any) => (
              <Space>
                {res.options.columns.map((option: any) =>
                  props?.renderColumnsOptions?.[option.action]
                    ? props?.renderColumnsOptions?.[option.action](option, record)
                    : renderColumnsOptions(option, record),
                )}
              </Space>
            ),
          });
        }
      }
      if (res.options.toolbar?.length) {
        if (props?.visibleToolbarOptions) {
          res.options.toolbar = res.options.toolbar.filter((option: any) => {
            return props.visibleToolbarOptions?.includes(option.action);
          });
        }
        if (props?.appendToolbarOptions) {
          res.options.toolbar.push(...props.appendToolbarOptions);
        }
        if (res.options.toolbar.length > 0) {
          forms.push(...res.options.toolbar);
          res.toolBarRender = () =>
            res.options.toolbar.map((option: any) =>
              props?.renderToolbarOptions?.[option.action]
                ? props?.renderToolbarOptions?.[option.action](option)
                : renderToolbarOptions(option),
            );
        }
      }
      if (res.options.batch?.length) {
        if (props?.visibleBatchOptions) {
          res.options.batch = res.options.batch.filter((option: any) => {
            return props.visibleBatchOptions?.includes(option.action);
          });
        }
        if (props?.appendBatchOptions) {
          res.options.batch.push(...props.appendBatchOptions);
        }
        if (res.options.batch.length > 0) {
          forms.push(...res.options.batch);
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
      }
      setSchema(res);
      // 读取操作表单
      forms.forEach((option: any) => {
        if (option.type == 'modal') {
          getFormilySchema('form', option.target).then((sres) => {
            formSchema[option.target] = sres;
            setFormSchema(formSchema);
          });
        }
      });
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
            setFormilyValues({});
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
            setFormilyValues({});
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

      <ModalTable
        onCancel={() => {
          setShowModalTable(false);
        }}
        updateModalVisible={showModalTable}
        title={tableOption.title}
        table={tableOption.target}
        query={tableQuery}
        tableProps={tableOption.body}
      />

      <Drawer
        width={600}
        open={showDetail}
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
