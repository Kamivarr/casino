import { Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get(':id/inventory')
  getInventory(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getInventory(id);
  }

  @Post(':id/add-funds')
  addFunds(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.addCredits(id, 100);
  }
}