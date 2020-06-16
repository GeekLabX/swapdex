import React from 'react';
import { Row, Col } from 'antd';
import './App.css';
import OrderBook from './components/OrderBook';
import MarketSelector from './components/MarketSelector';
import { StateProvider } from './AppContext';
import OrderDetail from './components/OrderDetail';

const MyOrdersPage: React.FC = () => {
	return (
		<StateProvider>
			<Row>
				<Col span={6}></Col>
				<Col span={12}>
					<MarketSelector />
				</Col>
				<Col span={6}></Col>
			</Row>
			<Row gutter={[24, 24]}>
				<Col span={16}>
					<OrderBook allOrders={false} />
				</Col>
				<Col span={8}>Cancel pane </Col>
			</Row>
		</StateProvider>
	);
};

export default MyOrdersPage;
