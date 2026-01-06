import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({ example: 'My Awesome Game' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'abcdefgh', description: 'Exactly 8 characters' })
  @IsString()
  @Length(8, 8)
  shortUrl: string;
}

export class UpdateGameDto {
  @ApiProperty({ example: 'New Game Name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class GameResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'abcdefgh' })
  shortUrl: string;

  @ApiProperty({ example: 'My Awesome Game' })
  name: string;

  @ApiProperty({ example: 'CREATED', enum: ['CREATED', 'STARTED'] })
  status: string;
}
