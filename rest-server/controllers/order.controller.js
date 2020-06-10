
const db = require("../models");
const Order = db.order;
const Op = db.Sequelize.Op;
const ParrotInterface = require('../../parrot-client/src/parrot/interface');
const ADDITIONAL_TYPES = require('../../parrot-client/src/types/types.json');
const UtilCrypto = require('@polkadot/util-crypto');
const UtilPolk = require('@polkadot/util');
const util = require('../util');

//TODO: super initialize somewhere so you dont need to re-init every time you get a request 
async function parrotInit(){
  // Get a new instance of the interface
  const parrot = new ParrotInterface(ADDITIONAL_TYPES);
  // Init api
  await parrot.initApi();
  // Init keyrings
  await parrot.initKeyRings();
  // return interface
  return parrot; 	
}

function checkCancelSignature(oid,signature, address){
	cancel_message = {"cancel": oid}.toString();
	encoded_message = UtilPolk.stringToU8a(cancel_message);
	const isValid = UtilCrypto.signatureVerify(encoded_message,signature, address);
	return isValid.isValid
}


// Create an order in database
// POST /api/v1/order
exports.create = async(req, res) => {
	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: "Content cannot be empty!"
		});
		return;
	}
	
	// Initialize parrot (Need this for verification of types + blockchain communication)
	const parrot = await parrotInit(); 

	// TODO: verify symbol (currently chain only uses TokenId)
	// no mapping between symbol and tokenId exists (Future update)

	try{
		// get the Signed Offer
		const signedOffer = parrot.api.createType('SignedOffer', req.body.signedOffer); 
		// verify if its correctly signed; 
		const maker = signedOffer.signer; 
		const offer = signedOffer.offer; 
		const encoded_offer = offer.toU8a(); 
		const signature = signedOffer.signature.toHex(); 
		const isValid = UtilCrypto.signatureVerify(encoded_offer,signature, maker);
		// if its correctly signed!
		if (isValid.isValid) {			
			//verify user nonce 
			const nonce = await parrot.getNonce(maker);
			if (nonce.toNumber() === offer.nonce.toNumber()){
				// get offer token balance
				const offerer_token_balance = await parrot.getTokenBalance(maker, offer.offer_token);
				// ensure user has enough tokens 
				if (offerer_token_balance > offer.offer_amount){
					// TODO : verify quantity and price and side
					console.log('create quantity: ', req.body.quantity);
					const order = {
						symbol: req.body.symbol,
						quantity: req.body.quantity,
						price: req.body.price,
						orderType: req.body.orderType,
						makerSide: req.body.makerSide,
						signedOffer: req.body.signedOffer,
						address: req.body.signedOffer.signer, 
						status: "OPEN",
						createTime: Date.now() / 1000
					};		
					Order.create(order)
						.then(data => {
							res.send(data);
						})
						.catch(err => {
							res.status(500).send({
								message: err.message || "Some error occurred while creating an Order."
							});
						});

				}
				else{
					res.status(500).send({message: `Not Enough Balance! Current Token Balance: ${offerer_token_balance} Order Amount: ${offer.offer_amount}`})
				}
			}
			else{
				res.status(500).send({message: `Invalid Nonce! Current Nonce: ${nonce} Order Nonce: ${signedOffer.offer.nonce}`})
			}
		}
		else {
			res.status(500).send({message: "Invalid Signature!"})
		}
	}
	catch(err){
		res.status(500).send({message: err.message || "Invalid Order!"}) 
	}
};

// Retrieve one Orders with an id
exports.findOne = (req, res) => {
	const orderId = req.params.orderId;
	console.log('findOne: ', orderId);
	Order.findByPk(orderId)
		.then(data => {
			if (data) {
				res.send(data);
			} else {
				res.status(404).send({ message: "Error retrieving orderId = " + orderId });
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving orderId = " + orderId
			});
		});
};

