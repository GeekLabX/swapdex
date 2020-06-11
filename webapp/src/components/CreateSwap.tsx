import React, { useState, useContext } from 'react';
import {
	Form,
	Button,
	Row,
	Col,
	InputNumber,
	Typography,
	Space,
	Radio,
	Divider,
} from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import fetch from 'node-fetch';
import { AppContext, Types } from '../AppContext';
import util from '../util';
import CreateSwapReview from './CreateSwapReview';
import { REST_URL } from '../constants';
import { withRouter, RouteComponentProps } from 'react-router';

const { Text } = Typography;

type CreateSwapProps = RouteComponentProps;

const CreateSwap: React.FC<CreateSwapProps> = ({ history }) => {
	const { state, dispatch } = useContext(AppContext);
	let [ccy1, ccy2] = util.parseSymbol(state.symbol);

	const [values, setValues] = useState({
		market: state.symbol,
		ccy1: ccy1,
		ccy1Quantity: 0,
		ccy2: ccy2,
		ccy2Quantity: 0,
		price: 0,
		side: 'BUY',
		makerSig: '', //TODO Akshay
	});

	const onChangeQuantity = (q: number | string | undefined) => {
		if (typeof q === 'string') {
			q = Number(q);
		} else if (q === undefined) q = 0;
		const qty = q ?? 0;
		setValues({ ...values, ccy1Quantity: qty });
	};

	const onChangePrice = (q: number | string | undefined) => {
		// take care of string conversion or undefined
		if (typeof q === 'string') {
			q = Number(q);
		} else if (q === undefined) q = 0;
		const p = q ?? 0;
		let numRecv = 0;
		numRecv = p * values.ccy1Quantity;
		setValues({ ...values, ccy2Quantity: numRecv, price: p });
	};

	const onChangeSide = (s: RadioChangeEvent) => {
		console.log('changed side to: ', s.target.value);
		setValues({ ...values, side: s.target.value });
	};

	const onChangeMarket = (s: RadioChangeEvent) => {
		console.log('changed market to: ', s.target.value);
		let [ccy1, ccy2] = util.parseSymbol(s.target.value);
		setValues({ ...values, market: s.target.value, ccy1: ccy1, ccy2: ccy2 });
		dispatch({
			type: Types.SYMBOL_CHANGE,
			payload: {
				symbol: s.target.value,
			},
		});
	};

	const onFinish = async () => {
		let tradeQty = 0;
		if (values.side === 'BUY') tradeQty = values.ccy1Quantity;
		else if (values.side === 'SELL') tradeQty = values.ccy2Quantity;

		const requestOptions = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				symbol: values.market,
				quantity: tradeQty,
				price: values.price,
				makerSide: values.side,
				orderType: 'LIMIT',
				makerSig: '',
			}),
		};
		const url = REST_URL + '/order';
		let data = await fetch(url, requestOptions);
		let json = await data.json();
		if (data.ok) {
			console.log('calling viewSwaps with mkt: ', values.market);
			history.push({
				pathname: `/viewSwaps?mkt={values.market}`,
				state: { selectedMarket: values.market, wayland: 'chan' },
			});
		}
		//const [values, setValues] = useState(AppContext);
		console.log(json);
	};

	return (
		<div>
			<Row>
				<Col span={4} />
				<Col span={16}>
					<Form name='createSwap' onFinish={onFinish}>
						<Row>
							<Col>
								<Form.Item
									label='Select Market'
									name='market'
									rules={[{ required: true }]}
									initialValue={values.market}
								>
									<Radio.Group
										defaultValue={values.side}
										buttonStyle='solid'
										onChange={onChangeMarket}
									>
										<Radio.Button value='OAX/ETH'>OAX/ETH</Radio.Button>
										<Radio.Button value='OAX/BTC'>OAX/BTC</Radio.Button>
										<Radio.Button value='BTC/USDT'>BTC/USDT</Radio.Button>
										<Radio.Button value='ETH/BTC'>ETH/BTC</Radio.Button>
									</Radio.Group>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Item
									label='Side'
									name='side'
									rules={[{ required: true }]}
									initialValue={values.side}
								>
									<Radio.Group
										defaultValue={values.side}
										buttonStyle='solid'
										onChange={onChangeSide}
									>
										<Radio.Button value='BUY'>BUY</Radio.Button>
										<Radio.Button value='SELL'>SELL</Radio.Button>
									</Radio.Group>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<Space>
									<Form.Item
										name='ccy1'
										rules={[{ required: true }]}
										initialValue={values.ccy1}
									>
										<Space>
											<Text>You want to {values.side} </Text>{' '}
											<InputNumber
												value={values.ccy1Quantity}
												onChange={onChangeQuantity}
											/>
											{values.ccy1}
											<Text>, each at </Text>
											<InputNumber
												value={values.price}
												onChange={onChangePrice}
											/>
											{values.ccy2}
										</Space>
									</Form.Item>
								</Space>
							</Col>
						</Row>
						<Divider />
						<Row>
							<Text mark>Review Trade</Text>
						</Row>
						<CreateSwapReview order={values} />
						<Divider />
						<Form.Item>
							<Button type='ghost' htmlType='submit'>
								Create Order
							</Button>
						</Form.Item>
					</Form>
				</Col>
				<Col span={4} />
			</Row>
		</div>
	);
};

export default withRouter(CreateSwap);
