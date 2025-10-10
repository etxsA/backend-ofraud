/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { userDto, CreateUserDto } from "./user.dto";
import { UserRepository } from "./user.repository";
import { createHash } from "node:crypto";

@Injectable()

export class UserService {
    constructor(private readonly userRepository: UserRepository) {
    }

    async createUser(createUserDto: CreateUserDto): Promise<userDto|void> {

        // Create hashed password
        const hashedPassword = createHash("sha256").update(createUserDto.password + 'salt').digest();
        createUserDto.password = hashedPassword.toString('hex');
        console.log(createUserDto);
        return this.userRepository.createUser(createUserDto);; 
    }
}