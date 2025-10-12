/* eslint-disable prettier/prettier */

import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto, userDto } from "./user.dto";
import { UserService } from "./user.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Enpoints for user management")
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiResponse({ status: 201, description: 'The user has been created.'})
    @ApiResponse({ status: 500, description: 'Internal server error.'})
    async createUser(@Body() createUserDto: CreateUserDto): Promise<userDto| void> {
        return this.userService.createUser(createUserDto);
    }
}