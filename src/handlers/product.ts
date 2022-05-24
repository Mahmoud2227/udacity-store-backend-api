import { Application, Request, Response } from "express";
import { verifyAuthToken } from "../middleware/verifyAuthToken";
import { Product, ProductModel } from "../models/product";

const store = new ProductModel();

const index = async (_req: Request, res: Response) => {
    try {
        const products = await store.index();
        return res.send(products);
    } catch (err) {
        res.status(401).json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const product = await store.show(+req.params.id);
        return res.send(product);
    } catch (err) {
        res.status(401).json(err);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const product: Product = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
            id: undefined as unknown as number,
        };
        const newProduct = await store.create(product);
        return res.send(newProduct);
    } catch (err) {
        res.status(400).json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await store.delete(req.body.id);
        return res.send(deleted);
    } catch (err) {
        res.status(400).json(err);
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const product: Product = {
            id: req.body.id,
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            description: req.body.description,
        };

        const updatedProduct = await store.update(product);
        return res.send(updatedProduct);
    } catch (err) {
        res.status(400).json(err);
    }
};

const productRoutes = (app: Application) => {
    app.get("/products", index);
    app.get("/products/:id", show);
    app.post("/products", verifyAuthToken, create);
    app.delete("/products", verifyAuthToken, destroy);
    app.put("/products", verifyAuthToken, update);
};

export default productRoutes;
