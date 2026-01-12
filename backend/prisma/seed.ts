import { PrismaClient, Item } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Rozpoczynam rozbudowane seedowanie danych...');

  // 1. Definicja dużej bazy przedmiotów
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

  // KLUCZOWA POPRAWKA: Jawne określenie typu tablicy jako Item[]
  const createdItems: Item[] = [];

  for (const item of itemsData) {
    const created = await prisma.item.create({ data: item });
    createdItems.push(created);
  }

  // 2. Definicja skrzynek z filtrowaniem rzadkości
  const casesData = [
    {
      name: 'Skrzynia Legend',
      price: 150.0,
      rarities: ['legendary', 'epic']
    },
    {
      name: 'Skrzynia Klasyczna',
      price: 25.0,
      rarities: ['rare', 'epic', 'common']
    },
    {
      name: 'Tania Paczka',
      price: 2.0,
      rarities: ['common']
    }
  ];

  for (const caseInfo of casesData) {
    // Filtrowanie stworzonych przedmiotów według rzadkości dla konkretnej skrzynki
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

  // 3. Dodanie testowego użytkownika (opcjonalnie, by mieć na czym testować od razu)
  await prisma.user.upsert({
    where: { email: 'admin@casino.pl' },
    update: {},
    create: {
      id: 1,
      username: 'Administrator',
      email: 'admin@casino.pl',
      passwordHash: 'test', // W prawdziwej apce użyj bcrypt
      balance: 1000.0
    }
  });

  console.log(`Seedowanie zakończone! Stworzono ${createdItems.length} przedmiotów.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });