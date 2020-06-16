import React, { useContext } from 'react';
import { Form, Radio } from 'antd';
import 'antd/dist/antd.css';
import { AppContext, Types } from '../AppContext';

const MarketSelector: React.FC = () => {
	const { state, dispatch } = useContext(AppContext);
	const onChangeMarket = (market: any) => {
		console.log('user selected ', market.target.value);
		dispatch({
			type: Types.SYMBOL_CHANGE,
			payload: {
				symbol: market.target.value,
				bids: state.bids,
				asks: state.asks,
			},
		});
	};

	return (
		<Form>
			<Form.Item
				label='Select Market'
				name='market'
				rules={[{ required: true }]}
				initialValue={state.symbol}
			>
				<Radio.Group
					defaultValue={state.symbol}
					buttonStyle='solid'
					onChange={onChangeMarket}
				>
					<Radio.Button value='OAX/ETH'>OAX/ETH</Radio.Button>
					<Radio.Button value='OAX/BTC'>OAX/BTC</Radio.Button>
					<Radio.Button value='BTC/USDT'>BTC/USDT</Radio.Button>
					<Radio.Button value='ETH/BTC'>ETH/BTC</Radio.Button>
				</Radio.Group>
			</Form.Item>
		</Form>
	);
};

export default MarketSelector;
