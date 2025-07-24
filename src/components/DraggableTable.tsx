import React, { useState, useRef } from 'react';
import { Table, Button, Message, Modal } from '@arco-design/web-react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';

interface TableRow {
  key: string;
  id: number;
  name: string;
  email: string;
  department: string;
  status: string;
  joinDate: string;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const mockData: TableRow[] = [
  {
    key: '1',
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    department: '技术部',
    status: '在职',
    joinDate: '2023-01-15'
  },
  {
    key: '2',
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    department: '产品部',
    status: '在职',
    joinDate: '2023-02-20'
  },
  {
    key: '3',
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    department: '设计部',
    status: '在职',
    joinDate: '2023-03-10'
  },
  {
    key: '4',
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    department: '运营部',
    status: '离职',
    joinDate: '2022-12-05'
  },
  {
    key: '5',
    id: 5,
    name: '孙七',
    email: 'sunqi@example.com',
    department: '技术部',
    status: '在职',
    joinDate: '2023-04-01'
  }
];

const DraggableRow: React.FC<{
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
  [key: string]: any;
}> = ({ index, moveRow, children, ...restProps }) => {
  const ref = useRef<HTMLTableRowElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'row',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'row',
    item: () => {
      return { id: restProps['data-row-key'], index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <tr ref={ref} {...restProps} style={{ ...restProps.style, opacity, cursor: 'move' }} data-handler-id={handlerId}>
      {children}
    </tr>
  );
};

const DraggableTable: React.FC = () => {
  const [data, setData] = useState<TableRow[]>(mockData);

  const moveRow = (dragIndex: number, hoverIndex: number) => {
    const dragRow = data[dragIndex];
    const newData = [...data];
    newData.splice(dragIndex, 1);
    newData.splice(hoverIndex, 0, dragRow);
    setData(newData);
  };

  const handleView = (record: TableRow) => {
    Modal.info({
      title: '用户详情',
      content: (
        <div>
          <p><strong>姓名:</strong> {record.name}</p>
          <p><strong>邮箱:</strong> {record.email}</p>
          <p><strong>部门:</strong> {record.department}</p>
          <p><strong>状态:</strong> {record.status}</p>
          <p><strong>入职日期:</strong> {record.joinDate}</p>
        </div>
      ),
    });
  };

  const handleDelete = (record: TableRow) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 ${record.name} 吗？`,
      onOk: () => {
        const newData = data.filter(item => item.id !== record.id);
        setData(newData);
        Message.success('删除成功');
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ 
          color: status === '在职' ? '#00b42a' : '#f53f3f',
          fontWeight: 'bold'
        }}>
          {status}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TableRow) => (
        <div>
          <Button
            type="text"
            size="small"
            onClick={() => handleView(record)}
            style={{ marginRight: 8 }}
          >
            查看
          </Button>
          <Button
            type="text"
            status="danger"
            size="small"
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  const components = {
    body: {
      row: DraggableRow,
    },
  };

  return (
    <div>
      <h2 style={{ marginBottom: '16px' }}>用户列表 (支持拖拽排序)</h2>
      <Table
        columns={columns}
        dataSource={data}
        components={components}
        onRow={(record, index) => ({
          index,
          moveRow,
        })}
        pagination={{
          pageSize: 10,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
        }}
      />
    </div>
  );
};

export default DraggableTable;