import { ProductReturnType, ClothesStore } from "../product";

const store: ClothesStore = new ClothesStore();

describe("Product Model", () => {
    it("should have an index method", () => {
        expect(store.index).toBeDefined();
    });

    it("should have a show method", () => {
        expect(store.show).toBeDefined();
    });

    it("should have a create method", () => {
        expect(store.create).toBeDefined();
    });

    it("should have a delete method", () => {
        expect(store.delete).toBeDefined();
    });

    it("create method should add a Product", async () => {
        const result: ProductReturnType = await store.create({
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
        const result: ProductReturnType[] = await store.index();
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
        const result: ProductReturnType = await store.show(1);
        expect(result).toEqual({
            id: 1,
            name: "Gildan Adult Sweatshirt",
            category: "men",
            price: 15,
            description: "soft comfort adult sweatshirt",
        });
    });

    it("delete method should remove the Product", async () => {
        store.delete(1);
        const result = await store.index();

        expect(result).toEqual([]);
    });
});
