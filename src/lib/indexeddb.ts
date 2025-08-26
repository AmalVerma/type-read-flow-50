import { Novel, Chapter } from '@/types';

interface DBSchema {
  novels: Novel;
  chapters: Chapter;
  files: {
    id: string;
    name: string;
    type: string;
    size: number;
    data: ArrayBuffer;
    uploadedAt: Date;
  };
  userProgress: {
    id: string;
    novelId: string;
    chapterId: string;
    chunkNumber: number;
    wpm: number;
    accuracy: number;
    timeSpent: number;
    lastUpdated: Date;
  };
}

class IndexedDBManager {
  private dbName = 'NovelTypingApp';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('novels')) {
          const novelStore = db.createObjectStore('novels', { keyPath: 'id' });
          novelStore.createIndex('title', 'title', { unique: false });
          novelStore.createIndex('author', 'author', { unique: false });
        }

        if (!db.objectStoreNames.contains('chapters')) {
          const chapterStore = db.createObjectStore('chapters', { keyPath: 'id' });
          chapterStore.createIndex('novelId', 'novelId', { unique: false });
        }

        if (!db.objectStoreNames.contains('files')) {
          const fileStore = db.createObjectStore('files', { keyPath: 'id' });
          fileStore.createIndex('name', 'name', { unique: false });
          fileStore.createIndex('type', 'type', { unique: false });
        }

        if (!db.objectStoreNames.contains('userProgress')) {
          const progressStore = db.createObjectStore('userProgress', { keyPath: 'id' });
          progressStore.createIndex('novelId', 'novelId', { unique: false });
          progressStore.createIndex('chapterId', 'chapterId', { unique: false });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  // Generic CRUD operations
  async add<T extends keyof DBSchema>(storeName: T, data: DBSchema[T]): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get<T extends keyof DBSchema>(storeName: T, id: string): Promise<DBSchema[T] | undefined> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAll<T extends keyof DBSchema>(storeName: T): Promise<DBSchema[T][]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async update<T extends keyof DBSchema>(storeName: T, data: DBSchema[T]): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async delete<T extends keyof DBSchema>(storeName: T, id: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // File-specific operations
  async storeFile(file: File, id?: string): Promise<string> {
    const fileId = id || `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const arrayBuffer = await file.arrayBuffer();
    
    const fileData = {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      data: arrayBuffer,
      uploadedAt: new Date()
    };

    await this.add('files', fileData);
    return fileId;
  }

  async getFile(id: string): Promise<File | null> {
    const fileData = await this.get('files', id);
    if (!fileData) return null;

    const blob = new Blob([fileData.data], { type: fileData.type });
    return new File([blob], fileData.name, { type: fileData.type });
  }

  async getFileAsBlob(id: string): Promise<Blob | null> {
    const fileData = await this.get('files', id);
    if (!fileData) return null;

    return new Blob([fileData.data], { type: fileData.type });
  }

  async getFileAsText(id: string): Promise<string | null> {
    const fileData = await this.get('files', id);
    if (!fileData) return null;

    const decoder = new TextDecoder();
    return decoder.decode(fileData.data);
  }

  // Novel-specific operations
  async saveNovel(novel: Novel): Promise<void> {
    await this.update('novels', novel);
  }

  async getNovel(id: string): Promise<Novel | undefined> {
    return await this.get('novels', id);
  }

  async getAllNovels(): Promise<Novel[]> {
    return await this.getAll('novels');
  }

  async deleteNovel(id: string): Promise<void> {
    // Delete novel and all its chapters
    const chapters = await this.getChaptersByNovelId(id);
    for (const chapter of chapters) {
      await this.delete('chapters', chapter.id);
    }
    await this.delete('novels', id);
  }

  // Chapter-specific operations
  async saveChapter(chapter: Chapter & { novelId: string }): Promise<void> {
    await this.update('chapters', chapter);
  }

  async getChapter(id: string): Promise<Chapter | undefined> {
    return await this.get('chapters', id);
  }

  async getChaptersByNovelId(novelId: string): Promise<Chapter[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['chapters'], 'readonly');
      const store = transaction.objectStore('chapters');
      const index = store.index('novelId');
      const request = index.getAll(novelId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Progress operations
  async saveProgress(progress: DBSchema['userProgress']): Promise<void> {
    await this.update('userProgress', progress);
  }

  async getProgress(novelId: string, chapterId: string): Promise<DBSchema['userProgress'] | undefined> {
    const allProgress = await this.getAll('userProgress');
    return allProgress.find(p => p.novelId === novelId && p.chapterId === chapterId);
  }

  async getNovelProgress(novelId: string): Promise<DBSchema['userProgress'][]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['userProgress'], 'readonly');
      const store = transaction.objectStore('userProgress');
      const index = store.index('novelId');
      const request = index.getAll(novelId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Clear all data
  async clearAll(): Promise<void> {
    const db = await this.ensureDB();
    const storeNames = ['novels', 'chapters', 'files', 'userProgress'];
    
    for (const storeName of storeNames) {
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    }
  }
}

// Export singleton instance
export const db = new IndexedDBManager();

// Initialize on import
db.init().catch(console.error);