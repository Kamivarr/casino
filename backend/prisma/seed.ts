import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Rozpoczynam seedowanie danych...');

  // 1. Tworzenie przedmiotów (Items)
  const item1 = await prisma.item.create({
    data: {
      name: 'Skin: Dragon Lore',
      price: 1500.0,
      rarity: 'legendary',
    },
  });

  const item2 = await prisma.item.create({
    data: {
      name: 'Skin: Redline',
      price: 50.0,
      rarity: 'rare',
    },
  });

  const item3 = await prisma.item.create({
    data: {
      name: 'Skin: Sand Dune',
      price: 0.5,
      rarity: 'common',
    },
  });

  // 2. Tworzenie skrzynek (Cases) i łączenie ich z przedmiotami
  await prisma.case.create({
    data: {
      name: 'Operation Bravo Case',
      price: 10.0,
      items: {
        connect: [
          { id: item1.id },
          { id: item2.id },
          { id: item3.id },
        ],
      },
    },
  });

  console.log('Seedowanie zakończone pomyślnie!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });