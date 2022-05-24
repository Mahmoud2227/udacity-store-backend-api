import client from "../database";
import bcrypt from "bcrypt";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
}

const { BCRYPT_PASSWORD: pepper, SALT_ROUNDS: saltRounds } = process.env;

export class UserModel {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const sql = "SELECT id, userName, firstName, lastName FROM users";

            const result = await conn.query(sql);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }

    async show(id: number): Promise<User> {
        try {
            const sql = "SELECT id, userName, firstName, lastName FROM users WHERE id=($1)";

            const conn = await client.connect();

            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`);
        }
    }

    async create(u: User): Promise<User> {
        try {
            const sql =
                "INSERT INTO users (firstName, LastName, userName, password) VALUES($1, $2, $3, $4) RETURNING id, userName, firstName, lastName";

            const conn = await client.connect();

            const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds as string));

            const result = await conn.query(sql, [u.firstName, u.lastName, u.userName, hash]);

            const user = result.rows[0];

            conn.release();

            return user;
        } catch (err) {
            throw new Error(`Could not add new User. Error: ${err}`);
        }
    }

    async delete(id: number): Promise<User> {
        try {
            const sql =
                "DELETE FROM users WHERE id=($1) RETURNING id, userName, firstName, lastName";

            const conn = await client.connect();

            const result = await conn.query(sql, [id]);

            const user = result.rows[0];

            conn.release();

            return user;
        } catch (err) {
            throw new Error(`Could not delete User ${id}. Error: ${err}`);
        }
    }

    async update(u: User) {
        try {
            const sql =
                "UPDATE users SET userName=($2), firstName=($3), lastName=($4), password=($5)  WHERE id=($1) RETURNING id, userName, firstName, lastName";

            const conn = await client.connect();

            const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds as string));

            const result = await conn.query(sql, [u.id, u.userName, u.firstName, u.lastName, hash]);

            const user = result.rows[0];

            conn.release();

            return user;
        } catch (err) {
            throw new Error(`Could not update User ${u.id}. Error: ${err}`);
        }
    }
}
