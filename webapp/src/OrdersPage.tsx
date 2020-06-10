import React from 'react';
import { Row, Col } from 'antd';
import './App.css';
import OrderBook from './components/OrderBook';
import MarketSelector from './components/MarketSelector';
import { StateProvider } from './AppContext';
import OrderDetail from './components/OrderDetail';

interface Props {
	selectedMarket: string;
}

// This component has a selectedMarket property presets the currently
// selected market
const OrdersPage: React.FC<Props> = ({ selectedMarket }) => {
	return (
		<StateProvider>
			<Row>
				<Col span={6}></Col>
				<Col span={12}>
					<MarketSelector selectedMarket={selectedMarket} />
				</Col>
				<Col span={6}></Col>
			</Row>
			<Row gutter={[24, 24]}>
				<Col span={16}>
					<OrderBook />
				</Col>
				<Col span={8}>
					<OrderDetail></OrderDetail>
				</Col>
			</Row>
		</StateProvider>
	);
};

export default OrdersPage;
