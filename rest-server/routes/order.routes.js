module.exports = app => {
  const order = require("../controllers/order.controller.js");

  var router = require("express").Router();

  // Create a new Order
  router.post("/order", order.create);

  // Retrieve a single Order with id
  router.get("/order/:orderId", order.findOne);

  // Retrieve all orders
  router.get("/order", order.findAll);

  // Retrieve all open orders
  router.get("/openOrder", order.findOpenOrders);

  // Update a Order with id
  router.put("/order/:orderId", order.update);

  // Order book
  router.get("/depth/:symbol", order.getOrderBook);

  // // Delete a Order with id
  // router.delete("/:id", order.delete);

  // // Create a new Order
  // router.delete("/", order.deleteAll);

  app.use('/api/v1', router);
};
