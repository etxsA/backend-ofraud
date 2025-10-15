/* eslint-disable prettier/prettier */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
    @ApiProperty({
        description: 'The new content of the comment.',
        example: 'This is the updated comment.',
      })
      @IsString()
      @IsNotEmpty()
      @MaxLength(512)
      content: string;
}
