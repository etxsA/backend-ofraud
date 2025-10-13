/* eslint-disable prettier/prettier */
import { CreateUserDto, UserResponseDto} from "./user.dto";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { UserModel } from "./user.model";

@Injectable()
export class UserRepository {
  constructor(private readonly dbService: DbService) {}

  async createUser(createUserDto: CreateUserDto, salt: string): Promise<UserResponseDto> {
    const { name, email, password } = createUserDto;
    const sql = `INSERT INTO user (name, email, password, salt) VALUES ('${name}', '${email}', '${password}', '${salt}')`;
      try {
      const [rows] = await this.dbService.getPool().query(sql);
      const result = rows as { insertId?: number };
      
      if (!result) {
        throw new InternalServerErrorException('User could not be created');
      }

    return {
        id: result.insertId,
        name,
        email
      } as UserResponseDto;

  } catch (error) {

    const code = (error as { code?: string }).code;
    const message = (error as { message?: string }).message;

    if (code === 'ER_DUP_ENTRY') {
      throw new InternalServerErrorException('Email already in use');
    }
    throw new InternalServerErrorException(message);
  }
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
