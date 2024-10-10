import {Outlet, useNavigate} from "react-router-dom";
import { Layout, Menu} from "antd";
import {
    ContainerOutlined,
    HomeFilled,
    MailOutlined,
} from "@ant-design/icons";
import {useState} from "react";
import Sider from "antd/es/layout/Sider.js";
import {Content} from "antd/es/layout/layout.js";
function MainLayout() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const items = [
        {
            key: '/',
            icon: <HomeFilled />,
            label: 'Trang chủ',
        },
        {
            key: 'passenger',
            icon: <ContainerOutlined />,
            label: 'Quản lý hành khách',
        },
        {
            key: 'tour-package',
            label: 'Gói tour',
            icon: <MailOutlined />,
        },
        {
            key: 'tour-instance',
            label: 'Tổ chức chuyến đi',
            icon: <MailOutlined />,
        },
        {
            key: 'item',
            label: 'Vật phẩm',
            icon: <MailOutlined />,
        },
        {
            key: 'user-management',
            label: 'Quản lý nhân sự',
            icon: <MailOutlined />,
        },
    ];

    const onChange = (e)=>{
        navigate(e.key)
    }


    return(
        <div className="h-[100vh] w-[100vw] flex flex-row">
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo" >

                    </div>
                    <Menu
                        className="h-[100vh]"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        inlineCollapsed={collapsed}
                        items={items}
                        onSelect={onChange}
                    />
                </Sider>
                <Layout>
                    <Content style={{ margin: '0 16px' }}>
                        <div>
                            <Outlet/>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
}

export default MainLayout;