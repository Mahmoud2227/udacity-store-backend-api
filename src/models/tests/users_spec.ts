import { UserModel } from "../user";
import app from "../../server";
import jwt from "jsonwebtoken";
import supertest from "supertest";

const user = new UserModel();

const request = supertest(app);

const newUser = {
    firstName: "John",
    lastName: "Doe",
    userName: "johndoe",
    password: "password123",
};

const token = jwt.sign(newUser, process.env.TOKEN_SECRET as string);

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
//     it("create method should add a User", async () => {
//         const result: UserReturnType = await user.create({
//             firstName: "John",
//             lastName: "Doe",
//             userName: "jon123",
//             password: "123456",
//         });
//         console.log(result);
//         const token: string = process.env.TEST_TOKEN as string;
//         // @ts-ignore
//         expect(result).toEqual({
//             id: 1,
//             firstname: "John",
//             lastname: "Doe",
//             username: "jon123",
//             password: "$2b$10$EKeK2Aq8KUOBRaApHb6Rn.1FXMcfpqZd1H9H1scKeQMzBignZF5ma",
//         });
//     });

//     it("index method should return a list of users", async () => {
//         const result: UserReturnType[] = await user.index();
//         expect(result).toEqual([
//             {
//                 id: 1,
//                 firstname: "John",
//                 lastname: "Doe",
//                 username: "jon123",
//                 password: "$2b$10$EKeK2Aq8KUOBRaApHb6Rn.1FXMcfpqZd1H9H1scKeQMzBignZF5ma",
//             },
//         ]);
//     });

//     it("show method should return the correct User", async () => {
//         const result: UserReturnType = await user.show(1);
//         expect(result).toEqual({
//             id: 1,
//             firstname: "John",
//             lastname: "Doe",
//             username: "jon123",
//             password: "$2b$10$EKeK2Aq8KUOBRaApHb6Rn.1FXMcfpqZd1H9H1scKeQMzBignZF5ma",
//         });
//     });

//     it("delete method should remove the User", async () => {
//         user.delete(1);
//         const result = await user.index();

//         expect(result).toEqual([]);
//     });

//     it("authenticate method should return the correct User", async () => {
//         const result = await user.authenticate("jon123", "123456");
//         // @ts-ignore
//         expect(result).toEqual({ token: process.env.TEST_TOKEN as string });
//     });
// });
