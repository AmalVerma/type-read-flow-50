import { db } from '@/lib/indexeddb';
import { mockNovels } from '@/data/mockData';

export const seedDatabase = async () => {
  try {
    // Check if database already has data
    const existingNovels = await db.getAllNovels();
    
    if (existingNovels.length > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    console.log('Seeding database with sample data...');

    // Add all mock novels to IndexedDB
    for (const novel of mockNovels) {
      await db.saveNovel(novel);
      
      // Add chapters for each novel
      for (const chapter of novel.chapters) {
        await db.saveChapter({
          ...chapter,
          novelId: novel.id
        });
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
};

export const clearDatabase = async () => {
  try {
    await db.clearAll();
    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Failed to clear database:', error);
  }
};