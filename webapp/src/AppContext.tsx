import React, { createContext, useReducer, Dispatch } from 'react';

export enum Types {
	SYMBOL_CHANGE = 'SYMBOL_CHANGE',
	SELECT_ORDER = 'SELECT_ORDER',
	CURRENT_ORDERBOOK = 'CURRENT_ORDERBOOK',
}

// IOrderBook interface is the format of the JSON returned from REST API for /api/v1/depth
export interface IOrderBookResponse {
	symbol: string;
	asks: [IOrderBookOffer];
	bids: [IOrderBookOffer];
}

// is is part of the response in IOrderBookResponse
export interface IOrderBookOffer {
	orderId: number;
	price: string;
	quantity: string;
	signedOffer: {
		offer: {
			offer_token: number;
			offer_amount: number;
			requested_token: number;
			requested_amount: number;
			nonce: number;
		};
		signer: string;
		signature: string;
	};
}

//TODO need to replace address with signedOffer
//TODO can we just get rid of this entirely and replace with IOrderBookOffer??
export interface ITableData {
	key: number;
	price: string;
	quantity: string;
	total: string;
	address: string;
}

export interface ICreateOrder {
	market: string;
	price: number;
	ccy1Quantity: number;
	ccy2Quantity: number;
	side: string;
	ccy1: string;
	ccy2: string;
	signedOffer: string;
}

type IStateContext = {
	orderId: number;
	symbol: String;
	bids: ITableData[];
	asks: ITableData[];
};

//TODO need to replace address with signedOffer
const initialState: IStateContext = {
	orderId: 0,
	symbol: 'OAX/ETH',
	bids: [{ key: 0, price: '0.0', quantity: '0.0', total: '0.0', address: '' }],
	asks: [{ key: 0, price: '0.0', quantity: '0.0', total: '0.0', address: '' }],
};

const AppContext = createContext<{
	state: IStateContext;
	dispatch: Dispatch<Action>;
}>({
	state: initialState,
	dispatch: () => null,
});

export type Action =
	| {
			type: Types.SYMBOL_CHANGE;
			payload: {
				symbol: string;
				bids: ITableData[];
				asks: ITableData[];
			};
	  }
	| {
			type: Types.CURRENT_ORDERBOOK;
			payload: {
				symbol: string;
				bids: ITableData[];
				asks: ITableData[];
			};
	  }
	| { type: Types.SELECT_ORDER; payload: { orderId: number } };

export const appReducer = (state: IStateContext, action: Action) => {
	switch (action.type) {
		case Types.SYMBOL_CHANGE:
			// Send empty bids/asks here to clear display while fetching new market
			console.log('DISPATCH:: user changed market to: ', action.payload.symbol);
			return {
				...state,
				symbol: action.payload.symbol,
				bids: [
					{ key: 0, price: '0.0', amount: '0.0', total: '0.0', address: '' },
				],
				asks: [
					{ key: 0, price: '0.0', amount: '0.0', total: '0.0', address: '' },
				],
			};
		case Types.SELECT_ORDER:
			console.log('DISPATCH:: user selected orderId: ', action.payload.orderId);
			return {
				...state,
				orderId: action.payload.orderId,
			};
		case Types.CURRENT_ORDERBOOK:
			console.log('DISPATCH:: received new orderbook: ', action.payload);
			return {
				...state,
				symbol: action.payload.symbol,
				asks: action.payload.asks,
				bids: action.payload.bids,
			};
	}
};

const StateProvider: React.FC = ({ children }) => {
	const [state, dispatch] = useReducer(appReducer, initialState);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{children}
		</AppContext.Provider>
	);
};

export { AppContext, StateProvider };
