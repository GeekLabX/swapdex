const SwapInterface = require('./interface/interface')





async function printABTokenStats(parrot, aliceAddress, bobAddress, aliceTokenId, bobTokenId) {
    // Alice Bal
    const bal1 = await parrot.getTokenBalance(aliceAddress, aliceTokenId);
    const bal2 = await parrot.getTokenBalance(aliceAddress, bobTokenId);
    // Bob Bal
    const bal3 = await parrot.getTokenBalance(bobAddress, aliceTokenId);
    const bal4 = await parrot.getTokenBalance(bobAddress, bobTokenId);
    // Print stats
    console.log(` Token Balance Summary: \n TokenId: ${aliceTokenId} Alice: ${bal1} Bob: ${bal3} \n TokenId: ${bobTokenId} Alice: ${bal2} Bob: ${bal4}`);
}

// sleep blocking
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// sleep time between actions
const SLEEP = 6000;



async function createTwoTokens(parrot) {
    let ALICE; let BOB; let CHARLIE; let DAVE;
    [ALICE, BOB, CHARLIE, DAVE] = parrot.keyRingPairs;
    console.log('Creating two new PRC20 tokens!');
    // Alice creates a token
    const tokenIdAlice = await parrot.createToken(ALICE, 1000);
    console.log(`Alice has created Alice Token with tokenId: ${tokenIdAlice}`);
    await sleep(SLEEP);
    // Bob creates a token
    const tokenIdBob = await parrot.createToken(BOB, 500);
    console.log(`Bob has created Bob Token with tokenId: ${tokenIdBob}`);
    await sleep(SLEEP);
    // Print balance stats
    await printABTokenStats(parrot, ALICE.address, BOB.address, tokenIdAlice, tokenIdBob);

    return [tokenIdAlice, tokenIdBob];

}



async function main() {
    const parrotSwap = new SwapInterface();
    await parrotSwap.initApi();
    const parrot = parrotSwap.parrot;
    // get keyrings
    let ALICE; let BOB; let CHARLIE; let
        DAVE;
    [ALICE, BOB, CHARLIE, DAVE] = parrot.keyRingPairs;


    // let tokenIdBob; let tokenIdAlice;
    // [tokenIdBob, tokenIdAlice] = await createTwoTokens(parrot);
    // console.log(tokenIdBob, tokenIdAlice);




    // const ob = await parrotSwap.getOrderBook('ETH/USDT');



    // const order = await parrotSwap.createOrder('ETH/USDT', 200, 5, 'SELL', parrotSwap.parrot.keyRingPairs[1]);

    // const orderStatus = await parrotSwap.getOrderById(1);
    // const myOrder = await parrotSwap.getMyOpenOrders("0x8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48");



    // const openOrders = await parrotSwap.getOpenOrders();
    const status = await parrotSwap.cancelOrder(2, parrotSwap.parrot.keyRingPairs[1]);
    process.exit(-1);
}





main().catch(console.error);
