/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment.',
    example: 'This is a very insightful report!',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  content: string;

  @ApiProperty({
    description: 'The ID of the report this comment belongs to.',
    example: 1,
  })
  @IsInt()
  report_id: number;

  @ApiProperty({
    description: 'The ID of the parent comment if this is a reply.',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  parent_comment_id?: number;
}
