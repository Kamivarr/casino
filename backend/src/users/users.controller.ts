import { Controller, Get, Post, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users & Market') // Grupowanie w dokumentacji Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('market')
  @ApiOperation({ summary: 'Pobiera wszystkie aktywne oferty z rynku' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Lista ofert została pobrana.' })
  getMarket() {
    return this.usersService.getMarketListings(); 
  }

  @Post('market/sell')
  @ApiOperation({ summary: 'Wystawia przedmiot użytkownika na sprzedaż' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Przedmiot wystawiony.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Błędne dane lub brak uprawnień do przedmiotu.' })
  sellItem(@Body() body: { userId: number; inventoryItemId: number; price: number }) {
    return this.usersService.sellItem(body.userId, body.inventoryItemId, body.price); 
  }

  @Post('market/buy/:id')
  @ApiOperation({ summary: 'Kupuje przedmiot z rynku' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Zakup zakończony sukcesem.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Niewystarczające środki lub własny przedmiot.' })
  buyItem(
    @Param('id', ParseIntPipe) listingId: number, 
    @Body() body: { buyerId: number }
  ) {
    return this.usersService.buyItem(body.buyerId, listingId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Pobiera publiczny profil użytkownika' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Dane profilu.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Użytkownik nie istnieje.' })
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id); 
  }

  @Get(':id/inventory')
  @ApiOperation({ summary: 'Pobiera ekwipunek konkretnego użytkownika' })
  getInventory(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getInventory(id);
  }

  @Post(':id/add-funds')
  @ApiOperation({ summary: 'Doładowuje konto użytkownika (Funkcja deweloperska/Testowa)' })
  addFunds(@Param('id', ParseIntPipe) id: number) {
    // Wartości stałe (100) najlepiej trzymać w serwisie lub konfigurować w DTO
    return this.usersService.addCredits(id, 100);
  }
}