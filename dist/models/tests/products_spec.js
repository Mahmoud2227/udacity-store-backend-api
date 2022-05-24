"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../product");
const server_1 = __importDefault(require("../../server"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const product = new product_1.ProductModel();
const request = (0, supertest_1.default)(server_1.default);
const newUser = {
    firstName: "John",
    lastName: "Doe",
    userName: "johndoe",
    password: "password123",
};
const token = jsonwebtoken_1.default.sign(newUser, process.env.TOKEN_SECRET);
describe("Product Model Methods", () => {
    it("should have an index method", () => {
        expect(product.index).toBeDefined();
    });
    it("should have a show method", () => {
        expect(product.show).toBeDefined();
    });
    it("should have a create method", () => {
        expect(product.create).toBeDefined();
    });
    it("should have an update method", () => {
        expect(product.update).toBeDefined();
    });
    it("should have a delete method", () => {
        expect(product.delete).toBeDefined();
    });
});
it("create method should add a Product", async () => {
    const result = await product.create({
        name: "Gildan Adult Sweatshirt",
        category: "men",
        price: 15,
        description: "soft comfort adult sweatshirt",
    });
    expect(result).toEqual({
        id: 1,
        name: "Gildan Adult Sweatshirt",
        category: "men",
        price: 15,
        description: "soft comfort adult sweatshirt",
    });
});
it("index method should return a list of products", async () => {
    const result = await product.index();
    expect(result).toEqual([
        {
            id: 1,
            name: "Gildan Adult Sweatshirt",
            category: "men",
            price: 15,
            description: "soft comfort adult sweatshirt",
        },
    ]);
});
it("show method should return the correct Product", async () => {
    const result = await product.show(1);
    expect(result).toEqual({
        id: 1,
        name: "Gildan Adult Sweatshirt",
        category: "men",
        price: 15,
        description: "soft comfort adult sweatshirt",
    });
});
it("update method should return the updated Product", async () => {
    const result = await product.update({
        id: 1,
        name: "test update",
        category: "test update",
        price: 30,
        description: "test update",
    });
    expect(result).toEqual({
        id: 1,
        name: "test update",
        category: "test update",
        price: 30,
        description: "test update",
    });
});
it("delete method should remove the Product", async () => {
    await product.delete(1);
    const result = await product.index();
    expect(result).toEqual([]);
});
describe("Testing products Endpoints.", () => {
    it("GET /products", async () => {
        const response = await request.get("/products");
        expect(response.status).toBe(200);
    });
    it("GET /products/:id ", async () => {
        const response = await request.get("/products/1");
        expect(response.status).toBe(200);
    });
    it("POST /products without providing a token", async () => {
        const response = await request.post("/products").send({
            name: "testing product",
            category: "testing category",
            price: 503,
        });
        expect(response.status).toBe(401);
    });
    it("POST /products with a token", async () => {
        const response = await request
            .post("/products")
            .send({
            name: "testing product",
            category: "testing category",
            price: 503,
        })
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it("PUT /products without providing a token", async () => {
        const response = await request.put("/products").send({
            id: 1,
            name: "testing product updated",
            category: "testing category updated",
            price: 445,
        });
        expect(response.status).toBe(401);
    });
    it("PUT /products with providing a token", async () => {
        const response = await request
            .put("/products")
            .send({
            id: 1,
            name: "testing product updated",
            category: "testing category updated",
            price: 445,
        })
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
    it("DELETE /products without providing a token", async () => {
        const response = await request.delete("/products").send({
            id: 1,
        });
        expect(response.status).toBe(401);
    });
    it("DELETE /products with providing a token", async () => {
        const response = await request
            .delete("/products")
            .send({
            id: 1,
        })
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
});
