import { useState, useEffect } from 'react';
import { db } from '@/lib/indexeddb';
import { Novel, Chapter } from '@/types';

export const useNovels = () => {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNovels = async () => {
    try {
      setIsLoading(true);
      const storedNovels = await db.getAllNovels();
      setNovels(storedNovels);
      setError(null);
    } catch (err) {
      setError('Failed to load novels');
      console.error('Failed to load novels:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNovel = async (novel: Novel) => {
    try {
      await db.saveNovel(novel);
      await loadNovels(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to save novel');
      console.error('Failed to save novel:', err);
      return false;
    }
  };

  const deleteNovel = async (id: string) => {
    try {
      await db.deleteNovel(id);
      await loadNovels(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to delete novel');
      console.error('Failed to delete novel:', err);
      return false;
    }
  };

  useEffect(() => {
    loadNovels();
  }, []);

  return {
    novels,
    isLoading,
    error,
    saveNovel,
    deleteNovel,
    refreshNovels: loadNovels
  };
};

export const useChapters = (novelId: string) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChapters = async () => {
    try {
      setIsLoading(true);
      const storedChapters = await db.getChaptersByNovelId(novelId);
      setChapters(storedChapters);
      setError(null);
    } catch (err) {
      setError('Failed to load chapters');
      console.error('Failed to load chapters:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChapter = async (chapter: Chapter & { novelId: string }) => {
    try {
      await db.saveChapter(chapter);
      await loadChapters(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to save chapter');
      console.error('Failed to save chapter:', err);
      return false;
    }
  };

  const deleteChapter = async (id: string) => {
    try {
      await db.delete('chapters', id);
      await loadChapters(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to delete chapter');
      console.error('Failed to delete chapter:', err);
      return false;
    }
  };

  const moveChapter = async (chapterId: string, direction: 'up' | 'down') => {
    try {
      const currentChapters = [...chapters];
      const index = currentChapters.findIndex(ch => ch.id === chapterId);
      
      if (index === -1) return false;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= currentChapters.length) return false;
      
      // Swap chapters
      [currentChapters[index], currentChapters[newIndex]] = [currentChapters[newIndex], currentChapters[index]];
      
      // Update both chapters in the database
      await db.saveChapter({ ...currentChapters[index], novelId });
      await db.saveChapter({ ...currentChapters[newIndex], novelId });
      
      await loadChapters(); // Refresh the list
      return true;
    } catch (err) {
      setError('Failed to move chapter');
      console.error('Failed to move chapter:', err);
      return false;
    }
  };

  useEffect(() => {
    if (novelId) {
      loadChapters();
    }
  }, [novelId]);

  return {
    chapters,
    isLoading,
    error,
    saveChapter,
    deleteChapter,
    moveChapter,
    refreshChapters: loadChapters
  };
};

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const fileId = await db.storeFile(file);
      return fileId;
    } catch (error) {
      console.error('Failed to upload file:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const getFileAsText = async (fileId: string): Promise<string | null> => {
    try {
      return await db.getFileAsText(fileId);
    } catch (error) {
      console.error('Failed to read file:', error);
      return null;
    }
  };

  return {
    uploadFile,
    getFileAsText,
    isUploading
  };
};