import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Automatyczne seedowanie bazy danych...');

  // 1. Definicja danych
  const itemsData = [
    { name: 'AWP | Dragon Lore', price: 2500.0, rarity: 'legendary' },
    { name: 'M9 Bayonet | Doppler', price: 1200.0, rarity: 'legendary' },
    { name: 'Karambit | Fade', price: 1800.0, rarity: 'legendary' },
    { name: 'AK-47 | Fire Serpent', price: 800.0, rarity: 'epic' },
    { name: 'M4A4 | Howl', price: 2000.0, rarity: 'legendary' },
    { name: 'AK-47 | Redline', price: 65.0, rarity: 'rare' },
    { name: 'AWP | Asiimov', price: 150.0, rarity: 'epic' },
    { name: 'Glock-18 | Fade', price: 400.0, rarity: 'epic' },
    { name: 'Desert Eagle | Blaze', price: 350.0, rarity: 'epic' },
    { name: 'USP-S | Kill Confirmed', price: 120.0, rarity: 'epic' },
    { name: 'M4A1-S | Printstream', price: 280.0, rarity: 'epic' },
    { name: 'AK-47 | Slate', price: 15.0, rarity: 'rare' },
    { name: 'AWP | Safari Mesh', price: 0.5, rarity: 'common' },
    { name: 'P250 | Sand Dune', price: 0.2, rarity: 'common' },
    { name: 'Glock-18 | Bunsen Burner', price: 1.5, rarity: 'common' },
    { name: 'MP9 | Storm', price: 0.8, rarity: 'common' },
    { name: 'Tec-9 | Bamboo Forest', price: 2.5, rarity: 'common' },
    { name: 'FAMAS | Colony', price: 1.0, rarity: 'common' },
    { name: 'AK-47 | Frontside Misty', price: 45.0, rarity: 'rare' },
    { name: 'M4A4 | Desolate Space', price: 35.0, rarity: 'rare' },
  ];

  // 2. Używamy transakcji, aby mieć pewność, że dane są spójne
  // Najpierw czyścimy stare skrzynki i przedmioty (tylko przy automatyzacji deweloperskiej)
  // Jeśli wolisz zachować dane, użyj pętli z upsert.
  await prisma.marketListing.deleteMany({});
  await prisma.inventoryItem.deleteMany({});
  await prisma.case.deleteMany({});
  await prisma.item.deleteMany({});

  console.log('♻️ Stara baza wyczyszczona.');

  // 3. Tworzenie przedmiotów
  // mapujemy stworzone obiekty do tablicy, aby użyć ich w skrzynkach
  const createdItems = await Promise.all(
    itemsData.map((item) => prisma.item.create({ data: item }))
  );

  // 4. Definicja skrzynek
  const casesData = [
    { name: 'Skrzynia Legend', price: 150.0, rarities: ['legendary', 'epic'] },
    { name: 'Skrzynia Klasyczna', price: 25.0, rarities: ['rare', 'epic', 'common'] },
    { name: 'Tania Paczka', price: 2.0, rarities: ['common'] }
  ];

  for (const caseInfo of casesData) {
    const filteredItems = createdItems.filter(i => caseInfo.rarities.includes(i.rarity));
    
    await prisma.case.create({
      data: {
        name: caseInfo.name,
        price: caseInfo.price,
        items: {
          connect: filteredItems.map(item => ({ id: item.id }))
        }
      }
    });
  }

// 5. Hashowanie hasła dla użytkownika testowego
  // Generujemy hash, który system rozpozna podczas logowania
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('adminadmin', salt); 

  // 6. Upsert użytkownika z poprawnym hashem
  await prisma.user.upsert({
    where: { email: 'admin@casino.pl' },
    update: {}, 
    create: {
      username: 'Administrator',
      email: 'admin@casino.pl',
      passwordHash: hashedPassword, // Wstawiamy bezpieczny hash zamiast "test" 
      balance: 1000.0,
    },
  });

  console.log(`✅ Seedowanie zakończone! Przedmioty: ${createdItems.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Błąd seedowania:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });