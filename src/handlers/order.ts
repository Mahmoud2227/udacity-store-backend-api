import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Order, OrderModel } from "../models/order";

const storeOrder = new OrderModel();

const index = async (_req: Request, res: Response) => {
    try {
        const authorizationHeader = _req.headers.authorization as String;
        const token = authorizationHeader.split(" ")[1].slice(1, -1);
        jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
    } catch (err) {
        console.log(err);
        res.status(401);
        res.json(err);
        return;
    }
    const users = await storeOrder.index();
    res.json(users);
};

const show = async (req: Request, res: Response) => {
    const user = await storeOrder.show(req.body.id);
    res.json(user);
};

const create = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization as String;

        const token: string = authorizationHeader.split(" ")[1].slice(1, -1);
        jwt.verify(token as string, process.env.TOKEN_SECRET as string);
    } catch (err) {
        res.status(401);
        return res.json(err);
    }
    try {
        const order: Order = {
            status: req.body.status,
            user_id: req.body.user_id,
        };

        const newOrder = await storeOrder.create(order);
        console.log(order);

        res.json(newOrder);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const addProduct = async (_req: Request, res: Response) => {
    const orderId: string = _req.params.id;
    const productId: string = _req.body.productId;
    const quantity: number = parseInt(_req.body.quantity);

    try {
        const addedProduct = await storeOrder.addProduct(quantity, orderId, productId);
        res.json(addedProduct);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const orderRoutes = (app: express.Application) => {
    app.get("/orders/", index);
    app.get("/orders/:id", show);
    app.post("/orders", create);
    app.post("/orders/:id/products", addProduct);
};

export default orderRoutes;
