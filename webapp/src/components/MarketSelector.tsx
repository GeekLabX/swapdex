import React, { useContext, useState } from 'react';
import { Form, Radio } from 'antd';
import 'antd/dist/antd.css';
import { AppContext, Types } from '../AppContext';

interface Props {
	selectedMarket: string;
}

// This component has a selectedMarket property presets the currently
// selected market
const MarketSelector: React.FC<Props> = ({ selectedMarket }) => {
	const { dispatch } = useContext(AppContext);
	const [market, setMarket] = useState(selectedMarket);
	const onChangeMarket = (market: any) => {
		console.log('user selected ', market.target.value);
		setMarket(market.target.value);
		dispatch({
			type: Types.SYMBOL_CHANGE,
			payload: {
				symbol: market.target.value,
			},
		});
	};

	return (
		<Form>
			<Form.Item
				label='Select Market'
				name='market'
				rules={[{ required: true }]}
				initialValue={market}
			>
				<Radio.Group
					defaultValue={market}
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
