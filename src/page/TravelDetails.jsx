import React, { useEffect, useState } from 'react';
import { Tabs, Layout, Typography, Breadcrumb, Card } from 'antd';
import apiService from '../service/ApiService';
import ListPassengers from './ListPassenger';
import ItineraryDetails from './ItineraryDetails';
import EvidencePage from './EvidencePage';

const { TabPane } = Tabs;
const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const TravelDetails = ({tourInstanceId}) => {
  const [tourPackage,setTourPackage] = useState()
  const [tourDetails,setTourDetails] = useState()

    const getTourDetails = async () => {
        const param = { tourInstanceId: tourInstanceId };
        const data = await apiService.get("/tour-instance/details",param);
        console.log("=================================getTourPackage     ",data);
        setTourPackage(data?.tourPackage)
        setTourDetails(data)
        // setWaypoints(data.tourPackage?.detailedItineraries?.[0]?.wayPoints || [])
        // console.log("====================1 ",data?.tourPackage?.detailedItinerarys?.[0]?.wayPoints || []);
        console.log("====================1 ",data??[]);
    };

    useEffect(() => {
        getTourDetails();
        
    }, []);

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
   
            {/* Breadcrumb */}
            <Content style={{ padding: '0 50px' }}>

                {/* Main Content */}
                <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="Chi tiết lịch trình" key="1">
                        <ItineraryDetails detailedItineraries = {tourDetails?.tourPackage?.detailedItineraries??[]}/>
                        </TabPane>
                        <TabPane tab="Danh sách hành khách" key="2">
                           <ListPassengers tourAssignments = {tourDetails?.tourAssignments??[]}/>
                        </TabPane>
                        <TabPane tab="Danh sách sự cố" key="3">
                        <EvidencePage tourInstanceId={tourInstanceId}/>
                        </TabPane>
                    </Tabs>
                </Card>
            </Content>

            {/* Footer */}
  
        </Layout>
    );
};

export default TravelDetails;
