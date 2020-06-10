import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Typography, Layout, Row, Col, Menu, Divider } from 'antd';
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

const { Header, Content } = Layout;
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
			<Layout>
				<Header style={{ backgroundColor: '#1A467E' }}>
					<Row justify='end' align='middle'>
						<Col span={16}>
							<Link to='/'>
								<Title level={2} style={{ color: '#FFFFFF' }}>
									SWAP DEX - OAX Parachain
								</Title>
							</Link>
						</Col>
						<Col span={8}>
							<Menu mode='horizontal' theme='dark'>
								<Menu.Item key='create' icon={<FormOutlined />}>
									<Link to='/createSwap'>Create Swap</Link>
								</Menu.Item>
								<Menu.Item key='view' icon={<OrderedListOutlined />}>
									<Link to='/viewSwaps'>View Swaps</Link>
								</Menu.Item>
							</Menu>
						</Col>
					</Row>
				</Header>
				<Divider />
				<Content>
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
				</Content>
			</Layout>
		</BrowserRouter>
	);
};

export default App;
