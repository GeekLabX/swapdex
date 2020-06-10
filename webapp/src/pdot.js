
import { ApiPromise, WsProvider } from '@polkadot/api';

// to use this import as:
// import { akshay } from '../pdot';

export const akshay = async () => {
	const wsProvider = new WsProvider('wss://kusama-rpc.polkadot.io');
	const api = await ApiPromise.create({ provider: wsProvider });

	// Do something
	console.log(api.genesisHash.toHex());
}
