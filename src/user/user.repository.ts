/* eslint-disable prettier/prettier */
import { CreateUserDto, DeleteUserResponseDto, UpdateUserDto, UpdateUserResponseDto, UserResponseDto} from "./user.dto";
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { UserModel } from "./entities/user.model";
import { UserProfile } from "src/auth/tokens.interface";

@Injectable()
export class UserRepository {
  constructor(private readonly dbService: DbService) {}

  async createUser(createUserDto: CreateUserDto, salt: string): Promise<UserResponseDto> {
    const { name, email, password } = createUserDto;
    const sql = "INSERT INTO user (name, email, password, salt, creation_date) VALUES (?, ?, ?, ?, ?)";
    const values = [name, email, password, salt, new Date().toISOString().slice(0, 10)];
    try {
      const [rows] = await this.dbService.getPool().query(sql, values);
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

  async createAdmin(createUserDto: CreateUserDto, salt: string): Promise<UserResponseDto> {
    const { name, email, password } = createUserDto;
    const sql = "INSERT INTO user (name, email, password, salt, admin, creation_date) VALUES (?, ?, ?, ?, 1, ?)";
    const values = [name, email, password, salt, new Date().toISOString().slice(0, 10)];
    try {
      const [rows] = await this.dbService.getPool().query(sql, values);
      const result = rows as { insertId?: number };
      
      if (!result) {
        throw new InternalServerErrorException('Admin could not be created');
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

    const sql = "SELECT * FROM user WHERE email = ? AND deleted_at IS NULL LIMIT 1";
    const [rows] = await this.dbService.getPool().query(sql, [email]);
    const users = rows as UserModel[];
    return users[0];
  }

  async findById(id: number): Promise<UserModel> {
    const sql = "SELECT * FROM user WHERE id = ? AND deleted_at IS NULL LIMIT 1";
    const [rows] = await this.dbService.getPool().query(sql, [id]);
    const users = rows as UserModel[];
    return users[0];
  }

  async findAll(): Promise<UserResponseDto[]> {
    const sql = `SELECT id, name, email, profile_pic_url, admin, creation_date FROM user WHERE deleted_at IS NULL`;
    const [rows] = await this.dbService.getPool().query(sql);
    return rows as UserResponseDto[];
  }

  async findPaginated(page: number, limit: number): Promise<UserResponseDto[]> {
    const offset = (page - 1) * limit;
    const sql = `SELECT id, name, email, profile_pic_url, admin, creation_date FROM user WHERE deleted_at IS NULL LIMIT ? OFFSET ?`;
    const [rows] = await this.dbService.getPool().query(sql, [limit, offset]);
    return rows as UserResponseDto[];
  }

  async countAll(): Promise<{ count: number }> {
    const sql = `SELECT COUNT(*) as count FROM user WHERE deleted_at IS NULL`;
    const [rows] = await this.dbService.getPool().query(sql);
    const countResult = rows as { count: number }[];
    return countResult[0];
  }

  async updateUser(updateUserDto: UpdateUserDto, profile: UserProfile): Promise<UpdateUserResponseDto> {

    // Ensure user exists and has permission to update
    const user = await this.findById(updateUserDto.id)
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (profile.id !== user.id && !profile.admin) {
        throw new ForbiddenException('You do not have permission to update this user');
      }
    
    
    // Build the SQL update query dynamically based on provided fields, using parameterized queries for safety
    const fields: string[] = [];
    const values: any[] = [];
    if (updateUserDto.name) {
      fields.push(`name = ?`);
      values.push(updateUserDto.name);
    }
    if (updateUserDto.email) {
      fields.push(`email = ?`);
      values.push(updateUserDto.email);
    }
    if (updateUserDto.password) {
      fields.push(`password = ?`);
      values.push(updateUserDto.password);
    }
    if (updateUserDto.profile_pic_url) {
      fields.push(`profile_pic_url = ?`);
      values.push(updateUserDto.profile_pic_url);
    }

    // If no fields to update, throw an error
    if (fields.length === 0) {
      throw new InternalServerErrorException('No fields to update');
    }

    // Add the id parameter for WHERE clause
    const sql = `UPDATE user SET ${fields.join(', ')} WHERE id = ?`;
    values.push(updateUserDto.id);
    try {
      const [result] = await this.dbService.getPool().query(sql, values);
      const updateResult = result as { affectedRows?: number };

      if (updateResult.affectedRows === 0) {
        throw new InternalServerErrorException('User not found or no changes made');
      }

      const updatedUser = await this.findById(updateUserDto.id);
      if (!updatedUser) {
        throw new InternalServerErrorException('User not found after update');
      }

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email
      } as UserResponseDto;
    } catch (error) {
      const message = (error as { message?: string }).message;
      throw new InternalServerErrorException(message);
    }
  }
  
  async deleteUser(id: number, profile: UserProfile): Promise<DeleteUserResponseDto> {

    // Ensure user exists and has permission to delete
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (profile.id !== user.id && !profile.admin) {
      throw new ForbiddenException('You do not have permission to delete this user');
    }
    
    const sql = `UPDATE user SET deleted_at = ? WHERE id = ?`;
    try {
      const [result] = await this.dbService.getPool().query(sql, [new Date(), id]);
      const deleteResult = result as { affectedRows?: number };
      
      if (deleteResult.affectedRows === 0) {
        throw new InternalServerErrorException('User not found or could not be deleted');
      }
      return { id } as DeleteUserResponseDto;
    } catch (error) {
      const message = (error as { message?: string }).message;
      throw new InternalServerErrorException(message);
    }
  }
}
