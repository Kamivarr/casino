import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  email: string;
  password: string;
}


@Injectable()
export class UsersService {
  private users: User[] = [];
  private idCounter = 1;

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async create(data: { email: string; password: string }): Promise<User> {
    const newUser: User = {
      id: this.idCounter++,
      ...data,
    };
    this.users.push(newUser);
    return newUser;
  }
}
