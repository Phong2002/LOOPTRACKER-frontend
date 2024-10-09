import {Outlet} from "react-router-dom";
import {Button, Menu} from "antd";
import {
    ContainerOutlined,
    HomeFilled,
    MailOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import {useState} from "react";


function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };


    const items = [
        {
            key: 'home',
            icon: <HomeFilled />,
            label: 'Trang chủ',
        },
        {
            key: 'passenger',
            icon: <ContainerOutlined />,
            label: 'Quản lý hành khách',
        },
        {
            key: 'tour_package',
            label: 'Gói tour',
            icon: <MailOutlined />,
        },
        {
            key: 'tour_instance',
            label: 'Tổ chức chuyến đi',
            icon: <MailOutlined />,
        },
        {
            key: 'item',
            label: 'Vật phẩm',
            icon: <MailOutlined />,
        },
        {
            key: 'user_management',
            label: 'Quản lý nhân sự',
            icon: <MailOutlined />,
        },
    ];

    return(
        <div className="h-[100vh] w-[100vw] flex flex-row">
            <div>
                <div
                    style={{
                        width: 256,
                    }}
                >
                    <Button
                        type="primary"
                        onClick={toggleCollapsed}
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                    </Button>
                    <Menu
                        className="h-[100vh]"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        inlineCollapsed={collapsed}
                        items={items}

                    />
                </div>
            </div>
            <div>
                <Outlet/>
            </div>
        </div>
    )

}

export default MainLayout;