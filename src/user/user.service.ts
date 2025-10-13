/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto, DeleteUserResponseDto, UpdateUserDto, UpdateUserResponseDto, UserResponseDto } from "./user.dto";
import { UserRepository } from "./user.repository";
import { LoginDto } from "src/auth/auth.dto";
import { UserModel } from "./user.model";
import { hashPassword } from "src/util/hash.util";
import { UserProfile } from "src/auth/tokens.interface";

@Injectable()

export class UserService {
    constructor(private readonly userRepository: UserRepository) {
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {

        // Create hashed password
        const salt = 'salt'; // Change this to a proper salt generation
        const hashedPassword = hashPassword(createUserDto.password, salt);
        createUserDto.password = hashedPassword;
        console.log(createUserDto);
        return this.userRepository.createUser(createUserDto, salt);; 
    }

    async login(user: LoginDto): Promise<UserModel> {

        const foundUser: UserModel = await this.userRepository.findByEmail(user.email);

        if (!foundUser) {
            throw new Error('User not found');
        }
        const hashedPassword = hashPassword(user.password, foundUser.salt ?? 'salt');
        if (foundUser.password !== hashedPassword) {
            throw new UnauthorizedException('Invalid password');
        }

        return foundUser;
    }

    async findById(id: number): Promise<UserModel> {
        return this.userRepository.findById(id);
    }

    async findByEmail(email: string): Promise<UserModel> {
        return this.userRepository.findByEmail(email);
    }

    async updateUser(updateUserDto: UpdateUserDto, profile: UserProfile): Promise<UpdateUserResponseDto> {
        if (updateUserDto.password) {
            const salt = 'salt'; // Change this to a proper salt generation
            const hashedPassword = hashPassword(updateUserDto.password, salt);
            updateUserDto.password = hashedPassword;
        }

        return this.userRepository.updateUser(updateUserDto, profile);
    }

    async deleteUser(id: number, profile: UserProfile): Promise<DeleteUserResponseDto> {
        return this.userRepository.deleteUser(id, profile);
    }

}