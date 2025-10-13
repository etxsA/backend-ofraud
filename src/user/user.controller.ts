/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards,  } from "@nestjs/common";
import { CreateUserDto, userDto, UserResponseDto } from "./user.dto";
import { UserService } from "./user.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "src/interfaces/authenticated_request";
import { UserModel } from "./user.model";

@ApiTags("Enpoints for user management")
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({ summary: 'Create user, used for registering' })
    @ApiResponse({ status: 201, description: 'The user has been created.'})
    @ApiResponse({ status: 500, description: 'Internal server error, email already in use or other error.'})
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.userService.createUser(createUserDto);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update user by id, only byt adming and by iteself' })
    @ApiResponse({ status: 200, description: 'The user has been updated.'})
    @ApiResponse({ status: 404, description: 'User not found.'})
    @ApiResponse({ status: 500, description: 'Internal server error.'})
    async updateUser(@Body() updateUserDto: Partial<UserModel>, @Req() req: AuthenticatedRequest): Promise<userDto| void> {
        //return this.userService.updateUser(updateUserDto);
    }
    
    @Delete(":id")
    @ApiOperation({ summary: 'Delete user by id' })
    @ApiResponse({ status: 200, description: 'The user has been deleted.'})
    @ApiResponse({ status: 404, description: 'User not found.'})
    @ApiResponse({ status: 500, description: 'Internal server error.'})
    async deleteUser(@Param("id") id: number): Promise<void> {
        //return this.userService.deleteUser(id);
    }
    
}