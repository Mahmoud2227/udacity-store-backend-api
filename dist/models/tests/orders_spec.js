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
    it("GET /order/:id without a token ", async () => {
        const response = await request.get("/orders/1");
        expect(response.status).toBe(401);
    });
    it("GET /order/:id with a token ", async () => {
        const response = await request.get("/orders/1").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it("POST /order without a token", async () => {
        const response = await request.post("/orders").send({
            status: "testing order",
            user_id: 1,
        });
        expect(response.status).toBe(401);
    });
    it("POST /order with providing a token", async () => {
        const response = await request
            .post("/orders")
            .send({
            status: "testing order",
            user_id: 1,
        })
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it("PUT /order without providing a token", async () => {
        const response = await request.put("/orders").send({
            id: 1,
            status: "updated",
            user_id: 1,
        });
        expect(response.status).toBe(401);
    });
    it("PUT /order with providing a token", async () => {
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
// import { OrderProduct, OrderReturnType, OrderModel, Order } from "../order";
// const order: OrderModel = new OrderModel();
// describe("order Model", () => {
//     it("should have an index method", () => {
//         expect(order.index).toBeDefined();
//     });
//     it("should have a show method", () => {
//         expect(order.show).toBeDefined();
//     });
//     it("should have a create method", () => {
//         expect(order.create).toBeDefined();
//     });
//     it("create method should add a order", async () => {
//         const result = await order.create({
//             status: "pending",
//             user_id: "1",
//         });
//         const token: string = process.env.TEST_TOKEN as string;
//         // @ts-ignore
//         expect(result).toEqual({
//             id: 1,
//             status: "pending",
//             user_id: "1",
//         });
//     });
//     it("index method should return a list of orders", async () => {
//         const result: OrderReturnType[] = await order.index();
//         expect(result).toEqual([
//             {
//                 id: 1,
//                 status: "pending",
//                 user_id: "1",
//             },
//         ]);
//     });
//     it("show method should return the correct order", async () => {
//         const result: OrderReturnType = await order.show(1);
//         expect(result).toEqual({
//             id: 1,
//             status: "open",
//             user_id: "1",
//         });
//     });
//     it("show method should add a product to the order", async () => {
//         // @ts-ignore
//         const result: OrderProduct = await order.addProduct(5, "1", "1");
//         expect(result).toEqual({
//             id: 1,
//             quantity: 5,
//             product_id: "1",
//             order_id: "1",
//         });
//     });
// });
