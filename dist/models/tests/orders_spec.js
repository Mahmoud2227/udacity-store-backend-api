"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../order");
const user_1 = require("../user");
const product_1 = require("../product");
const database_1 = __importDefault(require("../../database"));
const server_1 = __importDefault(require("../../server"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const order = new order_1.OrderModel();
const user = new user_1.UserModel();
const product = new product_1.ProductModel();
const request = (0, supertest_1.default)(server_1.default);
const newUser = {
    firstName: "John",
    lastName: "Doe",
    userName: "johndoe",
    password: "password123",
};
const newProduct = {
    name: "Gildan Adult Sweatshirt",
    category: "men",
    price: 15,
    description: "soft comfort adult sweatshirt",
};
const token = jsonwebtoken_1.default.sign(newUser, process.env.TOKEN_SECRET);
describe("Order Model Methods", () => {
    it("should have an index method", () => {
        expect(order.index).toBeDefined();
    });
    it("should have a show method", () => {
        expect(order.show).toBeDefined();
    });
    it("should have a create method", () => {
        expect(order.create).toBeDefined();
    });
    it("should have a update method", () => {
        expect(order.update).toBeDefined();
    });
    it("A method that delete an order", () => {
        expect(order.delete).toBeDefined();
    });
    it("should have a add product to order method", () => {
        expect(order.addProduct).toBeDefined();
    });
    beforeAll(async () => {
        await user.create(newUser);
        await product.create(newProduct);
    });
    afterAll(async () => {
        const conn = await database_1.default.connect();
        const sql = "DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;\nDELETE FROM products;\n ALTER SEQUENCE orders_id_seq RESTART WITH 1;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;\n";
        await conn.query(sql);
        conn.release();
    });
    it("create method should add a Order", async () => {
        const result = await order.create({
            status: "pending",
            user_id: "1",
        });
        expect(result).toEqual({
            id: 1,
            status: "pending",
            user_id: "1",
        });
    });
    it("index method should return a list of orders", async () => {
        const result = await order.index();
        expect(result).toEqual([
            {
                id: 1,
                status: "pending",
                user_id: "1",
            },
        ]);
    });
    it("show method should return the correct order", async () => {
        const result = await order.show(1);
        expect(result).toEqual({
            id: 1,
            status: "pending",
            user_id: "1",
        });
    });
    it("update method should return the updated order", async () => {
        const result = await order.update(1, "shipped");
        expect(result).toEqual({
            id: 1,
            status: "shipped",
            user_id: "1",
        });
    });
    it("addProduct method should add a product to the order", async () => {
        const result = await order.addProduct(18, "1", "1");
        expect(result).toEqual({
            id: 1,
            quantity: 18,
            product_id: "1",
            order_id: "1",
        });
    });
    it("delete method should remove the Order", async () => {
        await order.delete(1);
        const result = await order.index();
        expect(result).toEqual([]);
    });
});
describe("Testing order Endpoints.", () => {
    beforeAll(async () => {
        const res = await user.create(newUser);
        await product.create(newProduct);
    });
    afterAll(async () => {
        const conn = await database_1.default.connect();
        const sql = "DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;\nDELETE FROM products;\n ALTER SEQUENCE orders_id_seq RESTART WITH 1;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;\n";
        await conn.query(sql);
        conn.release();
    });
    it("GET /orders without a token", async () => {
        const response = await request.get("/orders");
        expect(response.status).toBe(401);
    });
    it("GET /orders with a token", async () => {
        const response = await request.get("/orders").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it("GET /orders/:id without a token ", async () => {
        const response = await request.get("/orders/1");
        expect(response.status).toBe(401);
    });
    it("GET /orders/:id with a token ", async () => {
        const response = await request.get("/orders/1").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it("POST /orders without a token", async () => {
        const response = await request.post("/orders").send({
            status: "testing order",
            user_id: 2,
        });
        expect(response.status).toBe(401);
    });
    it("POST /orders with providing a token", async () => {
        const response = await request
            .post("/orders")
            .send({
            status: "testing order",
            user_id: 1,
        })
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it("PUT /orders without providing a token", async () => {
        const response = await request.put("/orders").send({
            id: 1,
            status: "updated",
            user_id: 1,
        });
        expect(response.status).toBe(401);
    });
    it("PUT /orders with providing a token", async () => {
        const response = await request
            .put("/orders")
            .send({
            id: 1,
            status: "updated",
            user_id: 1,
        })
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it("DELETE /orders without providing a token", async () => {
        const response = await request.delete("/orders").send({
            id: 1,
        });
        expect(response.status).toBe(401);
    });
    it("DELETE /orders with providing a token", async () => {
        const response = await request
            .delete("/orders")
            .send({
            id: 1,
        })
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
});
