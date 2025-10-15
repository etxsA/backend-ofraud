import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/interfaces/authenticated_request';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';
import { CommentResponseDto } from './dto/comment-response.dto';

@ApiTags('Endpoints for comment management')
@Controller('comment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a comment' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been created.',
    type: Comment,
    example: {
      id: 1,
      content: 'This is a test comment.',
      user_id: 1,
      report_id: 1,
      parent_comment_id: null,
      creation_date: '2025-10-14',
      deleted_at: null,
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentService.create(createCommentDto, req.user.profile);
  }

  @Get('report/:report_id')
  @ApiOperation({ summary: 'Get all comments for a report with like counts' })
  @ApiResponse({
    status: 200,
    description: 'Return all comments for a report.',
    type: [CommentResponseDto],
    example: [
      {
        id: 1,
        content: 'This is a comment on the report.',
        user_id: 2,
        report_id: 1,
        parent_comment_id: null,
        creation_date: '2025-10-14',
        deleted_at: null,
        likes: '5',
      },
      {
        id: 2,
        content: 'This is another comment.',
        user_id: 3,
        report_id: 1,
        parent_comment_id: null,
        creation_date: '2025-10-14',
        deleted_at: null,
        likes: '2',
      },
    ],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findByReportId(@Param('report_id') report_id: string) {
    return this.commentService.findByReportId(+report_id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been updated.',
    type: Comment,
    example: {
      id: 1,
      content: 'This is the updated comment content.',
      user_id: 1,
      report_id: 1,
      parent_comment_id: null,
      creation_date: '2025-10-14',
      deleted_at: null,
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.commentService.update(+id, updateCommentDto, req.user.profile);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({
    status: 200,
    description: 'The comment has been deleted.',
    example: { id: 1 },
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.commentService.remove(+id, req.user.profile);
  }
}
