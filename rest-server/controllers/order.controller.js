
const db = require("../models");
const Order = db.order;
const Op = db.Sequelize.Op;
const util = require('../util');

// Create an order in database
// POST /api/v1/order
exports.create = (req, res) => {
	// Validate request
	if (!req.body) {
		res.status(400).send({
			message: "Content cannot be empty!"
		});
		return;
	}
	console.log('create quantity: ', req.body.quantity);
	const order = {
		symbol: req.body.symbol,
		quantity: req.body.quantity,
		price: req.body.price,
		// TODO don't think we need client IDs b/c we have no site authentication
		// makerClientId: req.body.makerClientId,
		orderType: req.body.orderType,
		makerSide: req.body.makerSide,
		makerSig: req.body.makerSig,
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
exports.update = (req, res) => {
	const orderId = req.params.orderId;
	console.log('update: ', orderId);

	Order.update(req.body, {
		where: { orderId: orderId }
	})
		.then(num => {
			if (num == 1) {
				//TODO this should return the order details
				res.send({
					message: `Order ${orderId} updated successfully.`
				});
			} else {
				res.status(500).send({
					message: `Cannot update order ${orderId}. Maybe order not found or req.body was empty!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({ message: "Error updating order with id = " + orderId });
		});
}

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
		attributes: ['symbol', 'quantity', 'price', 'makerSide', 'orderType', 'orderId', 'status'],
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

	// we need to build our JSON object manually
	var finalJSON = { "symbol": symbol };
	Order.findAll({
		attributes: ['orderId', 'price', 'quantity', 'makerSig'],
		where: { symbol: symbol, makerSide: "BUY" },
		order: [["price", "DESC"]]
	})
		.then(data => {
			finalJSON.bids = data;
		})
		.then(() => {
			Order.findAll({
				attributes: ['orderId', 'price', 'quantity', 'makerSig'],
				where: { symbol: symbol, makerSide: "SELL" },
				order: [["price", "ASC"]]
			})
				.then(data => {
					finalJSON.asks = data;
				})
				.then(() => {
					res.send(finalJSON);
				});
		})
		.catch(err => {
			console.log('Some error retrieving order book for ${symbol}: ', err.message);
			res.status(500).send({ message: err.message || `Some error retrieving order book for ${symbol}` });
		});

}
