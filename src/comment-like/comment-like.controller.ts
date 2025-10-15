import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentLikeService } from './comment-like.service';
import { CreateCommentLikeDto } from './dto/create-comment-like.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/interfaces/authenticated_request';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentLike } from './entities/comment-like.entity';

@ApiTags('Endpoints for comment like management')
@Controller('comment-like')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  @Post()
  @ApiOperation({ summary: 'Like a comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been liked.',
    type: CommentLike,
    example: {
      user_id: 1,
      comment_id: 1,
      creation_date: '2025-10-14',
    },
  })
  @ApiResponse({
    status: 409,
    description: 'You have already liked this comment.',
    example: {
      message: 'You have already liked this comment',
      statusCode: 409,
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body() createCommentLikeDto: CreateCommentLikeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentLikeService.create(
      createCommentLikeDto,
      req.user.profile,
    );
  }

  @Delete(':comment_id')
  @ApiOperation({ summary: 'Unlike a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been unliked.',
    example: { comment_id: 1, user_id: 1 },
  })
  @ApiResponse({ status: 404, description: 'Like not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(
    @Param('comment_id') comment_id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentLikeService.remove(+comment_id, req.user.profile);
  }
}
