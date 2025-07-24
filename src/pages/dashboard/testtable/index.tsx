import React, { useState } from 'react';
import { Table, Button, Space, Message } from '@arco-design/web-react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
// import arrayMove from 'array-move';

// 自定义 arrayMove
function arrayMove(array, from, to) {
  array = [...array];
  const startIndex = to < 0 ? array.length + to : to;
  if (startIndex >= 0 && startIndex < array.length) {
    const item = array.splice(from, 1)[0];
    array.splice(startIndex, 0, item);
  }
  return array;
}

// mock 数据
const initialData = [
  { id: 1, name: '张三', age: 28, job: '工程师', city: '北京', remark: 'A' },
  { id: 2, name: '李四', age: 32, job: '设计师', city: '上海', remark: 'B' },
  { id: 3, name: '王五', age: 25, job: '产品经理', city: '广州', remark: 'C' },
  { id: 4, name: '赵六', age: 30, job: '测试', city: '深圳', remark: 'D' },
  { id: 5, name: '钱七', age: 27, job: '运营', city: '杭州', remark: 'E' },
];

export default function TestTable() {
  const [data, setData] = useState(initialData);

  function handleDelete(id) {
    setData(data.filter((item) => item.id !== id));
    Message.success('删除成功');
  }

  function onSortEnd({ oldIndex, newIndex }) {
    if (oldIndex !== newIndex) {
      const newData = arrayMove([...data], oldIndex, newIndex);
      setData(newData);
    }
  }

  const columns = [
    { title: '姓名', dataIndex: 'name' },
    { title: '年龄', dataIndex: 'age' },
    { title: '职位', dataIndex: 'job' },
    { title: '城市', dataIndex: 'city' },
    { title: '备注', dataIndex: 'remark' },
    {
      title: '操作',
      dataIndex: 'operations',
      render: (_, record) => (
        <Space>
          <Button
            size="mini"
            onClick={() => Message.info(`查看：${record.name}`)}
          >
            查看
          </Button>
          <Button
            size="mini"
            status="danger"
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const SortableWrapper = SortableContainer((props) => <tbody {...props} />);
  const SortableItem = SortableElement((props) => (
    <tr style={{ cursor: 'move' }} {...props} />
  ));

  const DraggableContainer = (props) => (
    <SortableWrapper
      onSortEnd={onSortEnd}
      helperContainer={() =>
        document.querySelector('.arco-drag-table-container table tbody')
      }
      updateBeforeSortStart={({ node }) => {
        const tds = node.querySelectorAll('td');
        tds.forEach((td) => {
          td.style.width = td.clientWidth + 'px';
        });
      }}
      useDragHandle={false}
      {...props}
    />
  );

  const DraggableRow = (props) => {
    const { record, index, ...rest } = props;
    return <SortableItem index={index} {...rest} />;
  };

  const components = {
    body: {
      tbody: DraggableContainer,
      row: DraggableRow,
    },
  };

  return (
    <div style={{ padding: 24 }}>
      <Table
        className="arco-drag-table-container"
        rowKey="id"
        columns={columns}
        data={data}
        pagination={false}
        components={components}
      />
    </div>
  );
}
