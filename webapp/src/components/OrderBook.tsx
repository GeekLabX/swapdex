import React, { useEffect, useContext, useState } from 'react';
import { Table, Typography, Layout } from 'antd';
import { ColumnsType } from 'antd/es/table';
import fetch from 'node-fetch';
import {
	AppContext,
	Types,
	IOrderBookEntry,
	IOrderBook,
	ITableData,
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
	const { state } = useContext(AppContext);
	const { dispatch } = useContext(AppContext);
	let [ccy1, ccy2] = util.parseSymbol(state.symbol);
	let loading = false; //TODO not used, we might want to disable things while being refreshed
	const [refreshTime, setRefreshTime] = useState('');
	const requestOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	};

	useEffect(() => {
		// In order to call async functions within useEffect, we need to define
		// them within the scope of useEffect like this
		async function fetchData() {
			let url =
				REST_URL + '/depth/' + encodeURIComponent(state.symbol.toString());
			let data = await fetch(url, requestOptions);
			let json = await data.json();
			console.log('fetchData.rawJson : ', state.symbol.toString(), json);

			//TODO there is a bug where json comes back with bids undefined sometimes
			if (json.bids) {
				// extract/transform the raw response into a structure  we can use for UI
				let askOrders = getAsks(json);
				let bidOrders = getBids(json);

				dispatch({
					type: Types.CURRENT_ORDERBOOK,
					payload: {
						rawOrderBook: json,
						bids: bidOrders,
						asks: askOrders,
					},
				});
			} else console.log('ERROR fetchData had no bids');
			setRefreshTime(new Date(Date.now()).toLocaleString());
		}

		// setInterval runs every 5s, to stop it use clearInterval
		const fetchFn = setInterval(() => fetchData(), 5000);
		return () => clearInterval(fetchFn);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.symbol]); // useEffect dependency array, only re-render when state.symbol changes

	const getAsks = (rawJson: IOrderBook) => {
		// console.log('getAsks.rawJson: ', rawJson);
		let rows: ITableData[] = [];
		rawJson.asks.forEach((ask: IOrderBookEntry) => {
			let p = parseFloat(ask.price);
			let q = parseFloat(ask.quantity);
			let t = p * q;
			let a: ITableData = {
				key: ask.orderId,
				price: p.toFixed(8),
				amount: q.toFixed(8),
				total: t.toFixed(8),
			};
			rows.push(a);
		});

		return rows;
	};

	const getBids = (rawJson: IOrderBook) => {
		//console.log('getBids.rawJson: ', rawJson);
		let rows: ITableData[] = [];
		rawJson.bids.forEach((bid: IOrderBookEntry) => {
			let p = parseFloat(bid.price);
			let q = parseFloat(bid.quantity);
			let t = p * q;
			let a: ITableData = {
				key: bid.orderId,
				price: p.toFixed(8),
				amount: q.toFixed(8),
				total: t.toFixed(8),
			};
			rows.push(a);
		});

		return rows;
	};

	const topColumns: ColumnsType<ITableData> = [
		{
			title: `Amount (${ccy1})`,
			dataIndex: 'amount',
			key: 'amount',
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

	const bottomColumns: ColumnsType<ITableData> = [
		{
			dataIndex: 'amount',
			key: 'amount',
			align: 'right',
		},
		{
			dataIndex: 'price',
			key: 'price',
			align: 'right',
		},
		{
			dataIndex: 'total',
			key: 'total',
			align: 'right',
		},
	];

	const onRowClick = (r: ITableData) => {
		console.log('onRowClick orderId: ', r.key);
		dispatch({
			type: Types.SELECT_ORDER,
			payload: {
				orderId: r.key,
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
				<Table
					columns={topColumns}
					dataSource={state.bids}
					pagination={{ hideOnSinglePage: true }}
					loading={loading}
					size='small'
					onRow={(r) => ({
						onClick: () => onRowClick(r),
					})}
					id='oax-orderbook-bids'
				/>
				<Table
					columns={bottomColumns}
					dataSource={state.asks}
					pagination={{ hideOnSinglePage: true }}
					loading={loading}
					size='small'
					onRow={(r) => ({
						onClick: () => onRowClick(r),
					})}
					id='oax-orderbook-asks'
				/>
			</Content>
		</div>
	);
};

export default OrderBook;
