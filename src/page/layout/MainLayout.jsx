import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {Badge, ConfigProvider, Layout, Menu} from "antd";
import {
    HomeFilled,
    ContainerOutlined,
    ShoppingOutlined,
    UserOutlined,
    SettingOutlined,
    TeamOutlined,
    CompassOutlined,
    ToolOutlined,
    HeatMapOutlined
} from "@ant-design/icons";
import {useState} from "react";
import Sider from "antd/es/layout/Sider.js";
import {Content} from "antd/es/layout/layout.js";
import "../../index.css"
import vi_VN from 'antd/locale/vi_VN'
import {IconMap} from "antd/es/result/index.js";

function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [requestNumber, setRequestNumber] = useState(0);

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
            icon: <CompassOutlined />,
            label: 'Gói tour',
        },
        {
            key: 'tour-instance',
            icon: <SettingOutlined />,
            label: 'Tổ chức chuyến đi',
        },
        {
            key: 'item',
            icon: <ToolOutlined />,
            label: 'Đồ trang bị',
        },
        {
            key: 'user-management',
            icon: <TeamOutlined />,
            label: 'Quản lý nhân sự',
            children: [
                {
                    key: 'registration-request-management',
                    label: 'Yêu cầu tạo tài khoản'
                    //     (
                    //     <div className="">
                    //         <Badge count={10} overflowCount={9} offset={[15, -2]}>
                    //             <div className="">Yêu cầu tạo tài khoản</div>
                    //         </Badge>
                    //     </div>
                    // )
                },
                {
                    key: 'account-management',
                    label: 'Quản lý tài khoản'
                },
            ],
        },
        {
            key: 'track-travel',
            icon: <HeatMapOutlined />,
            label: 'Theo dõi chuyến đi',
        },
    ];

    const onChange = (e) => {
        navigate(e.key);
    };

    return (
        <ConfigProvider
            locale={vi_VN}
            theme={{
                token: {
                    colorPrimary: '#4CAF50', // Màu chủ đạo - xanh lá tươi sáng
                },
                components: {
                    Menu: {
                        colorText: '#1B5E20', // Màu chữ - xanh lá đậm
                        colorBgContainer: '#E8F5E9', // Nền menu - xanh lá nhạt
                        controlItemBgHover: '#A5D6A7', // Nền khi hover - xanh lá sáng hơn
                        horizontalItemSelectedBg: '#66BB6A', // Nền item được chọn ngang - xanh lá tươi sáng
                        itemSelectedBg: '#4CAF50', // Nền item khi được chọn - xanh lá tươi sáng
                        itemSelectedColor: '#FFFFFF', // Màu chữ khi được chọn - trắng
                        subMenuBg: '#E8F5E9', // Nền của SubMenu - xanh lá nhạt
                        subMenuItemHoverBg: '#A5D6A7', // Nền của item trong SubMenu khi hover - xanh lá sáng hơn
                        itemHoverColor: '#1B5E20', // Màu chữ khi hover - xanh lá đậm
                        subMenuSelectedItemBg: '#66BB6A', // Nền khi sub-item được chọn - xanh lá tươi sáng
                    },
                },
            }}
        >


            <div className="h-[100vh] w-[100vw] flex flex-row custom-scrollbar">
                <Layout style={{minHeight: '100vh'}}>
                    <Sider collapsible collapsed={collapsed} width={235} onCollapse={(value) => setCollapsed(value)}>
                        <div className="logo">
                        </div>
                        <Menu
                            className="h-[100vh] select-none"
                            mode="inline"
                            inlineCollapsed={collapsed}
                            items={items}
                            onSelect={onChange}
                        />
                    </Sider>
                    <Layout>
                        <Content style={{margin: '0 16px'}} className="overflow-y-scroll" >
                            <div  >
                                <Outlet  />
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        </ConfigProvider>
    );
}

export default MainLayout;
