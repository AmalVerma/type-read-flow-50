import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, FileText, Upload } from 'lucide-react';
import { Chapter } from '@/types';
import { useChapters, useFileUpload } from '@/hooks/useIndexedDB';
import { useToast } from '@/hooks/use-toast';
import { paginateTextContent } from '@/utils/textPagination';

interface AddChapterDialogProps {
  novelId: string;
  trigger?: React.ReactNode;
  onChapterAdded?: (chapter: Chapter) => void;
}

const AddChapterDialog: React.FC<AddChapterDialogProps> = ({ novelId, trigger, onChapterAdded }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    fileType: 'txt' as 'pdf' | 'epub' | 'txt'
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { saveChapter } = useChapters(novelId);
  const { uploadFile, getFileAsText, isUploading } = useFileUpload();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['.txt', '.pdf', '.epub'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a TXT, PDF, or EPUB file.",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploadedFile(file);
      const fileId = await uploadFile(file);
      
      if (fileId) {
        // Try to extract text content for TXT files
        if (fileExtension === '.txt') {
          const textContent = await getFileAsText(fileId);
          if (textContent) {
            setFormData(prev => ({
              ...prev,
              content: textContent,
              fileType: 'txt'
            }));
          }
        } else {
          // For PDF and EPUB, we'll store the file ID and handle processing later
          setFormData(prev => ({
            ...prev,
            fileType: fileExtension.slice(1) as 'pdf' | 'epub'
          }));
        }
        
        // Auto-fill title if empty
        if (!formData.title) {
          const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
          setFormData(prev => ({ ...prev, title: fileName }));
        }
      }
    } catch (error) {
      console.error('Failed to process file:', error);
      toast({
        title: "Error",
        description: "Failed to process the uploaded file.",
        variant: "destructive"
      });
    }
  };

  // Function to split text into chunks
  const chunkText = (text: string, minWords: number = 40) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks = [];
    let currentChunk = '';
    let chunkId = 0;

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      const testChunk = currentChunk + (currentChunk ? '. ' : '') + trimmedSentence + '.';
      const wordCount = testChunk.split(/\s+/).length;

      if (wordCount >= minWords && currentChunk) {
        chunks.push({
          id: chunkId++,
          text: currentChunk.trim(),
          wordCount: currentChunk.split(/\s+/).length
        });
        currentChunk = trimmedSentence + '.';
      } else {
        currentChunk = testChunk;
      }
    }

    if (currentChunk.trim()) {
      chunks.push({
        id: chunkId++,
        text: currentChunk.trim(),
        wordCount: currentChunk.split(/\s+/).length
      });
    }

    return chunks;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for the chapter.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.content.trim() && !uploadedFile) {
      toast({
        title: "Missing content",
        description: "Please provide content or upload a file.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const pages = formData.content ? paginateTextContent(formData.content) : [];
      const wordCount = pages.reduce((acc, page) => 
        acc + page.chunks.reduce((chunkAcc, chunk) => chunkAcc + chunk.wordCount, 0), 0);

      const newChapter: Chapter & { novelId: string } = {
        id: `chapter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        novelId,
        title: formData.title.trim(),
        status: 'current',
        wordCount,
        progress: 0,
        pages,
        rawContent: formData.content,
        uploadedAt: new Date(),
        fileType: formData.fileType
      };

      const success = await saveChapter(newChapter);
      
      if (success) {
        toast({
          title: "Chapter added successfully!",
          description: `"${newChapter.title}" has been added to the novel.`,
        });
        
        onChapterAdded?.(newChapter);
        
        // Reset form
        setFormData({
          title: '',
          content: '',
          fileType: 'txt'
        });
        setUploadedFile(null);
        setOpen(false);
      } else {
        throw new Error('Failed to save chapter');
      }
    } catch (error) {
      console.error('Failed to add chapter:', error);
      toast({
        title: "Error",
        description: "Failed to add chapter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
      <Plus className="w-4 h-4 mr-2" />
      Add Chapter
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background border-border max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>Add New Chapter</span>
          </DialogTitle>
          <DialogDescription>
            Add a new chapter by typing content or uploading a file.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="chapter-title">Chapter Title *</Label>
            <Input
              id="chapter-title"
              placeholder="Enter chapter title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="bg-input border-border focus:border-primary"
              required
            />
          </div>

          {/* File Type */}
          <div className="space-y-2">
            <Label htmlFor="file-type">File Type</Label>
            <Select value={formData.fileType} onValueChange={(value) => handleInputChange('fileType', value)}>
              <SelectTrigger className="bg-input border-border focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="txt">Text (.txt)</SelectItem>
                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                <SelectItem value="epub">EPUB (.epub)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload File</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="file-upload"
                type="file"
                accept=".txt,.pdf,.epub"
                onChange={handleFileUpload}
                className="bg-input border-border focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-muted-foreground hover:file:bg-muted/80"
                disabled={isUploading}
              />
              {uploadedFile && (
                <div className="text-sm text-muted-foreground">
                  {uploadedFile.name}
                </div>
              )}
            </div>
            {isUploading && (
              <p className="text-sm text-muted-foreground">Processing file...</p>
            )}
            <p className="text-xs text-muted-foreground">
              Supported formats: TXT, PDF, EPUB
            </p>
          </div>

          {/* Content Textarea (shown if no file uploaded or for additional content) */}
          <div className="space-y-2">
            <Label htmlFor="content">
              Content {uploadedFile ? '(Additional/Override)' : '*'}
            </Label>
            <Textarea
              id="content"
              placeholder="Enter chapter content or paste text here..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="bg-input border-border focus:border-primary min-h-[200px]"
              required={!uploadedFile}
            />
            <p className="text-xs text-muted-foreground">
              Text will be automatically split into typing chunks of approximately 40 words each.
            </p>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:shadow-typing transition-all duration-300"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Chapter
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChapterDialog;