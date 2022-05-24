"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyAuthToken_1 = require("../middleware/verifyAuthToken");
const order_1 = require("../models/order");
const storeOrder = new order_1.OrderModel();
const index = async (_req, res) => {
    try {
        const orders = await storeOrder.index();
        return res.send(orders);
    }
    catch (err) {
        res.status(401).json(err);
    }
};
const show = async (req, res) => {
    try {
        const order = await storeOrder.show(+req.params.id);
        return res.json(order);
    }
    catch (err) {
        res.status(401).json(err);
    }
};
const create = async (req, res) => {
    try {
        const order = {
            status: req.body.status,
            user_id: req.body.user_id,
            id: undefined,
        };
        const newOrder = await storeOrder.create(order);
        return res.json(newOrder);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};
const update = async (req, res) => {
    try {
        const { status, id } = req.body;
        const newOrder = await storeOrder.update(id, status);
        return res.send(newOrder);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const destroy = async (req, res) => {
    try {
        const id = req.body.id;
        const order = await storeOrder.delete(id);
        return res.send(order);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};
const addProduct = async (req, res) => {
    const orderId = req.params.id;
    const productId = req.body.product_id;
    const quantity = +req.body.quantity;
    try {
        const addedProduct = await storeOrder.addProduct(quantity, orderId, productId);
        return res.send(addedProduct);
    }
    catch (err) {
        console.log(err);
        res.status(400);
        res.json(err);
    }
};
const orderRoutes = (app) => {
    app.get("/orders/", verifyAuthToken_1.verifyAuthToken, index);
    app.get("/orders/:id", verifyAuthToken_1.verifyAuthToken, show);
    app.post("/orders", verifyAuthToken_1.verifyAuthToken, create);
    app.delete("/orders", verifyAuthToken_1.verifyAuthToken, destroy);
    app.put("/orders", verifyAuthToken_1.verifyAuthToken, update);
    app.post("/orders/:id/products", verifyAuthToken_1.verifyAuthToken, addProduct);
};
exports.default = orderRoutes;
