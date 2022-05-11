import client from "../database";

export interface Product {
    name: string;
    category: string;
    price: number;
    description: string;
}

export interface ProductReturnType {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string;
}

export class ClothesStore {
    async index(): Promise<ProductReturnType[]> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM products";

            const result = await conn.query(sql);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }

    async show(id: number): Promise<ProductReturnType> {
        try {
            const sql = "SELECT * FROM products WHERE id=($1)";

            const conn = await client.connect();

            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err}`);
        }
    }

    async create(p: Product): Promise<ProductReturnType> {
        try {
            const sql =
                "INSERT INTO products (name, category, price, description) VALUES($1, $2, $3, $4) RETURNING *";

            const conn = await client.connect();

            const result = await conn.query(sql, [p.name, p.category, p.price, p.description]);

            const product = result.rows[0];

            conn.release();

            return product;
        } catch (err) {
            throw new Error(`Could not add new Product. Error: ${err}`);
        }
    }

    async delete(id: number): Promise<ProductReturnType> {
        try {
            const sql = "DELETE FROM products WHERE id=($1)";

            const conn = await client.connect();

            const result = await conn.query(sql, [id]);

            const product = result.rows[0];

            conn.release();

            return product;
        } catch (err) {
            throw new Error(`Could not delete Product ${id}. Error: ${err}`);
        }
    }
}
