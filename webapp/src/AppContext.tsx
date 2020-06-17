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
	total: string;
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
	symbol: string;
	bids: IOrderBookOffer[];
	asks: IOrderBookOffer[];
};

const initialState: IStateContext = {
	orderId: 0,
	symbol: 'OAX/ETH',
	bids: [
		{
			orderId: 0,
			price: '0.0',
			quantity: '0.0',
			total: '0.0',
			signedOffer: {
				offer: {
					offer_token: 1,
					offer_amount: 0,
					requested_token: 0,
					requested_amount: 0,
					nonce: 0,
				},
				signer: '',
				signature: '',
			},
		},
	],
	asks: [
		{
			orderId: 0,
			price: '0.0',
			quantity: '0.0',
			total: '0.0',
			signedOffer: {
				offer: {
					offer_token: 1,
					offer_amount: 0,
					requested_token: 0,
					requested_amount: 0,
					nonce: 0,
				},
				signer: '',
				signature: '',
			},
		},
	],
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
				bids: IOrderBookOffer[];
				asks: IOrderBookOffer[];
			};
	  }
	| {
			type: Types.CURRENT_ORDERBOOK;
			payload: {
				symbol: string;
				bids: IOrderBookOffer[];
				asks: IOrderBookOffer[];
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
					{
						orderId: 0,
						price: '0.0',
						quantity: '0.0',
						signedOffer: {
							offer: {
								offer_token: 1,
								offer_amount: 0,
								requested_token: 0,
								requested_amount: 0,
								nonce: 0,
							},
							signer: '',
							signature: '',
						},
					},
				],
				asks: [
					{
						orderId: 0,
						price: '0.0',
						quantity: '0.0',
						signedOffer: {
							offer: {
								offer_token: 1,
								offer_amount: 0,
								requested_token: 0,
								requested_amount: 0,
								nonce: 0,
							},
							signer: '',
							signature: '',
						},
					},
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
