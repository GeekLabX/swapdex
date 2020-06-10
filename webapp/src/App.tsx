import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Typography, Layout, Row, Col, Menu } from 'antd';
import { FormOutlined, OrderedListOutlined } from '@ant-design/icons';
import {
	web3Accounts,
	web3Enable,
	web3FromAddress,
	web3ListRpcProviders,
	web3UseRpcProvider,
} from '@polkadot/extension-dapp';

//import './App.css';
import 'antd/dist/antd.css';
import OrdersPage from './OrdersPage';
import CreateSwap from './components/CreateSwap';

const { Footer } = Layout;
const { Title } = Typography;

const App = () => {
	const injectPolkadot = async () => {
		const allInjected = await web3Enable('OAX swap DEX');
		console.log('all injected: ', allInjected);
		const allAccounts = await web3Accounts();
		console.log('web3 accounts: ', allAccounts);
	};

	useEffect(() => {
		injectPolkadot();
	});

	return (
		<BrowserRouter>
			<Row>
				<Col span={8} />
				<Col span={8}>
					<Link to='/'>
						<Title level={2}>SWAP DEX - OAX Parachain</Title>
					</Link>
				</Col>
				<Col span={8} />
			</Row>
			<Row>
				<Col span={8} />
				<Col span={8}>
					<Menu mode='horizontal'>
						<Menu.Item key='create' icon={<FormOutlined />}>
							<Link to='/createSwap'>Create Swap</Link>
						</Menu.Item>
						<Menu.Item key='view' icon={<OrderedListOutlined />}>
							<Link to='/viewSwaps'>View Swaps</Link>
						</Menu.Item>
					</Menu>
				</Col>
				<Col span={8} />
			</Row>
			<Switch>
				<Route path='/viewSwaps'>
					<OrdersPage selectedMarket='OAX/ETH' />
				</Route>
				<Route path='/createSwap'>
					<CreateSwap />
				</Route>
				<Route path='/'>
					<OrdersPage selectedMarket='OAX/ETH' />
				</Route>
			</Switch>
			<Footer></Footer>
		</BrowserRouter>
	);
};

export default App;
