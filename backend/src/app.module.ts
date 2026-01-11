import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CasesModule } from './cases/cases.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CasesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}