/*eslint-disable prettier/prettier*/

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import {Pool, createPool} from "mysql2/promise";

@Injectable()
export class DbService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    onModuleInit() {
        this.pool = createPool ({
            host: process.env.DB_URL ?? 'localhost',
            user: 'access1',
            password: 'access1-p',
            database: 'oFraud'
        }) 
    }

    onModuleDestroy() {
        void this.pool.end();
    }

    getPool(): Pool {
        return this.pool;
    }
}
