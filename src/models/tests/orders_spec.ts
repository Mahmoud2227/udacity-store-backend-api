import { OrderProduct, OrderReturnType, OrderModel, Order } from "../order";

const order: OrderModel = new OrderModel();

describe("order Model", () => {
    it("should have an index method", () => {
        expect(order.index).toBeDefined();
    });

    it("should have a show method", () => {
        expect(order.show).toBeDefined();
    });

    it("should have a create method", () => {
        expect(order.create).toBeDefined();
    });

    it("create method should add a order", async () => {
        const result = await order.create({
            status: "open",
            user_id: 1,
        });
        const token: string = process.env.TEST_TOKEN as string;
        // @ts-ignore
        expect(result).toEqual(token);
    });

    it("index method should return a list of orders", async () => {
        const result: OrderReturnType[] = await order.index();
        expect(result).toEqual([
            {
                id: 1,
                status: "open",
                user_id: 1,
            },
        ]);
    });

    it("show method should return the correct order", async () => {
        const result: OrderReturnType = await order.show(1);
        expect(result).toEqual({
            id: 1,
            status: "open",
            user_id: 1,
        });
    });

    it("show method should add a product to the order", async () => {
        // @ts-ignore
        const result: OrderProduct = await order.addProduct(5, "1", "1");
        expect(result).toEqual({
            id: 1,
            quantity: 5,
            product_id: "1",
            order_id: "1",
        });
    });
});
