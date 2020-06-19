"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var _a = require('@polkadot/api'), ApiPromise = _a.ApiPromise, Keyring = _a.Keyring, WsProvider = _a.WsProvider;
var BN = require('bn.js').BN;
var Util = require('@polkadot/util');
var UtilCrypto = require('@polkadot/util-crypto');
var ADDITIONAL_TYPES = require('../types/types.json');
var ParrotInterface = /** @class */ (function () {
    function ParrotInterface(types) {
        if (types === void 0) { types = ADDITIONAL_TYPES; }
        this.DOLLARS = BN;
        this.types = types;
        this.api = undefined;
        this.util = Util;
        this.utilCrypto = UtilCrypto;
        this.providerUrl = 'ws://localhost:9944';
        this.keyRingPairs = [];
        this.DOLLARS = new BN('1000000000000');
        this.burnerId = 'modlpy/burns';
    }
    // This initializes api
    ParrotInterface.prototype.initApi = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ws, _a, _b, chain, nodeName, nodeVersion;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        ws = new WsProvider(this.providerUrl);
                        // Instantiate the API
                        _a = this;
                        return [4 /*yield*/, ApiPromise.create({ types: this.types, provider: ws })];
                    case 1:
                        // Instantiate the API
                        _a.api = _c.sent();
                        return [4 /*yield*/, Promise.all([
                                this.api.rpc.system.chain(),
                                this.api.rpc.system.name(),
                                this.api.rpc.system.version(),
                            ])];
                    case 2:
                        _b = _c.sent(), chain = _b[0], nodeName = _b[1], nodeVersion = _b[2];
                        // Log these stats
                        console.log("You are connected to chain " + chain + " using " + nodeName + " v" + nodeVersion);
                        return [2 /*return*/];
                }
            });
        });
    };
    // Function that loads alice, bob, charlie, and dave Keyring
    ParrotInterface.prototype.initKeyRings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keyring, ALICE, BOB, CHARLIE, DAVE;
            return __generator(this, function (_a) {
                keyring = new Keyring({ type: 'sr25519' });
                ALICE = keyring.addFromUri('//Alice');
                BOB = keyring.addFromUri('//Bob');
                CHARLIE = keyring.addFromUri('//Charlie');
                DAVE = keyring.addFromUri('//Dave');
                this.keyRingPairs = [ALICE, BOB, CHARLIE, DAVE];
                return [2 /*return*/];
            });
        });
    };
    ParrotInterface.prototype.formatToCurrency = function (value) {
        return value / this.DOLLARS;
    };
    // this returns bal, is wrapped in a function due to the possibility of this call changing
    ParrotInterface.prototype.getFreeBalance = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var bal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.query.system.account(address)];
                    case 1:
                        bal = _a.sent();
                        return [2 /*return*/, bal.data.free];
                }
            });
        });
    };
    ParrotInterface.prototype.getNonce = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.query.system.account(address)];
                    case 1:
                        stats = _a.sent();
                        return [2 /*return*/, stats.nonce];
                }
            });
        });
    };
    // returns total issuance of the system after querrying
    ParrotInterface.prototype.getTotalIssuance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalIssuance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.query.balances.totalIssuance()];
                    case 1:
                        totalIssuance = _a.sent();
                        return [2 /*return*/, totalIssuance];
                }
            });
        });
    };
    // gets the balance of the burn pot
    ParrotInterface.prototype.getBurnerBalance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var PADDED_SEED, burnerBalanceStats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        PADDED_SEED = Util.stringToU8a(this.burnerId.padEnd(32, '\0'));
                        return [4 /*yield*/, this.api.query.system.account(PADDED_SEED)];
                    case 1:
                        burnerBalanceStats = _a.sent();
                        return [2 /*return*/, burnerBalanceStats.data.free];
                }
            });
        });
    };
    // Creates a PRC20 Token, returns tokenID
    // TODO: should be improved to use event to see if token is sucesfully created
    ParrotInterface.prototype.createToken = function (keyringPair, totalSupply) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenCount, tx, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.query.prc20.tokenCount()];
                    case 1:
                        tokenCount = _a.sent();
                        tx = this.api.tx.prc20.createToken(totalSupply);
                        return [4 /*yield*/, tx.signAndSend(keyringPair)];
                    case 2:
                        hash = _a.sent();
                        console.log('CreateToken sent with hash', hash.toHex());
                        // console.log(`Your tokenId is ${tokenCount}`);
                        return [2 /*return*/, tokenCount];
                }
            });
        });
    };
    // Transfer a token
    ParrotInterface.prototype.transferToken = function (keyringPair, to, tokenId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var prc20TransferTx, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.tx.prc20.transfer(to, tokenId, amount)];
                    case 1:
                        prc20TransferTx = _a.sent();
                        return [4 /*yield*/, prc20TransferTx.signAndSend(keyringPair)];
                    case 2:
                        hash = _a.sent();
                        console.log('PRC20 Transfer sent with hash', hash.toHex());
                        return [2 /*return*/];
                }
            });
        });
    };
    // approves token
    ParrotInterface.prototype.approveToken = function (keyingPair, who, tokenId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var approveTx, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.tx.prc20.approve(who, tokenId, amount)];
                    case 1:
                        approveTx = _a.sent();
                        return [4 /*yield*/, approveTx.signAndSend(keyingPair)];
                    case 2:
                        hash = _a.sent();
                        console.log("Approve sent with hash " + hash);
                        return [2 /*return*/];
                }
            });
        });
    };
    ParrotInterface.prototype.getAllowanceOf = function (wallet, who, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var bal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.query.prc20.allowance([tokenId, wallet, who])];
                    case 1:
                        bal = _a.sent();
                        return [2 /*return*/, bal];
                }
            });
        });
    };
    // token transfer from
    ParrotInterface.prototype.tokenTransferFrom = function (keyringPair, from, to, tokenId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var transferFromTx, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.tx.prc20.transferFrom(from, to, tokenId, amount)];
                    case 1:
                        transferFromTx = _a.sent();
                        return [4 /*yield*/, transferFromTx.signAndSend(keyringPair)];
                    case 2:
                        hash = _a.sent();
                        console.log("TransferFrom sent with hash " + hash);
                        return [2 /*return*/];
                }
            });
        });
    };
    // returns the token balance
    ParrotInterface.prototype.getTokenBalance = function (address, tokenId) {
        return __awaiter(this, void 0, void 0, function () {
            var bal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.query.prc20.balances([tokenId, address])];
                    case 1:
                        bal = _a.sent();
                        // console.log(`Token ${tokenId} Wallet: ${address} Balance: ${bal}`)
                        return [2 /*return*/, bal];
                }
            });
        });
    };
    // creates an offer struct
    ParrotInterface.prototype.createOffer = function (address, offerToken, offerAmount, requestedToken, requestedAmount) {
        return __awaiter(this, void 0, void 0, function () {
            var senderNonce, offer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNonce(address)];
                    case 1:
                        senderNonce = _a.sent();
                        return [4 /*yield*/, this.api.createType('Offer', {
                                offer_token: offerToken,
                                offer_amount: offerAmount,
                                requested_token: requestedToken,
                                requested_amount: requestedAmount,
                                nonce: senderNonce
                            })];
                    case 2:
                        offer = _a.sent();
                        return [2 /*return*/, offer];
                }
            });
        });
    };
    // takes an offer and returns a signature
    ParrotInterface.prototype.signOffer = function (keyRingPair, offer) {
        return __awaiter(this, void 0, void 0, function () {
            var encodedOffer, signature;
            return __generator(this, function (_a) {
                encodedOffer = offer.toU8a();
                signature = keyRingPair.sign(encodedOffer, { withType: true });
                return [2 /*return*/, signature];
            });
        });
    };
    // creates signed offer struct
    ParrotInterface.prototype.createSignedOffer = function (offer, signature, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var signedOffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.createType('SignedOffer', {
                            offer: offer,
                            signature: signature,
                            signer: signer
                        })];
                    case 1:
                        signedOffer = _a.sent();
                        return [2 /*return*/, signedOffer];
                }
            });
        });
    };
    // runs swap
    ParrotInterface.prototype.swap = function (keyRingPair, signedOffer) {
        return __awaiter(this, void 0, void 0, function () {
            var swapTx, hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        swapTx = this.api.tx.prc20.swap(signedOffer);
                        return [4 /*yield*/, swapTx.signAndSend(keyRingPair)];
                    case 1:
                        hash = _a.sent();
                        console.log('Swap sent by Alice with hash', hash.toHex());
                        return [2 /*return*/];
                }
            });
        });
    };
    // create a Delegated Transfer Details struct
    ParrotInterface.prototype.createDelegatedTransferDetails = function (senderAddress, receiverAddress, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, dtd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNonce(senderAddress)];
                    case 1:
                        nonce = _a.sent();
                        return [4 /*yield*/, this.api.createType('DelegatedTransferDetails', {
                                amount: amount,
                                to: receiverAddress,
                                nonce: nonce
                            })];
                    case 2:
                        dtd = _a.sent();
                        return [2 /*return*/, dtd];
                }
            });
        });
    };
    ParrotInterface.prototype.signDtd = function (keyRingPair, dtd) {
        return __awaiter(this, void 0, void 0, function () {
            var encodedDtd, signature;
            return __generator(this, function (_a) {
                encodedDtd = dtd.toU8a();
                signature = keyRingPair.sign(encodedDtd, { withType: true });
                return [2 /*return*/, signature];
            });
        });
    };
    ParrotInterface.prototype.createSignedDtd = function (dtd, signature, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var signedDtd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.createType('SignedDelegatedTransferDetails', { transfer: dtd, signature: signature, signer: signer })];
                    case 1:
                        signedDtd = _a.sent();
                        return [2 /*return*/, signedDtd];
                }
            });
        });
    };
    return ParrotInterface;
}());
exports["default"] = ParrotInterface;
