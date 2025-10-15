import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto, CreateLikeResponseDto } from './dto/create-like.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/interfaces/authenticated_request';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Endpoints for like management')
@Controller('like')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @ApiOperation({ summary: 'Like a report' })
  @ApiResponse({
    status: 201,
    description: 'The report has been liked.',
    example: { user_id: 1, report_id: 1 },
  })
  @ApiResponse({
    status: 409,
    description: 'You have already liked this report.',
    example: {
      message: 'You have already liked this report',
      error: 'Conflict',
      statusCode: 409,
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: { message: 'Unauthorized', statusCode: 401 },
  })
  create(
    @Body() createLikeDto: CreateLikeDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<CreateLikeResponseDto> {
    return this.likeService.create(createLikeDto, req.user.profile);
  }

  @Delete(':report_id')
  @ApiOperation({ summary: 'Unlike a report' })
  @ApiResponse({
    status: 200,
    description: 'The report has been unliked.',
    example: { user_id: 1, report_id: 1 },
  })
  @ApiResponse({
    status: 404,
    description: 'Like not found.',
    example: {
      message: 'Like not found',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: { message: 'Unauthorized', statusCode: 401 },
  })
  remove(
    @Param('report_id') report_id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.likeService.remove(+report_id, req.user.profile);
  }

  @Get('user/:user_id')
  @ApiOperation({ summary: 'Get all likes for a user' })
  @ApiResponse({
    status: 200,
    description: 'Return all likes for a user.',
    example: [
      { user_id: 1, report_id: 1 },
      { user_id: 1, report_id: 2 },
    ],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: { message: 'Unauthorized', statusCode: 401 },
  })
  findByUserId(@Param('user_id') user_id: string) {
    return this.likeService.findByUserId(+user_id);
  }

  @Get('report/:report_id')
  @ApiOperation({ summary: 'Get all likes for a report' })
  @ApiResponse({
    status: 200,
    description: 'Return all likes for a report.',
    example: [
      { user_id: 1, report_id: 1 },
      { user_id: 2, report_id: 1 },
    ],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
    example: { message: 'Unauthorized', statusCode: 401 },
  })
  findByReportId(@Param('report_id') report_id: string) {
    return this.likeService.findByReportId(+report_id);
  }
}
