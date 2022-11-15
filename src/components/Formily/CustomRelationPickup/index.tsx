import { Modal, Switch, Select, Button } from 'antd';
import { PlusCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { connect, mapProps } from '@formily/react';
import ListTable from '@/components/crud/ListTable';
import { getEnum } from '@/services/ant-design-pro/api';
import omit from 'rc-util/lib/omit';
import get from 'rc-util/lib/utils/get';
import { useState, useEffect } from 'react';

const CustomRelationPickup = connect(
  (props: any) => {
    const {
      mode,
      table,
      title,
      query = {},
      modalWidth = 800,
      labelCol = 'id',
      valueCol = 'id',
    } = props;

    const [open, setOpen] = useState<boolean>(false);
    const [options, setOptions] = useState(props.options);

    const getLabel = (entity: any, dataIndex: any) => {
      return Array.isArray(dataIndex) ? get(entity, dataIndex) : entity[dataIndex];
    };

    const handleChange = (checked: boolean, record: Record<string, any>) => {
      if (mode == 'multiple') {
        if (checked) {
          if (!props.value.includes(record[valueCol])) {
            setOptions([
              ...options,
              {
                label: getLabel(record, labelCol),
                value: record[valueCol],
              },
            ]);
            props.value.push(record[valueCol]);
          }
        } else {
          if (props.value.includes(record[valueCol])) {
            props.value.splice(props.value.indexOf(record[valueCol]), 1);
          }
        }
        props.onChange([...props.value]);
      } else {
        setOptions([
          {
            label: getLabel(record, labelCol),
            value: record[valueCol],
          },
        ]);
        props.onChange(record[valueCol]);
        setOpen(false);
      }
    };

    const selectProps = omit(
      props,
      mode === 'multiple'
        ? ['table', 'query', 'labelCol', 'valueCol']
        : ['table', 'query', 'labelCol', 'valueCol', 'mode'],
    );

    const listTableProps = omit(props, [
      'table',
      'query',
      'labelCol',
      'valueCol',
      'mode',
      'allowClear',
      'proTableProps',
    ]);

    useEffect(() => {
      if (mode === 'multiple') {
        if (props.value && props.value.length > 0) {
          getEnum(table, props.value.toString(), valueCol, labelCol).then((res) => {
            setOptions(res.data);
          });
        }
      } else {
        if (props.value) {
          getEnum(table, props.value, valueCol, labelCol).then((res) => {
            setOptions(res.data);
          });
        }
      }
    }, []);

    return (
      <div>
        <Select
          {...selectProps}
          options={options}
          style={{ width: '80%' }}
          open={false}
          onDeselect={(deselect: any) => {
            if (mode === 'multiple') {
              if (props.value.includes(deselect)) {
                props.value.splice(props.value.indexOf(deselect), 1);
              }
            } else {
              props.onChange(undefined);
            }
          }}
        />
        <Button
          type="primary"
          style={{ width: '20%' }}
          icon={<PlusCircleOutlined />}
          onClick={() => setOpen(true)}
        >
          选取
        </Button>

        {open && (
          <Modal
            title={title}
            open={open}
            onCancel={() => setOpen(false)}
            width={modalWidth}
            footer={null}
          >
            <ListTable
              {...listTableProps}
              table={table}
              query={query}
              proTableProps={{
                options: false,
                ...props?.proTableProps,
              }}
              visibleBatchOptions={[]}
              visibleToolbarOptions={[]}
              visibleColumnsOptions={[]}
              appendColumnsOptions={[
                {
                  action: 'pickup',
                  title: '选择',
                },
              ]}
              renderColumnsOptions={{
                pickup: (option: any, record: any) => {
                  return mode === 'multiple' ? (
                    <Switch
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                      defaultChecked={props.value ? props.value.includes(record[valueCol]) : false}
                      onChange={(checked: boolean) => handleChange(checked, record)}
                    />
                  ) : (
                    <Button icon={<CheckOutlined />} onClick={() => handleChange(true, record)}>
                      {option.title}
                    </Button>
                  );
                },
              }}
            />
          </Modal>
        )}
      </div>
    );
  },
  mapProps(
    {
      title: 'title',
      dataSource: 'options',
    },
    (props) => {
      return {
        ...props,
      };
    },
  ),
);

export default CustomRelationPickup;
