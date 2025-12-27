import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.pl', description: 'Adres email użytkownika' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Hasło użytkownika' })
  password: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;
}

