import client from "../database";

export interface Order {
    id: number;
    status: string;
    user_id: string;
}

export class OrderModel {
    async index(): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM orders";

            const result = await conn.query(sql);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`);
        }
    }

    async show(id: number): Promise<Order> {
        try {
            const sql = "SELECT * FROM orders WHERE id=($1)";

            const conn = await client.connect();

            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`);
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const sql = "INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *";

            const conn = await client.connect();

            const result = await conn.query(sql, [o.status, o.user_id]);

            const order = result.rows[0];

            conn.release();

            return order;
        } catch (err) {
            throw new Error(`Could not add new Order. Error: ${err}`);
        }
    }

    async delete(id: number): Promise<Order> {
        try {
            const sql = "DELETE FROM orders WHERE id=($1) RETURNING *";

            const conn = await client.connect();

            const result = await conn.query(sql, [id]);

            const order = result.rows[0];

            conn.release();

            return order;
        } catch (err) {
            throw new Error(`Could not delete Order ${id}. Error: ${err}`);
        }
    }

    async update(id: number, status: string): Promise<Order> {
        try {
            const connection = await client.connect();
            const sql = "UPDATE orders SET status=($1) WHERE id=($2) RETURNING *";
            const result = await connection.query(sql, [status, id]);
            connection.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not update Order ${id}. Error: ${err}`);
        }
    }

    async addProduct(quantity: number, order_id: string, product_id: string): Promise<Order> {
        // get order to see if it is open
        try {
            const sql =
                "INSERT INTO orders_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *";

            const conn = await client.connect();

            const result = await conn.query(sql, [quantity, order_id, product_id]);

            const order = result.rows[0];
            return order;
        } catch (err) {
            throw new Error(`${err}`);
        }
    }
}
