/* eslint-disable prettier/prettier */

import * as bcrypt from "bcrypt";

export function hashPassword(password: string, salt: string): string {
    // Using bcrypt for secure password hashing
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}