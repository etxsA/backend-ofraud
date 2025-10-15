import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateCommentLikeDto {
  @ApiProperty({
    description: 'The ID of the comment being liked.',
    example: 1,
  })
  @IsInt()
  comment_id: number;
}
