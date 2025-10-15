import { Injectable } from '@nestjs/common';
import {
  CreateLikeDto,
  CreateLikeResponseDto,
  RemoveLikeResponseDto,
} from './dto/create-like.dto';
import { LikeRepository } from './like.repository';
import { UserProfile } from 'src/auth/tokens.interface';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(private readonly likeRepository: LikeRepository) {}

  create(
    createLikeDto: CreateLikeDto,
    user: UserProfile,
  ): Promise<CreateLikeResponseDto> {
    return this.likeRepository.create(createLikeDto, user);
  }

  remove(report_id: number, user: UserProfile): Promise<RemoveLikeResponseDto> {
    return this.likeRepository.remove(report_id, user);
  }

  findByUserId(user_id: number): Promise<Like[]> {
    return this.likeRepository.findByUserId(user_id);
  }

  findByReportId(report_id: number): Promise<Like[]> {
    return this.likeRepository.findByReportId(report_id);
  }
}
