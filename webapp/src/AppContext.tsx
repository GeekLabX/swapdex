import React, { createContext, useReducer, Dispatch } from 'react';

export enum Types {
	SYMBOL_CHANGE = 'SYMBOL_CHANGE',
	SELECT_ORDER = 'SELECT_ORDER',
	CURRENT_ORDERBOOK = 'CURRENT_ORDERBOOK',
}

export type Action =
	| { type: Types.SYMBOL_CHANGE; payload: { symbol: string } }
	| {
			type: Types.CURRENT_ORDERBOOK;
			payload: {
				rawOrderBook: IOrderBook;
				bids: ITableData[];
				asks: ITableData[];
			};
	  }
	| { type: Types.SELECT_ORDER; payload: { orderId: number } };

// IOrderBook interface is the format of the JSON returned from REST API for /api/v1/depth
export interface IOrderBook {
	symbol: string;
	asks: [IOrderBookEntry];
	bids: [IOrderBookEntry];
}

export interface IOrderBookEntry {
	makerSig: string;
	orderId: number;
	price: string;
	quantity: string;
}

export interface ITableData {
	key: number;
	price: string;
	amount: string;
	total: string;
}

export interface ICreateOrder {
	market: string;
	price: number;
	ccy1Quantity: number;
	ccy2Quantity: number;
	side: string;
	ccy1: string;
	ccy2: string;
	makerSig: string;
}

type IStateContext = {
	orderId: number;
	symbol: String;
	rawOrderBook: IOrderBook;
	bids: ITableData[];
	asks: ITableData[];
};

const initialState: IStateContext = {
	orderId: 0,
	symbol: 'OAX/ETH',
	rawOrderBook: {
		symbol: 'OAX/ETH',
		asks: [{ makerSig: '', orderId: 0, price: '0', quantity: '0' }],
		bids: [{ makerSig: '', orderId: 0, price: '0', quantity: '0' }],
	},
	bids: [],
	asks: [],
};

const AppContext = createContext<{
	state: IStateContext;
	dispatch: Dispatch<Action>;
}>({
	state: initialState,
	dispatch: () => null,
});

export const appReducer = (state: IStateContext, action: Action) => {
	switch (action.type) {
		case Types.SYMBOL_CHANGE:
			console.log('DISPATCH:: user changed market to: ', action.payload.symbol);
			return {
				...state,
				symbol: action.payload.symbol,
			};
		case Types.SELECT_ORDER:
			console.log('DISPATCH:: user selected orderId: ', action.payload.orderId);
			return {
				...state,
				orderId: action.payload.orderId,
			};
		case Types.CURRENT_ORDERBOOK:
			return {
				...state,
				rawOrderBook: action.payload.rawOrderBook,
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
