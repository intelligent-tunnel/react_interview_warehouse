import React, { useState } from 'react';
import { Layout, Menu, Button, Table, Modal, Message } from '@arco-design/web-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IconApps, IconUser, IconSettings, IconDesktop } from '@arco-design/web-react/icon';
import DraggableTable from './components/DraggableTable';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');

  const menuItems = [
    {
      key: '1',
      icon: <IconApps />,
      title: '工作台',
      children: [
        { key: '1-1', title: '概览' },
        { key: '1-2', title: '数据管理' },
      ]
    },
    {
      key: '2',
      icon: <IconUser />,
      title: '用户管理',
      children: [
        { key: '2-1', title: '用户列表' },
        { key: '2-2', title: '权限管理' },
      ]
    },
    {
      key: '3',
      icon: <IconSettings />,
      title: '系统设置',
      children: [
        { key: '3-1', title: '基本设置' },
        { key: '3-2', title: '高级设置' },
      ]
    }
  ];

  const renderContent = () => {
    if (selectedMenuItem === '2-1') {
      return (
        <DndProvider backend={HTML5Backend}>
          <DraggableTable />
        </DndProvider>
      );
    }
    return (
      <div style={{ padding: '20px' }}>
        <h2>欢迎使用 Arco Design Pro</h2>
        <p>这是一个基于 Arco Design 的中后台管理界面</p>
      </div>
    );
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        collapsible
        trigger={null}
        breakpoint="lg"
        style={{
          background: 'var(--color-bg-2)',
        }}
      >
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <IconDesktop style={{ fontSize: '32px', color: 'var(--color-primary-6)' }} />
          {!collapsed && <div style={{ marginTop: '8px', fontWeight: 'bold' }}>Admin Pro</div>}
        </div>
        <Menu
          style={{ width: '100%' }}
          selectedKeys={[selectedMenuItem]}
          onClickMenuItem={setSelectedMenuItem}
        >
          {menuItems.map(item => (
            <SubMenu key={item.key} title={item.title} icon={item.icon}>
              {item.children.map(child => (
                <Menu.Item key={child.key}>{child.title}</Menu.Item>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ 
          background: 'var(--color-bg-2)', 
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Button
            type="text"
            icon={collapsed ? <IconApps /> : <IconApps />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div>Admin Dashboard</div>
        </Header>
        <Content style={{ 
          padding: '16px',
          background: 'var(--color-bg-1)',
          overflow: 'auto'
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;