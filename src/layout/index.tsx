import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import react from "../assets/react.svg";
import "./index.css";
import MenuTabs from '../components/menuTabs';
import { useStore } from '../store'
import { Outlet, useNavigate } from 'react-router-dom'

const { Header, Content, Footer, Sider } = Layout;
  
const items: MenuProps['items'] = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const IndexLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { commonStore } = useStore()
  commonStore.appState.menuTree

  const navigate = useNavigate()

  navigate('/login')

    
  return (
    <Layout hasSider className='h-full'>
      <Sider
        trigger={null} collapsible collapsed={collapsed}
        style={{
          overflow: 'hidden auto',
          // height: '100vh',
          // position: 'fixed',
          // left: 0,
          // top: 0,
          // bottom: 0,
        }}
      >
        <div className='admin-flag h-20 overflow-hidden bg-slate-900'>
          <div className='wrap pt-5 pl-2.5 text-white' style={{ width: 180 }}>
            <img className='logo mx-2.5 py-1 w-10' style={{ float: 'left' }} src={react} />
            <div
              className='title text-base font-bold'
              style={{ display: collapsed ? 'none' : 'block' }}
            >
                            大气管理系统
            </div>
            <span
              className="ver inline-block text-xs"
              style={{ display: collapsed ? 'none' : 'inline-block' }}
            >
                            V1.0.0
            </span>
          </div>
        </div>  
        <div className='pt-4'>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
        </div>
      </Sider>
      <Layout
        className="site-layout flex-auto"
      >
        <Header className="site-layout-background" style={{ padding: 0, height: 87 }}>
          <div className='flex place-content-between h-12'>
            <div className='left-side flex items-center'>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger text-xl px-5',
                onClick: () => setCollapsed(!collapsed),
              })}
              <a href="https://www.baidu.com" target='_blank' rel="noreferrer">
                <QuestionCircleOutlined className='mr-1'/>
                                帮助指南
              </a>
            </div>
            <div className='right-side mx-5 cursor-pointer'>
                            退出登录
            </div>
          </div>
          {/* <MenuTabs></MenuTabs> */}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '16px 16px 0',
            overflow: 'initial',
            // minHeight: 280,
          }}
        >
          <Outlet></Outlet>
          {/* <div
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            textAlign: 'center',
                        }}
                    >
                        <p>long content</p>
                        {
                            // indicates very long content
                            Array.from(
                                {
                                    length: 100,
                                },
                                (_, index) => (
                                    <React.Fragment key={index}>
                                        {index % 20 === 0 && index ? 'more' : '...'}
                                        <br />
                                    </React.Fragment>
                                ),
                            )
                        }
                    </div> */}
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
                    Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default IndexLayout;
