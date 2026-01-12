import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; 
import { User, Prisma, InventoryItem, MarketListing } from '@prisma/client';

/**
 * Serwis zarządzający logiką użytkowników, ekwipunkiem oraz rynkiem (Marketplace).
 * Podczas obrony warto wspomnieć o wykorzystaniu transakcji ACID przy zakupach.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  // --- PODSTAWOWE OPERACJE NA UŻYTKOWNIKU ---

  async create(data: Prisma.UserCreateInput): Promise<User> {
    this.logger.log(`Tworzenie nowego użytkownika: ${data.username}`);
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async findOne(id: number): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        balance: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Użytkownik o ID ${id} nie istnieje`);
    }
    return user;
  }

  // --- EKWIPUNEK ---

  /**
   * Pobiera ekwipunek użytkownika wraz z detalami przedmiotów i statusem wystawienia na rynek.
   */
  async getInventory(userId: number): Promise<InventoryItem[]> {
    return this.prisma.inventoryItem.findMany({
      where: { userId },
      include: {
        item: true,
        listing: true, 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addCredits(userId: number, amount: number): Promise<User> {
    if (amount <= 0) throw new BadRequestException('Kwota doładowania musi być dodatnia');
    
    return this.prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } },
    });
  }

  // --- LOGIKA RYNKU (MARKETPLACE) ---

  /**
   * Wystawia przedmiot na rynek.
   * Sprawdza prawo własności oraz czy przedmiot nie jest już wystawiony.
   */
  async sellItem(userId: number, inventoryItemId: number, price: number): Promise<MarketListing> {
    if (price <= 0) throw new BadRequestException('Cena sprzedaży musi być wyższa niż 0');

    // Sprawdzenie czy użytkownik faktycznie posiada ten przedmiot
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id: inventoryItemId, userId },
    });
    
    if (!item) {
      throw new BadRequestException('Nie możesz wystawić przedmiotu, którego nie posiadasz');
    }

    // Sprawdzenie czy przedmiot nie widnieje już w aktywnej ofercie
    const existingListing = await this.prisma.marketListing.findUnique({
      where: { inventoryItemId },
    });
    
    if (existingListing) {
      throw new BadRequestException('Ten przedmiot został już wystawiony na sprzedaż');
    }

    return this.prisma.marketListing.create({
      data: {
        sellerId: userId,
        inventoryItemId,
        price,
      },
    });
  }

  async getMarketListings(): Promise<any[]> {
    return this.prisma.marketListing.findMany({
      include: {
        inventoryItem: { 
          include: { item: true } 
        },
        seller: { 
          select: { username: true } 
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obsługuje proces zakupu przedmiotu przy użyciu transakcji bazodanowej.
   * Gwarantuje to, że albo cały proces (przelew + zmiana właściciela) się uda,
   * albo w przypadku błędu żadne środki nie zostaną pobrane.
   */
  async buyItem(buyerId: number, listingId: number): Promise<{ message: string }> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Pobranie i weryfikacja oferty
      const listing = await tx.marketListing.findUnique({
        where: { id: listingId },
        include: { inventoryItem: true },
      });

      if (!listing) throw new NotFoundException('Przepraszamy, ta oferta nie jest już aktualna');
      if (listing.sellerId === buyerId) throw new BadRequestException('Nie możesz kupić własnego przedmiotu');

      // 2. Weryfikacja kupującego
      const buyer = await tx.user.findUnique({ where: { id: buyerId } });
      if (!buyer) throw new NotFoundException('Użytkownik kupujący nie został znaleziony');

      if (buyer.balance < listing.price) {
        throw new BadRequestException('Niewystarczające środki na koncie');
      }

      // 3. Rozliczenie finansowe (Przelew między kontami)
      await tx.user.update({
        where: { id: buyerId },
        data: { balance: { decrement: listing.price } },
      });

      await tx.user.update({
        where: { id: listing.sellerId },
        data: { balance: { increment: listing.price } },
      });

      // 4. Transfer własności przedmiotu w ekwipunku
      await tx.inventoryItem.update({
        where: { id: listing.inventoryItemId },
        data: { userId: buyerId },
      });

      // 5. Usunięcie zakończonej oferty z rynku
      await tx.marketListing.delete({ where: { id: listingId } });

      this.logger.log(`Zakup udany: User ${buyerId} kupił przedmiot od User ${listing.sellerId}`);
      
      return { message: 'Zakup zakończony pomyślnie!' };
    });
  }
}