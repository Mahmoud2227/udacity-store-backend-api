import { UserReturnType, UserModel } from "../user";

const user: UserModel = new UserModel();

describe("User Model", () => {
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
    it("should have a authenticate method", () => {
        expect(user.authenticate).toBeDefined();
    });

    it("create method should add a User", async () => {
        const result = await user.create({
            firstName: "John",
            lastName: "Doe",
            userName: "jon123",
            password: "123456",
        });
        const token: string = process.env.TEST_TOKEN as string;
        // @ts-ignore
        expect(result).toEqual(token);
    });

    it("index method should return a list of users", async () => {
        const result: UserReturnType[] = await user.index();
        expect(result).toEqual([
            {
                id: 1,
                firstName: "John",
                lastName: "Doe",
                userName: "jon123",
                password: "123456",
            },
        ]);
    });

    it("show method should return the correct User", async () => {
        const result: UserReturnType = await user.show(1);
        expect(result).toEqual({
            id: 1,
            firstName: "John",
            lastName: "Doe",
            userName: "jon123",
            password: "123456",
        });
    });

    it("delete method should remove the User", async () => {
        user.delete(1);
        const result = await user.index();

        expect(result).toEqual([]);
    });

    it("authenticate method should return the correct User", async () => {
        const result = await user.authenticate("jon123", "123456");
        // @ts-ignore
        expect(result).toEqual({ token: process.env.TEST_TOKEN as string });
    });
});
