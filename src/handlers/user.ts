import { Application, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyAuthToken } from "../middleware/verifyAuthToken";
import { User, UserModel } from "../models/user";

const storeUser = new UserModel();

const index = async (_req: Request, res: Response) => {
    try {
        const users = await storeUser.index();
        return res.send(users);
    } catch (err) {
        console.log(err);
        res.status(401).json(err);
    }
    const users = await storeUser.index();
    res.json(users);
};

const show = async (req: Request, res: Response) => {
    try {
        const user = await storeUser.show(+req.params.id);
        return res.send(user);
    } catch (err) {
        console.log(err);
        res.status(401).json(err);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: req.body.password,
            id: undefined as unknown as number,
        };

        const newUser = await storeUser.create(user);

        var token = jwt.sign(newUser, process.env.TOKEN_SECRET as string);
        res.json(token);
    } catch (err) {
        res.status(400).json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await storeUser.delete(req.body.id);
        return res.send(deleted);
    } catch (err) {
        console.log(err);
        res.status(401).json(err);
        return;
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const user = {
            id: +req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: req.body.password,
        };
        const updated = await storeUser.update(user);
        return res.json(updated);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const userRoutes = (app: Application) => {
    app.get("/users", verifyAuthToken, index);
    app.get("/users/:id", verifyAuthToken, show);
    app.post("/users", create);
    app.put("/users", verifyAuthToken, update);
    app.delete("/users", verifyAuthToken, destroy);
};

export default userRoutes;
