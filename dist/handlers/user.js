"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAuthToken_1 = require("../middleware/verifyAuthToken");
const user_1 = require("../models/user");
const storeUser = new user_1.UserModel();
const index = async (_req, res) => {
    try {
        const users = await storeUser.index();
        return res.send(users);
    }
    catch (err) {
        console.log(err);
        res.status(401).json(err);
    }
    const users = await storeUser.index();
    res.json(users);
};
const show = async (req, res) => {
    try {
        const user = await storeUser.show(+req.params.id);
        return res.send(user);
    }
    catch (err) {
        console.log(err);
        res.status(401).json(err);
    }
};
const create = async (req, res) => {
    try {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: req.body.password,
            id: undefined,
        };
        const newUser = await storeUser.create(user);
        var token = jsonwebtoken_1.default.sign(newUser, process.env.TOKEN_SECRET);
        res.json(token);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const destroy = async (req, res) => {
    try {
        const deleted = await storeUser.delete(req.body.id);
        return res.send(deleted);
    }
    catch (err) {
        console.log(err);
        res.status(401).json(err);
        return;
    }
};
const update = async (req, res) => {
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
const userRoutes = (app) => {
    app.get("/users", verifyAuthToken_1.verifyAuthToken, index);
    app.get("/users/:id", verifyAuthToken_1.verifyAuthToken, show);
    app.post("/users", create);
    app.put("/users", verifyAuthToken_1.verifyAuthToken, update);
    app.delete("/users", verifyAuthToken_1.verifyAuthToken, destroy);
};
exports.default = userRoutes;
