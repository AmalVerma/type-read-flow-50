import { db } from '@/lib/indexeddb';

export const initializeDatabase = async () => {
  try {
    // Check if database already has data
    const existingNovels = await db.getAllNovels();
    
    if (existingNovels.length > 0) {
      console.log('Database already has data');
      return;
    }

    console.log('Initializing empty database...');
    
    // Database is empty, we don't need to add anything
    // The app will show empty states and users can add their own data
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize database:', error);
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
