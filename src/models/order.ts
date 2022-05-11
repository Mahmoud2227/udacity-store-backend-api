import client from "../database";

export interface Order {
    status: string;
    user_id: number;
}

export interface OrderReturnType {
    id: number;
    status: string;
    user_id: number;
}

export interface OrderProduct {
    id: number;
    quantity: number;
    product_id: string;
    order_id: string;
}

export class OrderModel {
    async index(): Promise<OrderReturnType[]> {
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

    async show(id: number): Promise<OrderReturnType> {
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

    async create(o: Order): Promise<OrderReturnType> {
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

    async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {
        // get order to see if it is open
        try {
            const ordersql = "SELECT * FROM orders WHERE id=($1)";

            const conn = await client.connect();

            const result = await conn.query(ordersql, [orderId]);

            const order = result.rows[0];

            if (order.status !== "open") {
                throw new Error(
                    `Could not add product ${productId} to order ${orderId} because order status is ${order.status}`
                );
            }

            conn.release();
        } catch (err) {
            throw new Error(`${err}`);
        }

        try {
            const sql =
                "INSERT INTO orders_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *";

            const conn = await client.connect();

            const result = await conn.query(sql, [quantity, orderId, productId]);

            const order = result.rows[0];

            conn.release();

            return order;
        } catch (err) {
            throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`);
        }
    }
}
