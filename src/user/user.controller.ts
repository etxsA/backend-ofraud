/* eslint-disable prettier/prettier */

import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto, userDto } from "./user.dto";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<userDto| void> {
        return this.userService.createUser(createUserDto);
    }
}