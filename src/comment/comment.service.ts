import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentRepository } from './comment.repository';
import { UserProfile } from 'src/auth/tokens.interface';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  create(createCommentDto: CreateCommentDto, user: UserProfile) {
    return this.commentRepository.create(createCommentDto, user);
  }

  findByReportId(report_id: number) {
    return this.commentRepository.findByReportIdWithLikes(report_id);
  }

  update(id: number, updateCommentDto: UpdateCommentDto, user: UserProfile) {
    return this.commentRepository.update(id, updateCommentDto, user);
  }

  remove(id: number, user: UserProfile) {
    return this.commentRepository.remove(id, user);
  }
}
