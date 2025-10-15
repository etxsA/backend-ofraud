import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({
    description: 'The ID of the user who liked the report.',
    example: 1,
  })
  @IsNumber()
  report_id: number;
}

export class CreateLikeResponseDto {
  @ApiProperty({
    description: 'The ID of the user who liked the report.',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'The ID of the report that was liked.',
    example: 1,
  })
  @IsNumber()
  report_id: number;
}

export class RemoveLikeResponseDto {
  @ApiProperty({
    description: 'The ID of the user who unliked the report.',
    example: 1,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'The ID of the report that was unliked.',
    example: 1,
  })
  @IsNumber()
  report_id: number;
}
