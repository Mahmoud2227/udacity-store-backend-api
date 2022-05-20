import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User, UserReturnType, UserModel } from "../models/user";

const storeUser = new UserModel();

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
    const users = await storeUser.index();
    res.json(users);
};

const show = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization as String;
        const token = authorizationHeader.split(" ")[1].slice(1, -1);
        jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
    } catch (err) {
        console.log(err);
        res.status(401);
        res.json(err);
        return;
    }
    const user = await storeUser.show(req.body.id);
    res.json(user);
};

const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: req.body.password,
        };

        const newUser = await storeUser.create(user);

        var token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string);
        res.json(token);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization as String;
        const token = authorizationHeader.split(" ")[1].slice(1, -1);
        jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
    } catch (err) {
        console.log(err);
        res.status(401);
        res.json(err);
        return;
    }
    const deleted = await storeUser.delete(req.body.id);

    res.json(deleted);
};

const authenticate = async (req: Request, res: Response) => {
    const user = await storeUser.authenticate(req.body.username, req.body.password);

    var token = jwt.sign({ user: user }, process.env.TOKEN_SECRET as string);

    if (!user) {
        res.status(404);
        return res.json({ message: "Please make sure the username and password are correct" });
    }
    res.json({ token: token });
};

const update = async (req: Request, res: Response) => {
    const user: UserReturnType = {
        id: parseInt(req.body.id),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: req.body.password,
    };
    try {
        const authorizationHeader = req.headers.authorization as String;
        const token = authorizationHeader.split(" ")[1].slice(1, -1);
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
        console.log(decoded.user.id, user.id);
        if (+decoded.user.id !== user.id) {
            throw new Error("User id does not match!");
        }
    } catch (err) {
        console.log(err);
        res.status(401);
        res.json(err);
        return;
    }

    try {
        const updated = await storeUser.create(user);
        res.json(updated);
    } catch (err) {
        res.status(400);
        let errorMessage = "Failed to do something exceptional";
        if (err instanceof Error) {
            errorMessage = err.message;
            res.json(errorMessage + user);
        }
    }
};

const userRoutes = (app: express.Application) => {
    app.get("/users", index);
    app.get("/users/:id", show);
    app.post("/users/authenticate", authenticate);
    app.post("/users", create);
    app.put("/users/update", update);
    app.delete("/users", destroy);
};

export default userRoutes;
