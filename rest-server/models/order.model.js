/*
 This is the DB schema for our order table
 NOTE - this schema uses JSON datatype which is supported by Postgresql, SQLite and MySQL only.

 TODO: 
 - we can enumerate side, status and type for efficiency
 - Sequelize by default provides createdAt and updatedAt fields so we may not need createTime

 orderId		system generated, unique ID of this order
 symbol			i.e. OAXETH
 makerSide		BUY|SELL
 takerSide		BUY|SELL
 quantity
 orderType		LIMIT
 makerClientId	wallet address?
 takerClientId	wallet address?
 status			PENDING|FILLED|CANCELED
 createTime		order creation timestamp in UNIX time
 transactTime	FILLED or CANCELED timestamp in UNIX time
 signedOffer		signed message from order maker
 takerSig		signed message from taker, retrieved when blockchain emits fill event
 */

module.exports = (sequelize, Sequelize) => {
	const Order = sequelize.define("order", {
		orderId: {
			type: Sequelize.INTEGER,
			allowNull: false,
			unique: true,
			autoIncrement: true,
			primaryKey: true
		},
		symbol: {
			type: Sequelize.STRING,
			allowNull: false
		},
		makerSide: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		address: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		quantity: {
			type: Sequelize.DECIMAL(36, 8),
			allowNull: false,
		},
		orderType: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		price: {
			type: Sequelize.DECIMAL(36, 8),
			allowNull: false,
		},
		total: {
			type: Sequelize.VIRTUAL,
			get() {
				return this.quantity * this.price;
			},
			set(value) {
				throw new Error('Do not try to set this virtual column, total');
			}
		},
		status: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		createTime: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
		transactTime: {
			type: Sequelize.INTEGER
		},
		signedOffer: {
			type: Sequelize.JSON,
			allowNull: false,
		},
	});

	return Order;
};