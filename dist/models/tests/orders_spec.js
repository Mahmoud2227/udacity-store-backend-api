"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../order");
const server_1 = __importDefault(require("../../server"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const order = new order_1.OrderModel();
const request = (0, supertest_1.default)(server_1.default);
const newUser = {
    firstName: "John",
    lastName: "Doe",
    userName: "johndoe",
    password: "password123",
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
    //     it("create method should add a Order", async () => {
    //         const result = await order.create({
    //             status: "pending",
    //             user_id: "1",
    //         } as Order);
    //         expect(result).toEqual({
    //             id: 1,
    //             status: "pending",
    //             user_id: "1",
    //         });
    //     });
    //     it("index method should return a list of orders", async () => {
    //         const result = await order.index();
    //         expect(result).toEqual([
    //             {
    //                 id: 1,
    //                 status: "pending",
    //                 user_id: "1",
    //             },
    //         ]);
    //     });
    //     it("delete method should remove the Order", async () => {
    //         await order.delete(1);
    //         const result = await order.index();
    //         expect(result).toEqual([]);
    //     });
});
describe("Testing order Endpoints.", () => {
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
            user_id: 1,
        });
        expect(response.status).toBe(401);
    });
    // it("POST /orders with providing a token", async () => {
    //     const response = await request
    //         .post("/orders")
    //         .send({
    //             status: "testing order",
    //             user_id: 1,
    //         })
    //         .set("Authorization", `Bearer ${token}`);
    //     expect(response.status).toBe(200);
    // });
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
