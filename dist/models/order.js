"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const database_1 = __importDefault(require("../database"));
class OrderModel {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM orders";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get orders. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = "SELECT * FROM orders WHERE id=($1)";
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`);
        }
    }
    async create(o) {
        try {
            const sql = "INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *";
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [o.status, o.user_id]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not add new Order. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const sql1 = "DELETE FROM orders_products WHERE id=($1)";
            const sql2 = "DELETE FROM orders WHERE id=($1) RETURNING *";
            const conn = await database_1.default.connect();
            await conn.query(sql1, [id]);
            const result = await conn.query(sql2, [id]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not delete Order ${id}. Error: ${err}`);
        }
    }
    async update(id, status) {
        try {
            const connection = await database_1.default.connect();
            const sql = "UPDATE orders SET status=($1) WHERE id=($2) RETURNING *";
            const result = await connection.query(sql, [status, id]);
            connection.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not update Order ${id}. Error: ${err}`);
        }
    }
    async addProduct(quantity, order_id, product_id) {
        // get order to see if it is open
        try {
            const sql = "INSERT INTO orders_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *";
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [quantity, order_id, product_id]);
            const order = result.rows[0];
            return order;
        }
        catch (err) {
            throw new Error(`${err}`);
        }
    }
}
exports.OrderModel = OrderModel;
