import express, { Request, Response } from "express";
import { verifyAuthToken } from "../middleware/verifyAuthToken";
import { Order, OrderModel } from "../models/order";

const storeOrder = new OrderModel();

const index = async (_req: Request, res: Response) => {
    try {
        const orders = await storeOrder.index();
        return res.send(orders);
    } catch (err) {
        res.status(401).json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const order = await storeOrder.show(+req.params.id);
        return res.json(order);
    } catch (err) {
        res.status(401).json(err);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const order: Order = {
            status: req.body.status,
            user_id: req.body.user_id,
            id: undefined as unknown as number,
        };

        const newOrder = await storeOrder.create(order);
        return res.json(newOrder);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const { status, id } = req.body;
        const newOrder = await storeOrder.update(id, status);
        return res.send(newOrder);
    } catch (err) {
        res.status(400).json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    try {
        const id = req.body.id;
        const order = await storeOrder.delete(id);
        return res.send(order);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};

const addProduct = async (req: Request, res: Response) => {
    const orderId: string = req.params.id;
    const productId: string = req.body.product_id;
    const quantity: number = +req.body.quantity;

    try {
        const addedProduct = await storeOrder.addProduct(quantity, orderId, productId);
        return res.send(addedProduct);
    } catch (err) {
        console.log(err);
        res.status(400);
        res.json(err);
    }
};

const orderRoutes = (app: express.Application) => {
    app.get("/orders/", verifyAuthToken, index);
    app.get("/orders/:id", verifyAuthToken, show);
    app.post("/orders", verifyAuthToken, create);
    app.delete("/orders", verifyAuthToken, destroy);
    app.put("/orders", verifyAuthToken, update);
    app.post("/orders/:id/products", verifyAuthToken, addProduct);
};

export default orderRoutes;
