import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async getAllCases() {
    return this.prisma.case.findMany({ include: { items: true } });
  }

  async openCase(caseId: number, userId: number) {
    const casinoCase = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: { items: true },
    });
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!casinoCase || !user) throw new NotFoundException('Nie znaleziono danych');
    if (user.balance < casinoCase.price) throw new BadRequestException('Brak środków');

    // Losowanie przedmiotu
    const rolledItem = casinoCase.items[Math.floor(Math.random() * casinoCase.items.length)];

    // Używamy transakcji, aby mieć pewność, że balans i ekwipunek zaktualizują się razem
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: casinoCase.price } },
      }),
      this.prisma.inventoryItem.create({
        data: {
          userId: userId,
          itemId: rolledItem.id,
        },
      }),
    ]);

    return {
      item: rolledItem,
      newBalance: user.balance - casinoCase.price,
    };
  }
}