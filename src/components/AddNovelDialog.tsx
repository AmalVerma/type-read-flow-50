import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, X, Upload, BookOpen } from 'lucide-react';
import { Novel } from '@/types';
import { useNovels, useFileUpload } from '@/hooks/useIndexedDB';
import { useToast } from '@/hooks/use-toast';

interface AddNovelDialogProps {
  trigger?: React.ReactNode;
  onNovelAdded?: (novel: Novel) => void;
}

const AddNovelDialog: React.FC<AddNovelDialogProps> = ({ trigger, onNovelAdded }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    tags: [] as string[],
    currentTag: ''
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { saveNovel } = useNovels();
  const { uploadFile, isUploading } = useFileUpload();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    const tag = formData.currentTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
        currentTag: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCoverFile(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select an image file for the cover.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.author.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in the title and author fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let coverImage: string | undefined;
      
      // Upload cover image if provided
      if (coverFile) {
        const coverImageId = await uploadFile(coverFile);
        if (coverImageId) {
          coverImage = coverImageId;
        }
      }

      // Create new novel
      const newNovel: Novel = {
        id: `novel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim(),
        coverImage,
        totalChapters: 0,
        completedChapters: 0,
        currentChapter: 0,
        chapters: [],
        createdAt: new Date(),
        lastReadAt: new Date(),
        tags: formData.tags
      };

      const success = await saveNovel(newNovel);
      
      if (success) {
        toast({
          title: "Novel added successfully!",
          description: `"${newNovel.title}" has been added to your library.`,
        });
        
        onNovelAdded?.(newNovel);
        
        // Reset form
        setFormData({
          title: '',
          author: '',
          description: '',
          tags: [],
          currentTag: ''
        });
        setCoverFile(null);
        setOpen(false);
      } else {
        throw new Error('Failed to save novel');
      }
    } catch (error) {
      console.error('Failed to add novel:', error);
      toast({
        title: "Error",
        description: "Failed to add novel. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button className="bg-gradient-primary hover:shadow-typing transition-all duration-300">
      <Plus className="w-4 h-4 mr-2" />
      Add Novel
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Add New Novel</span>
          </DialogTitle>
          <DialogDescription>
            Add a new novel to your library. You can add chapters later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter novel title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="bg-input border-border focus:border-primary"
              required
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              placeholder="Enter author name..."
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              className="bg-input border-border focus:border-primary"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a brief description..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="bg-input border-border focus:border-primary min-h-[80px]"
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="cover"
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="bg-input border-border focus:border-primary file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-muted-foreground hover:file:bg-muted/80"
                disabled={isUploading}
              />
              {coverFile && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <span className="text-xs">{coverFile.name}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setCoverFile(null)}
                  />
                </Badge>
              )}
            </div>
            {isUploading && (
              <p className="text-sm text-muted-foreground">Uploading cover image...</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex space-x-2">
              <Input
                id="tags"
                placeholder="Add a tag..."
                value={formData.currentTag}
                onChange={(e) => handleInputChange('currentTag', e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-input border-border focus:border-primary flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddTag}
                variant="outline"
                size="sm"
                disabled={!formData.currentTag.trim()}
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
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
                  Add Novel
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNovelDialog;