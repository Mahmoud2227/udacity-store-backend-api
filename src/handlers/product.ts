import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Product, ClothesStore } from "../models/product";

const store = new ClothesStore();

const index = async (_req: Request, res: Response) => {
    const products = await store.index();
    res.json(products);
};

const show = async (req: Request, res: Response) => {
    const product = await store.show(req.body.id);
    res.json(product);
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
        const product: Product = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
        };
        const newProduct = await store.create(product);
        res.json(newProduct);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization as String;
        const token: string = authorizationHeader.split(" ")[1].slice(1, -1);
        jwt.verify(token, process.env.TOKEN_SECRET as string);
    } catch (err) {
        res.sendStatus(401);
        return res.json(err);
    }

    try {
        const deleted = await store.delete(req.body.id);
        res.json(deleted);
    } catch (error) {
        res.status(400);
        res.json({ error });
    }
};

const productRoutes = (app: express.Application) => {
    app.get("/products", index);
    app.get("/products/:id", show);
    app.post("/products", create);
    app.delete("/products", destroy);
};

export default productRoutes;
