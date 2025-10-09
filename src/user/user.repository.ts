/* eslint-disable prettier/prettier */
import { CreateUserDto, userDto } from "./user.dto";
import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

@Injectable()
export class UserRepository {
  constructor(private readonly dbService: DbService) {}

  async createUser(createUserDto: CreateUserDto): Promise<userDto|void> {
    const { name, email, password } = createUserDto;
    const sql = `INSERT INTO user (name, email, password, salt) VALUES ('${name}', '${email}', '${password}', 'salt')`;

    await this.dbService.getPool().query(sql);
  }
}
