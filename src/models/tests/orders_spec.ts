import { Order, OrderModel } from "../order";
import { User, UserModel } from "../user";
import { Product, ProductModel } from "../product";
import client from "../../database";
import app from "../../server";
import jwt from "jsonwebtoken";
import supertest from "supertest";

const order = new OrderModel();
const user = new UserModel();
const product = new ProductModel();

const request = supertest(app);

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

    beforeAll(async () => {
        await user.create(newUser as User);

        await product.create(newProduct as Product);
    });

    afterAll(async () => {
        const conn = await client.connect();
        const sql =
            "DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;\nDELETE FROM products;\n ALTER SEQUENCE orders_id_seq RESTART WITH 1;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;\n";
        await conn.query(sql);
        conn.release();
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

    it("addProduct method should add a product to the order", async () => {
        const result = await order.addProduct(18, "1", "1");
        expect(result).toEqual({
            id: 1,
            quantity: 18,
            product_id: "1",
            order_id: "1",
        } as unknown as Order);
    });

    it("delete method should remove the Order", async () => {
        await order.delete(1);
        const result = await order.index();

        expect(result).toEqual([]);
    });
});

describe("Testing order Endpoints.", () => {
    beforeAll(async () => {
        const res = await user.create(newUser as User);
        await product.create(newProduct as Product);
    });

    afterAll(async () => {
        const conn = await client.connect();
        const sql =
            "DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;\nDELETE FROM products;\n ALTER SEQUENCE orders_id_seq RESTART WITH 1;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;\n";
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
