// ATOMIC SWAP DEMO for PRC20 TOKENS
// this is a custom polkadot js api wrapper
const ParrotInterface = require('parrot-client');
const Util = require('@polkadot/util');
const UtilCrypto = require('@polkadot/util-crypto');
const axios = require('axios');

const ExchangeSettings = {
    url: 'http://localhost:8080',
    version: 'api/v1',
    symbolTokenIdMap: {
        BTC: 0,
        ETH: 1,
        USDT: 2,
        OAX: 3,
    },
};

class SwapInterface {
    constructor(settings = ExchangeSettings) {
        this.parrot = undefined;
        this.url = settings.url;
        this.version = settings.version;
        this.symbolTokenIdMap = settings.symbolTokenIdMap;
    }

    async initApi() {
        this.parrot = new ParrotInterface();
        await this.parrot.initApi();
        await this.parrot.initKeyRings();
    }

    static pairUrlParse(pair) {
        const parsed = pair.replace('/', '%2f');
        return parsed;
    }

    static buildCancelSignature(oid, keyringPair) {
        const cancelMessage = { cancel: oid }.toString();
        const encodedMessage = Util.stringToU8a(cancelMessage);
        const signature = keyringPair.sign(encodedMessage);
        return signature;
    }

    static validateCancelSignature(oid, signature, address) {
        const cancelMessage = { cancel: oid }.toString();
        const encodedMessage = Util.stringToU8a(cancelMessage);
        const isValid = UtilCrypto.signatureVerify(encodedMessage, signature, address);
        return isValid.isValid;
    }

    static priceQuantityPairSideConvert(price, quantity, pair, side) {
        const tokens = pair.split('/');
        // example pair= "ETH/USDT", price="230", quantity="5", side="BUY"
        if (side === 'BUY') {
            const offerToken = this.symbolTokenIdMap[tokens[1]];
            const requestedToken = this.symbolTokenIdMap[tokens[0]];
            const requestedAmount = quantity;
            const offerAmount = quantity * price;
        }
        // example pair= "ETH/USDT", price="230", quantity="5", side="SELL"
        else {
            const offerToken = this.symbolTokenIdMap[tokens[0]];
            const requestedToken = this.symbolTokenIdMap[tokens[1]];
            const requestedAmount = quantity * price;
            const offerAmount = quantity;
        }
        return [offerToken, offerAmount, requestedToken, requestedAmount]
    }

    buildUrl(query) {
        const url = `${this.url}/${this.version}/${query}`;
        return url;
    }

    async getRequest(query) {
        const url = this.buildUrl(query);
        console.log(url);
        try {
            const response = await axios.get(url);
            const { data } = response;
            console.log(data);
            return data;
        } catch (err) {
            console.log(`Error while sending getRequest to url ${url}! ${err}`);
            return err;
        }
    }

    async deleteRequest(query, body) {
        const url = this.buildUrl(query);
        console.log(url);
        try {
            const response = await axios.delete(url, { data: body })
            const { data } = response;
            console.log(data);
            return data;
        } catch (err) {
            console.log(`Error while sending deleteRequest to url ${url}! ${err}`);
            return err;
        }
    }

    async postRequest(query, body) {
        const url = this.buildUrl(query);
        console.log(url)
        try {
            const response = await axios.post(url, { data: body })
            const { data } = response;
            console.log(data);
            return data;
        } catch (err) {
            console.log(`Error while sending postRequest to url ${url}! ${err}`);
            return err;
        }
    }

    async getOrderBook(pair) {
        const parsedPair = this.pairUrlParse(pair);
        const query = `depth/${parsedPair}`;
        const data = await this.getRequest(query);
        return data;
    }

    async getOrderById(oid) {
        const query = `order/${oid}`;
        const data = await this.getRequest(query);
        return data;
    }

    async getMyOpenOrders(address) {
        const query = `myOrders/${address}`;
        const data = await this.getRequest(query);
        return data;
    }

    async getOpenOrders() {
        const query = 'openOrders';
        const data = await this.getRequest(query);
        return data;
    }

    async cancelOrder(oid, keyRingPair) {
        const signature = this.buildCancelSignature(oid, keyRingPair);
        const messageBody = {
            orderId: oid,
            address: keyRingPair.address,
            signature,
        };
        const query = `delete/${oid}`;
        const data = await this.deleteRequest(query, messageBody);
        return data;
    }

    async createSignedOffer(offerToken, offerAmount, requestedToken, requestedAmount, keyRingPair) {
        const offer = this.api.createOffer(
            keyRingPair.address,
            offerToken,
            offerAmount,
            requestedToken,
            requestedAmount,
        );
        const signature = this.api.signOffer(keyRingPair, offer);
        const signedOffer = this.createSignedOffer(offer, signature, keyRingPair.address);
        return signedOffer;
    }

    async createOrder(pair, price, quantity, side, keyRingPair) {
        let offerToken; let offerAmount; let requestedToken; let requestedAmount;
        [offerToken, offerAmount, requestedToken, requestedAmount] = this.priceQuantityPairSideConvert(price, quantity, pair, side, keyRingPair);
        const signedOffer = await this.createSignedOffer(
            offerToken,
            offerAmount,
            requestedToken,
            requestedAmount,
            keyRingPair,
        );
        const body = {
            symbol: pair,
            quantity,
            price,
            marketSide: side,
            orderType: 'LIMIT',
            address: keyRingPair.address,
            signedOffer,
        };
        const query = 'order';
        const orderDetails = await this.postRequest(query, body);
        return orderDetails;
    }
}


async function main() {
    const parrotSwap = new SwapInterface();
    await parrotSwap.initApi();
    const ob = await parrotSwap.getOrderBook("ETH/USDT");
    const order = await parrotSwap.getOrderById(3);
    const myOrder = await parrotSwap.getMyOpenOrders("0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48");
    const openOrders = await parrotSwap.getOpenOrders();
    process.exit(-1);
}





main().catch(console.error);
