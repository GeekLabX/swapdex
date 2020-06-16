module.exports = app => {
    const order = require("../controllers/order.controller.js");

    var router = require("express").Router();

    // Create a new Order
    router.post("/order", order.create);

    // Retrieve a single Order with id
    router.get("/order/:orderId", order.findOne);

    // Retrieve all orders (might not be necessary)
    router.get("/order", order.findAll);

    // Retrieve all open orders
    router.get("/openOrders", order.findOpenOrders);

    // // Update a Order with id
    // router.put("/order/:orderId", order.update);

    // Order book
    router.get("/depth/:symbol", order.getOrderBook);

    // Delete a Order with id
    router.delete("/delete/:orderId", order.delete);

    // Get a users open orders 
    router.get("/myOrders/:address", order.myOrders);


    app.use('/api/v1', router);
};
