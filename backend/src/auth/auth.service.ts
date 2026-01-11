import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    // 1. Sprawdź czy email lub username są zajęte
    const userByEmail = await this.usersService.findByEmail(dto.email);
    if (userByEmail) throw new ConflictException('Email jest już zajęty');

    const userByUsername = await this.usersService.findByUsername(dto.username);
    if (userByUsername) throw new ConflictException('Username jest już zajęty');

    // 2. Hashowanie hasła
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // 3. Zapis do bazy
    const user = await this.usersService.create({
      username: dto.username,
      email: dto.email,
      passwordHash: passwordHash,
      balance: 1000.0, // Bonus na start
    });

    // Usuwamy hash z odpowiedzi dla bezpieczeństwa
    delete (user as any).passwordHash;
    return user;
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Błędne dane logowania');

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Błędne dane logowania');

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}