/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Param, Patch, Post,  Req, UseGuards,  } from "@nestjs/common";
import { CreateUserDto, DeleteUserResponseDto, UpdateUserDto, UpdateUserResponseDto,  UserResponseDto } from "./user.dto";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import type { AuthenticatedRequest } from "src/interfaces/authenticated_request";
import { AdminGuard } from "src/common/guards/admin.guard";

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

    @Post('admin')
    @UseGuards(AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create an admin user, only accessible by an admin' })
    @ApiResponse({ status: 201, description: 'The admin has been created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async createAdmin(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.userService.createAdmin(createUserDto);
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update user by id, only by admin and by iteself' })
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete user by id' })
    @ApiResponse({ status: 200, description: 'The user has been deleted.', example: { id: 1}})
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
    @ApiResponse({ status: 403, description: 'Forbidden, you do not have permission to Delete this user.', example: {
        message: "You do not have permission to Delete this user",
        error: "Forbidden",
        statusCode: 403
    }})       
    @ApiResponse({ status: 500, description: 'Internal server error.'})
    async deleteUser(@Param("id") id: number, @Req() req: AuthenticatedRequest): Promise<DeleteUserResponseDto> {
        return this.userService.deleteUser(id, req.user.profile);
    }
    
}