import React, { useEffect, useContext, useState } from 'react';
import { Table, Typography, Layout, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import fetch from 'node-fetch';
import {
	AppContext,
	Types,
	IOrderBookOffer,
	IOrderBookResponse,
} from '../AppContext';
import util from '../util';
import { REST_URL } from '../constants';
import '../App.css';

const { Text } = Typography;
const { Content } = Layout;

interface Props {
	// set to false to only see my orders
	allOrders: boolean;
}

const OrderBook: React.FC<Props> = ({ allOrders }) => {
	const { state, dispatch } = useContext(AppContext);
	let [ccy1, ccy2] = util.parseSymbol(state.symbol);
	//loading is used to display a spinner while we fetch data
	const [loading, setLoading] = useState(false);
	const [refreshTime, setRefreshTime] = useState('');
	const requestOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	};

	useEffect(() => {
		//setInterval at end of this useEffect fn waits 5s before fetching
		//by calling fetchData here, we can display fresh data immediately on each render
		//leaving the setInterval to do the regular refresh
		fetchData();
		// In order to call async functions within useEffect, we need to define
		// them within the scope of useEffect like this
		async function fetchData() {
			setLoading(true);
			// let t0 = performance.now();
			let url =
				REST_URL + '/depth/' + encodeURIComponent(state.symbol.toString());

			try {
				let data = await fetch(url, requestOptions);
				let json: IOrderBookResponse = await data.json();
				//console.log('fetchData.json : ', state.symbol.toString(), json);

				dispatch({
					type: Types.CURRENT_ORDERBOOK,
					payload: {
						symbol: state.symbol.toString(),
						bids: json.bids,
						asks: json.asks,
					},
				});
				setRefreshTime(new Date(Date.now()).toLocaleString());
			} catch (err) {
				console.log('fetch error: ', err);
			}
			// let t1 = performance.now();
			// console.log('fetchData took ' + (t1 - t0) + ' ms');
			setLoading(false);
		}

		// setInterval runs every 5s, to stop it use clearInterval
		const fetchFn = setInterval(() => fetchData(), 5000);
		return () => clearInterval(fetchFn);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.symbol]); // useEffect dependency array, only re-render when state.symbol changes

	const topColumns: ColumnsType<IOrderBookOffer> = [
		{
			title: `Quantity (${ccy1})`,
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'right',
		},
		{
			title: `Price (${ccy2})`,
			dataIndex: 'price',
			key: 'price',
			align: 'right',
		},
		{
			title: `Total (${ccy2})`,
			dataIndex: 'total',
			key: 'total',
			align: 'right',
		},
	];

	const bottomColumns: ColumnsType<IOrderBookOffer> = [
		{
			title: `Quantity (${ccy1})`,
			dataIndex: 'quantity',
			key: 'quantity',
			align: 'right',
		},
		{
			title: `Price (${ccy2})`,
			dataIndex: 'price',
			key: 'price',
			align: 'right',
		},
		{
			title: `Total (${ccy2})`,
			dataIndex: 'total',
			key: 'total',
			align: 'right',
		},
	];

	const onRowClick = (r: IOrderBookOffer) => {
		console.log('onRowClick orderId: ', r.orderId);
		dispatch({
			type: Types.SELECT_ORDER,
			payload: {
				orderId: r.orderId,
			},
		});
	};

	//TODO I turn off the pagination controls but we need to handle it somehow
	return (
		<div>
			<div>
				<Text mark>Last Update Time: {refreshTime}</Text>
			</div>
			<Content style={{ minHeight: '70vh' }}>
				<Spin spinning={loading}>
					<Table
						columns={bottomColumns}
						dataSource={state.asks}
						pagination={{ hideOnSinglePage: true }}
						size='small'
						onRow={(r) => ({
							onClick: () => onRowClick(r),
						})}
						id='oax-orderbook-asks'
					/>
					<Table
						columns={topColumns}
						dataSource={state.bids}
						pagination={{ hideOnSinglePage: true }}
						size='small'
						onRow={(r) => ({
							onClick: () => onRowClick(r),
						})}
						id='oax-orderbook-bids'
					/>
				</Spin>
			</Content>
		</div>
	);
};

export default OrderBook;
