import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Divider } from 'antd';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { AppContext } from '../AppContext';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import util from '../util';

const OrderDetail = () => {
	const componentSize: SizeType = 'small';
	const { state, dispatch } = useContext(AppContext);
	let [ccy1, ccy2] = util.parseSymbol(state.symbol);

	const [orderId, setOrderId] = useState(0);
	const [price, setPrice] = useState(0.0);
	const [amount, setAmount] = useState(0.0);
	const [total, setTotal] = useState(0.0);
	const [side, setSide] = useState('SELL');
	const requestOptions = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	};

	useEffect(() => {
		async function fetchData() {
			//console.log('fetching orderbook for ', state.symbol);
			if (state.orderId !== 0) {
				let url = 'http://localhost:8080/api/v1/order/' + state.orderId;
				let data = await fetch(url, requestOptions);
				//TODO what do we do if fetch failed and is not ok?
				if (data.ok) {
					let orderDetails = await data.json();
					console.log('OrderDetail json: ', orderDetails);
					setOrderId(orderDetails.orderId);
					setPrice(orderDetails.price);
					setAmount(orderDetails.quantity);
					setSide(orderDetails.makerSide);
					let p = parseFloat(orderDetails.price);
					let q = parseFloat(orderDetails.quantity);
					setTotal(p * q);
				}
			}
		}

		fetchData();
	});

	const onFinish = () => {
		if (orderId !== 0) {
			console.log(price);
			console.log(amount);
			console.log(total);
		} else {
			console.log('user clicked buy/sell without order selected');
		}
	};

	const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
		console.log('Failed: ', errorInfo);
	};

	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 },
	};

	const amtLabel: string = `Amount (${ccy1})`;
	const priceLabel: string = `Price (${ccy2})`;
	const totalLabel: string = `Total (${ccy2})`;

	//Determine order type to display appropriate button
	let tradeButton = side === 'SELL' ? 'BUY' : 'SELL';

	return (
		<div>
			<h2>Order Detail</h2>
			<Form
				{...layout}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				size={componentSize}
			>
				<Form.Item label={priceLabel}>{price}</Form.Item>
				<Form.Item label={amtLabel}>{amount}</Form.Item>
				<Form.Item label={totalLabel}>{total}</Form.Item>
				<Divider />
				<Form.Item>
					<Button size='large' type='ghost' htmlType='submit'>
						{tradeButton}
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default OrderDetail;
