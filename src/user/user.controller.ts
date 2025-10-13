/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards,  } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto, UpdateUserResponseDto, userDto, UserResponseDto } from "./user.dto";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "src/interfaces/authenticated_request";

@ApiTags("Enpoints for user management")
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiOperation({ summary: 'Create user, used for registering' })
    @ApiResponse({ status: 201, description: 'The user has been created.', example: { id: 1, name: 'Jose Torres', email: 'email@email.com' } })
    @ApiResponse({ status: 500, description: 'Internal server error, email already in use or other error.'})
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.userService.createUser(createUserDto);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user by id, only byt adming and by iteself' })
    @ApiResponse({ status: 200, description: 'The user has been updated.'})
    @ApiResponse({ status: 401, description: 'Unauthorized' ,  example: {
        message: "Invalid token",
        error: "Unauthorized",
        statusCode: 401
    }})
    @ApiResponse({ status: 404, description: 'User not found.', example: {
        message: "User not found",
        error: "Not Found",
        statusCode: 404
    }})
    @ApiResponse({ status: 403, description: 'Forbidden, you do not have permission to update this user.', example: {
        message: "You do not have permission to update this user",
        error: "Forbidden",
        statusCode: 403
    }})    
    @ApiResponse({ status: 500, description: 'Internal server error.'})
    async updateUser(@Body() updateUserDto: UpdateUserDto, @Req() req: AuthenticatedRequest): Promise<UpdateUserResponseDto> {
        return this.userService.updateUser(updateUserDto, req.user.profile);
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