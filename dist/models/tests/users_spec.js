"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../user");
const server_1 = __importDefault(require("../../server"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const user = new user_1.UserModel();
const request = (0, supertest_1.default)(server_1.default);
const newUser = {
    firstName: "John",
    lastName: "Doe",
    userName: "johndoe",
    password: "password123",
};
const token = jsonwebtoken_1.default.sign(newUser, process.env.TOKEN_SECRET);
describe("User Model Methods", () => {
    it("should have an index method", () => {
        expect(user.index).toBeDefined();
    });
    it("should have a show method", () => {
        expect(user.show).toBeDefined();
    });
    it("should have a create method", () => {
        expect(user.create).toBeDefined();
    });
    it("should have a delete method", () => {
        expect(user.delete).toBeDefined();
    });
    it("should have a update method", () => {
        expect(user.update).toBeDefined();
    });
    it("create method should add a User", async () => {
        const result = await user.create(newUser);
        expect(result).toEqual({
            id: 1,
            firstname: "John",
            lastname: "Doe",
            username: "johndoe",
        });
    });
    it("index method should return a list of users", async () => {
        const result = await user.index();
        expect(result).toEqual([
            {
                id: 1,
                firstname: "John",
                lastname: "Doe",
                username: "johndoe",
            },
        ]);
    });
    it("show method should return the correct User", async () => {
        const result = await user.show(1);
        expect(result).toEqual({
            id: 1,
            firstname: "John",
            lastname: "Doe",
            username: "johndoe",
        });
    });
    it("update method should update the User", async () => {
        const result = await user.update({
            id: 1,
            firstName: "test update",
            lastName: "test update",
            userName: "test update",
            password: "password5212",
        });
        expect(result).toEqual({
            id: 1,
            firstname: "test update",
            lastname: "test update",
            username: "test update",
        });
    });
    it("delete method should remove the User", async () => {
        user.delete(1);
        const result = await user.index();
        expect(result).toEqual([]);
    });
    describe("Testing Users Endpoints.", () => {
        it("GET /users without providing a token", async () => {
            const response = await request.get("/users");
            expect(response.status).toBe(401);
        });
        it("GET /users with providing a token", async () => {
            const response = await request.get("/users").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
        it("GET /users/:id without providing a token", async () => {
            const response = await request.get("/users/1");
            expect(response.status).toBe(401);
        });
        it("GET /users/:id with providing a token", async () => {
            const response = await request.get("/users/1").set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
        it("POST /users", async () => {
            const response = await request.post("/users").send({
                firstName: "John",
                lastName: "Doe",
                userName: "johndoe",
                password: "password123",
            });
            expect(response.status).toBe(200);
        });
        it("PUT /user without providing a token", async () => {
            const response = await request.put("/users").send({
                id: 1,
                firstName: "John",
                lastName: "Doe",
                userName: "johndoe",
                password: "password123",
            });
            expect(response.status).toBe(401);
        });
        it("PUT /users with providing a token", async () => {
            const response = await request
                .put("/users")
                .send({
                id: 1,
                firstName: "update test",
                lastName: "update test",
                password: "update_test",
            })
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
        it("DELETE /user without providing a token", async () => {
            const response = await request.delete("/users").send({
                id: 1,
            });
            expect(response.status).toBe(401);
        });
        it("DELETE /user with providing a token", async () => {
            const response = await request
                .delete("/users")
                .send({
                id: 1,
            })
                .set("Authorization", `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
    });
});
