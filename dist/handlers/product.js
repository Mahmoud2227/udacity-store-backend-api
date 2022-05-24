"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyAuthToken_1 = require("../middleware/verifyAuthToken");
const product_1 = require("../models/product");
const store = new product_1.ProductModel();
const index = async (_req, res) => {
    try {
        const products = await store.index();
        return res.send(products);
    }
    catch (err) {
        res.status(401).json(err);
    }
};
const show = async (req, res) => {
    try {
        const product = await store.show(+req.params.id);
        return res.send(product);
    }
    catch (err) {
        res.status(401).json(err);
    }
};
const create = async (req, res) => {
    try {
        const product = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            id: undefined,
        };
        const newProduct = await store.create(product);
        return res.send(newProduct);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const destroy = async (req, res) => {
    try {
        const deleted = await store.delete(req.body.id);
        return res.send(deleted);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const update = async (req, res) => {
    try {
        const product = {
            id: req.body.id,
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
        };
        const updatedProduct = await store.update(product);
        return res.send(updatedProduct);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const productRoutes = (app) => {
    app.get("/products", index);
    app.get("/products/:id", show);
    app.post("/products", verifyAuthToken_1.verifyAuthToken, create);
    app.delete("/products", verifyAuthToken_1.verifyAuthToken, destroy);
    app.put("/products", verifyAuthToken_1.verifyAuthToken, update);
};
exports.default = productRoutes;