// Update an order with orderId
// TODO this is here for completeness of CRUD but we need to do validation if
// we really want to allow users to modify orders. 
// exports.update = (req, res) => {
// 	const orderId = req.params.orderId;
// 	console.log('update: ', orderId);

// 	Order.update(req.body, {
// 		where: { orderId: orderId }
// 	})
// 		.then(num => {
// 			if (num == 1) {
// 				//TODO this should return the order details
// 				res.send({
// 					message: `Order ${orderId} updated successfully.`
// 				});
// 			} else {
// 				res.status(500).send({
// 					message: `Cannot update order ${orderId}. Maybe order not found or req.body was empty!`
// 				});
// 			}
// 		})
// 		.catch(err => {
// 			res.status(500).send({ message: "Error updating order with id = " + orderId });
// 		});
// }

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
	console.log("findAll");

	Order.findAll({
		attributes: ['symbol', 'quantity', 'price', 'makerSide', 'orderType', 'orderId', 'status']
	})
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving tutorials."
			});
		});
};

// Orders that have yet to be filled have pending status. This is used by the /orderBook API
exports.findOpenOrders = (req, res) => {
	console.log('findOpenOrders');

	Order.findAll({
		attributes: ['symbol', 'quantity', 'price', 'makerSide', 'orderType', 'orderId', 'status', 'address'],
		where: { status: "OPEN" }
	})
		.then(data => {
			// TODO we need to manipulate the data here before sending back
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({ message: err.message || "Some error occurred while retrieiving PENDING orders." });
		});
};



// Return the order book for a given symbol
exports.getOrderBook = (req, res) => {
	const symbol = req.params.symbol;
	console.log('getOrderBook: ', symbol);
	const pairs = util.parseSymbol(symbol);
	//res.send(`{ firstPair: ${pairs[0]}, secondPair: ${pairs[1]} }`);
	// we need to build our JSON object manually
	var finalJSON = { "symbol": symbol };
	Order.findAll({
		attributes: ['orderId', 'price', 'quantity', 'signedOffer'],
		where: { symbol: symbol, makerSide: "BUY" , status: "OPEN"},
		order: [["price", "DESC"]]
	})
		.then(data => {
			finalJSON.bids = data;
		})
		.catch(err => {
			res.status(500).send({ message: err.message || `Some error retrieving order book for ${symbol}` });
		});

	Order.findAll({
		attributes: ['orderId', 'price', 'quantity', 'signedOffer'],
		where: { symbol: symbol, makerSide: "SELL", status: "OPEN" },
		order: [["price", "ASC"]]
	})
		.then(data => {
			finalJSON.asks = data;
		})
		.then(() => {
			res.send(finalJSON);
		})
		.catch(err => {
			res.status(500).send({ message: err.message || `Some error retrieving order book for ${symbol}` });
		});
}



// Delete an order with orderId
exports.delete = async(req, res) => {

	try {
		// get order id from url 
		const orderId = req.params.orderId;
		console.log('delete: ', orderId);
		// get signature and address from req body 
		const address = req.body.address; 
		const signature = req.body.signature; 
		// check if signature is valid 
		valid = checkCancelSignature(orderId, signature, address);
		if (valid){

			
			Order.update({status: 'CANCELED'}, {
				where: {orderId: orderId, address: address} 
			})
			.then(num => {
				if (num == 1) {
					//TODO this should return the order details
					res.send({
						message: `Order ${orderId} cancelled successfully.`
					});
				} else {
					res.status(500).send({
						message: `Cannot cancel order ${orderId}. Maybe order not found or req.body was empty!`
					});
				}
			})
			.catch(err => {
				res.status(500).send({ message: "Error cancelling order with id = " + orderId });
			});

			
		
		}
		else{
			res.status(500).send({ message: "Invalid Cancel Signature!"});
		}
	}	
	catch(err){
		res.status(500).send({ message: err.message || "Invalid Cancel Signature!"});
	}
}

