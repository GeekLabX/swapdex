import React from 'react';
import { Row, Col } from 'antd';
import './App.css';
import OrderBook from './components/OrderBook';
import MarketSelector from './components/MarketSelector';
import OrderDetail from './components/OrderDetail';

const OrdersPage: React.FC = () => {
	return (
		<div>
			<Row>
				<Col span={6}></Col>
				<Col span={12}>
					<MarketSelector />
				</Col>
				<Col span={6}></Col>
			</Row>
			<Row gutter={[24, 24]}>
				<Col span={16}>
					<OrderBook allOrders={true} />
				</Col>
				<Col span={8}>
					<OrderDetail></OrderDetail>
				</Col>
			</Row>
		</div>
	);
};

export default OrdersPage;
