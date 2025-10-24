import { ApiProperty } from "@nestjs/swagger";

export class LikesByDayStatsDto {
    @ApiProperty({
        example: '2025-10-24',
        description: 'The date for which the count is provided.',
    })
    date: string;

    @ApiProperty({
        example: 25,
        description: 'The total number of likes of a user report created on that date.',
    })
    likes_count: number;
}