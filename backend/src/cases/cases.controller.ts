import { Controller, Get, Post, Param, ParseIntPipe } from '@nestjs/common';
import { CasesService } from './cases.service';

@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  getCases() {
    return this.casesService.getAllCases();
  }

  @Post(':id/open/:userId')
  open(@Param('id', ParseIntPipe) id: number, @Param('userId', ParseIntPipe) userId: number) {
    return this.casesService.openCase(id, userId);
  }
}