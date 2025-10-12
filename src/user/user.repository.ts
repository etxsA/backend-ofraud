/* eslint-disable prettier/prettier */
import { CreateUserDto} from "./user.dto";
import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { UserModel } from "./user.model";

@Injectable()
export class UserRepository {
  constructor(private readonly dbService: DbService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserModel> {
    const { name, email, password } = createUserDto;
    const sql = `INSERT INTO user (name, email, password, salt) VALUES (${name}, ${email}, ${password}, ${"salt"})`;
  
    const [rows] = await this.dbService.getPool().query(sql);
    const result = rows as { insertId: number }[];
    
    console.log(result);

    return new UserModel(1, "name", "email", "password");
  }

  async findByEmail(email: string): Promise<UserModel> {

    const sql = `SELECT * FROM user WHERE email = '${email}' LIMIT 1`;
    const [rows] = await this.dbService.getPool().query(sql);
    const users = rows as UserModel[];
    return users[0];
  }

  async findById(id: number): Promise<UserModel> {
    const sql = `SELECT * FROM user WHERE id = ${id} LIMIT 1`;
    const [rows] = await this.dbService.getPool().query(sql);
    const users = rows as UserModel[];
    return users[0];
  }
}
