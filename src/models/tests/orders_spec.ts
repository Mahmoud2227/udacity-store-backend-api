import { Order, OrderModel } from "../order";
import app from "../../server";
import jwt from "jsonwebtoken";
import supertest from "supertest";

const order = new OrderModel();

const request = supertest(app);

const newUser = {
    firstName: "John",
    lastName: "Doe",
    userName: "johndoe",
    password: "password123",
};

const token = jwt.sign(newUser, process.env.TOKEN_SECRET as string);

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

    it("create method should add a Order", async () => {
        const result = await order.create({
            status: "pending",
            user_id: "1",
        } as Order);
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

    it("delete method should remove the Order", async () => {
        await order.delete(1);
        const result = await order.index();

        expect(result).toEqual([]);
    });

    it("addProduct method should add a product to the order", async () => {
        const result = await order.addProduct(18, "1", "1");
        expect(result).toEqual({
            id: 1,
            quantity: 18,
            product_id: 1,
            order_id: 1,
        } as unknown as Order);
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
