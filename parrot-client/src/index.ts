// ATOMIC SWAP DEMO for PRC20 TOKENS
// this is a custom polkadot js api wrapper
import ParrotInterface from './interfaces/interface';
import './interfaces/augment-api';
import './interfaces/augment-types';

import type { Offer } from './interfaces';

// demo for an atomic swap of tokens (this demo creates two new tokens)
async function testConnect() {
    // Get a new instance of the interface
    const parrot = new ParrotInterface();
    // Init api
    await parrot.initApi();
    // Init keyrings
    await parrot.initKeyRings();
    // get keyrings
    let ALICE;
    let BOB;
    let CHARLIE;
    let DAVE;
    [ALICE, BOB, CHARLIE, DAVE] = parrot.keyRingPairs;

    const offer: Offer = await parrot.api.createType(
        'Offer', {
        offer_token: 1,
        offer_amount: 200,
        requested_token: 1,
        requested_amount: 300,
        nonce: 2,
    });
    console.log(offer);
}

async function main() {
    await testConnect();
    process.exit(-1);
}

main().catch(console.error);
