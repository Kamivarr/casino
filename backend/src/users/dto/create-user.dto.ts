import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Jan' })
  name: string;

  @ApiProperty({ example: 'jan@test.pl' })
  email: string;
}
