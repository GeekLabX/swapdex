import React from 'react';
import { Row, Typography } from 'antd';
import { ICreateOrder } from '../AppContext';
const { Text } = Typography;

interface Props {
	order: ICreateOrder;
}

const CreateSwapReview: React.FC<Props> = ({ order }) => {
	return order.side === 'BUY' ? (
		<BuyReview order={order} />
	) : (
		<SellReview order={order} />
	);
};

const BuyReview: React.FC<Props> = (o) => {
	return (
		<div>
			<Row>
				<Text>
					You will receive {o.order.ccy1Quantity} of {o.order.ccy1} token(s).
				</Text>
			</Row>
			<Row>
				<Text>
					In exchange for {o.order.ccy2Quantity} of {o.order.ccy2} token(s).
				</Text>
			</Row>
		</div>
	);
};

const SellReview: React.FC<Props> = (o) => {
	return (
		<div>
			<Row>
				<Text>
					You will receive {o.order.ccy2Quantity} of {o.order.ccy2} token(s).
				</Text>
			</Row>
			<Row>
				<Text>
					In exchange for {o.order.ccy1Quantity} of {o.order.ccy1} token(s).
				</Text>
			</Row>
		</div>
	);
};

export default CreateSwapReview;
