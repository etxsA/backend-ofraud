/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { userDto, CreateUserDto } from "./user.dto";
import { UserRepository } from "./user.repository";

@Injectable()

export class UserService {
    constructor(private readonly userRepository: UserRepository) {
    }

    async createUser(createUserDto: CreateUserDto): Promise<userDto|void> {
        return this.userRepository.createUser(createUserDto);; 
    }
}