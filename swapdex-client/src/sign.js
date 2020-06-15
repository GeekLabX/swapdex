// ATOMIC SWAP DEMO for PRC20 TOKENS
// this is a custom polkadot js api wrapper
const ParrotInterface = require('parrot-client');
const Util = require('@polkadot/util');
const UtilCrypto = require('@polkadot/util-crypto');
const axios = require("axios");


const ExchangeSettings = {
    url: 'http://localhost:8080',
    version: 'api/v1',
}



class SwapInterface {
    constructor(settings = ExchangeSettings) {
        this.settings = settings;
        this.pairReplace = '%2f';
    }

    pairUrlParse(pair) {
        const parsed = pair.replace('/', this.pairReplace);
        return parsed;
    }

    buildUrl(query) {
        const url = `${this.settings.url}/${this.settings.version}/${query}`;
        return url;
    }

    buildCancelSignature(oid, keyringPair) {
        const cancelMessage = { cancel: oid }.toString();
        const encodedMessage = Util.stringToU8a(cancelMessage);
        const signature = keyringPair.sign(encodedMessage);
        return signature;
    }

    async getRequest(query) {
        const url = this.buildUrl(query);
        console.log(url);
        try {
            const response = await axios.get(url);
            const { data } = response;
            console.log(data);
            return data;
        }
        catch (err) {
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
        }
        catch (err) {
            console.log(`Error while sending deleteRequest to url ${url}! ${err}`);
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
        const query = `openOrders`;
        const data = await this.getRequest(query);
        return data;
    }

    async cancelOrder(oid, keyRingPair) {
        const signature = this.buildCancelSignature(oid, keyRingPair);
        const messageBody = {
            orderId: oid,
            address: keyRingPair.address,
            signature: signature
        };
        const query = `delete/${oid}`;
        const data = await this.deleteRequest(query, messageBody);
        return data;
    }


    // async createOrder(pair, price, quantity, side, address, KeyRing) {
    //     const query = `order`;
    //     // we need quantity<->offer_token, quantity<->requested_token
    //     if (side === "SELL"){


    //     } 

    // }






}

async function main() {
    const parrotSwap = new SwapInterface();
    const ob = await parrotSwap.getOrderBook("ETH/USDT");
    const order = await parrotSwap.getOrderById(3);
    const myOrder = await parrotSwap.getMyOpenOrders("0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48");
    const openOrders = await parrotSwap.getOpenOrders();
    process.exit(-1);
}










// // this prints token stats for 2 addresses and 2 different tokens,
// // useful in making sure that a swap has successfully occurred (only for visual feedback purposes)
// async function printAliceBobTokenStats(parrot, aliceAddress, bobAddress, aliceTokenId, bobTokenId) {
//     // Alice Bal
//     const bal1 = await parrot.getTokenBalance(aliceAddress, aliceTokenId);
//     const bal2 = await parrot.getTokenBalance(aliceAddress, bobTokenId);
//     // Bob Bal
//     const bal3 = await parrot.getTokenBalance(bobAddress, aliceTokenId);
//     const bal4 = await parrot.getTokenBalance(bobAddress, bobTokenId);
//     // Print stats
//     console.log(` Token Balance Summary: \n TokenId: ${aliceTokenId} Alice: ${bal1} Bob: ${bal3} \n TokenId: ${bobTokenId} Alice: ${bal2} Bob: ${bal4}`);
// }

// function cancelOrder(oid, keyringPair) {
//     const cancelMessage = { cancel: oid }.toString();
//     const encodedMessage = Util.stringToU8a(cancelMessage);
//     const signature = keyringPair.sign(encodedMessage);
//     return signature;
// }

// function checkCancelSignature(oid, signature, address) {
//     const cancelMessage = { cancel: oid }.toString();
//     const encodedMessage = Util.stringToU8a(cancelMessage);
//     const isValid = UtilCrypto.signatureVerify(encodedMessage, signature, address);
//     return isValid.isValid;
// }

// function prettyPrintSignedOffer(signedOffer) {
//     const pretty = {
//         signature: signedOffer.signature.toHex(),
//         signer: signedOffer.signer.toHex(),
//         offer: {
//             offer_token: signedOffer.offer.offer_token.toNumber(),
//             offer_amount: signedOffer.offer.offer_amount.toNumber(),
//             requested_token: signedOffer.offer.requested_token.toNumber(),
//             requested_amount: signedOffer.offer.requested_amount.toNumber(),
//             nonce: signedOffer.offer.nonce.toNumber(),
//         },
//     };
//     console.log(pretty);
// }

// // sleep blocking
// function sleep(ms) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// }

// // demo for an atomic swap of tokens (this demo creates two new tokens)
// async function swapDemo() {
//     // Get a new instance of the interface
//     const parrot = new ParrotInterface();
//     // Init api
//     await parrot.initApi();
//     // Init keyrings
//     await parrot.initKeyRings();
//     // get keyrings
//     let ALICE; let BOB; let CHARLIE; let
//         DAVE;
//     [ALICE, BOB, CHARLIE, DAVE] = parrot.keyRingPairs;

//     console.log('Creating two new PRC20 tokens!');
//     // Alice creates a token
//     const tokenIdAlice = await parrot.createToken(ALICE, 1000);
//     console.log(`Alice has created Alice Token with tokenId: ${tokenIdAlice}`);
//     await sleep(SLEEP);
//     // Bob creates a token
//     const tokenIdBob = await parrot.createToken(BOB, 500);
//     console.log(`Bob has created Bob Token with tokenId: ${tokenIdBob}`);
//     await sleep(SLEEP);
//     // Print balance stats
//     await printAliceBobTokenStats(parrot, ALICE.address, BOB.address, tokenIdAlice, tokenIdBob);
//     console.log('Now Bob will create an offer to trade some of his tokens for AliceToken');
//     // Bob  creates an offer
//     const offer = await parrot.createOffer(BOB.address, tokenIdBob, 100, tokenIdAlice, 200);
//     // Bob creates a signature for the offer
//     const signature = await parrot.signOffer(BOB, offer);
//     // Bob creates a signedOffer
//     const signedOffer = await parrot.createSignedOffer(offer, signature, BOB.address);
//     console.log('Bob has created a signedOffer that he shares with Alice');
//     console.log('You can use this offer for testing purposes!');

//     prettyPrintSignedOffer(signedOffer);

//     const cancelSig = cancelOrder(1, BOB);
//     console.log(Util.u8aToHex(cancelSig));
//     const isValid = checkCancelSignature(5, cancelSig, BOB.address);
//     console.log(isValid);

//     // Now Bob sends this offer ofline to Alice
//     // Alice decides to broadcast it since she is willing to take the offer
//     // await parrot.swap(ALICE, signedOffer);
//     // await sleep(SLEEP);
//     // Print balance stats
//     // await printAliceBobTokenStats(parrot, ALICE.address, BOB.address, tokenIdAlice, tokenIdBob);
// }

main().catch(console.error);
