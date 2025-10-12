/* eslint-disable prettier/prettier */

import { createHash } from "node:crypto";

export function hashPassword(password: string, salt: string): string {

    const hash = createHash("sha256").update(password + salt).digest("hex");
    return hash;
}