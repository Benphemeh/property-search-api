import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiProperty({
    description: 'Natural language property search query',
    example: 'brownfield sites over 5 acres in the Midlands under £2m',
  })
  @IsString()
  @IsNotEmpty({ message: 'Query must not be empty' })
  @MinLength(3, { message: 'Query must be at least 3 characters long' })
  query: string;
}
