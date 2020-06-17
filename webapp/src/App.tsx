import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Typography, Layout, Row, Col, Menu, Divider } from 'antd';
import { FormOutlined, OrderedListOutlined } from '@ant-design/icons';
import { ApiPromise, WsProvider } from '@polkadot/api';

import 'antd/dist/antd.css';
import OrdersPage from './OrdersPage';
import MyOrdersPage from './MyOrdersPage';
import CreateSwap from './components/CreateSwap';
import { StateProvider } from './AppContext';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
	const injectPolkadot = async () => {
		const ws = new WsProvider('ws://localhost:9944');
		// Instantiate the API
		const api = await ApiPromise.create({
			types: {
				Address: 'AccountId',
				TokenBalance: 'u128',
				TokenId: 'u128',
				Public: 'AccountId',
				Signature: 'MultiSignature',
				Offer: {
					offer_token: 'TokenId',
					offer_amount: 'TokenBalance',
					requested_token: 'TokenId',
					requested_amount: 'TokenBalance',
					nonce: 'u128',
				},
				SignedOffer: {
					offer: 'Offer',
					signature: 'MultiSignature',
					signer: 'AccountId',
				},
				TransferDetails: {
					amount: 'Balance',
					to: 'AccountId',
				},
				TokenTransferDetails: {
					amount: 'TokenBalance',
					to: 'AccountId',
				},
				TransferStatus: {
					amount: 'TokenBalance',
					to: 'AccountId',
					status: 'bool',
				},
				DelegatedTransferDetails: {
					amount: 'Balance',
					to: 'AccountId',
					nonce: 'u128',
				},
				SignedDelegatedTransferDetails: {
					transfer: 'DelegatedTransferDetails',
					signature: 'MultiSignature',
					signer: 'AccountId',
				},
			},
			provider: ws,
		});
		const [chain, nodeName, nodeVersion] = await Promise.all([
			api.rpc.system.chain(),
			api.rpc.system.name(),
			api.rpc.system.version(),
		]);
		console.log(
			`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`
		);
	};

	useEffect(() => {
		injectPolkadot();
	});

	return (
		<StateProvider>
			<BrowserRouter>
				<Layout>
					<Header style={{ backgroundColor: '#1A467E' }}>
						<Row justify='end' align='middle'>
							<Col span={12}>
								<Link to='/'>
									<Title level={2} style={{ color: '#FFFFFF' }}>
										SWAP DEX - OAX Parachain
									</Title>
								</Link>
							</Col>
							<Col span={12}>
								<Menu mode='horizontal' theme='dark'>
									<Menu.Item key='create' icon={<FormOutlined />}>
										<Link to='/createSwap'>Create Swap</Link>
									</Menu.Item>
									<Menu.Item key='view' icon={<OrderedListOutlined />}>
										<Link to='/viewSwaps'>View Swaps</Link>
									</Menu.Item>
									<Menu.Item key='myswaps' icon={<OrderedListOutlined />}>
										<Link to='/mySwaps'>My Swaps</Link>
									</Menu.Item>
								</Menu>
							</Col>
						</Row>
					</Header>
					<Divider />
					<Content>
						<Switch>
							<Route path='/mySwaps'>
								<MyOrdersPage />
							</Route>
							<Route path='/viewSwaps'>
								<OrdersPage />
							</Route>
							<Route path='/createSwap'>
								<CreateSwap />
							</Route>
							<Route path='/'>
								<OrdersPage />
							</Route>
						</Switch>
					</Content>
				</Layout>
			</BrowserRouter>
		</StateProvider>
	);
};

export default App;
