import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Upload, FileText, File, Book } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddChapterDialogProps {
  novelId: string;
  onChapterAdded?: () => void;
}

const AddChapterDialog: React.FC<AddChapterDialogProps> = ({ novelId, onChapterAdded }) => {
  const [open, setOpen] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterText, setChapterText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'text' | 'file'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['text/plain', 'application/pdf', 'application/epub+zip'];
      if (allowedTypes.includes(file.type) || file.name.endsWith('.epub')) {
        setSelectedFile(file);
        if (!chapterTitle) {
          setChapterTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a PDF, EPUB, or TXT file.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Chapter Added',
        description: `"${chapterTitle}" has been successfully added to your novel.`,
      });

      // Reset form
      setChapterTitle('');
      setChapterText('');
      setSelectedFile(null);
      setOpen(false);
      onChapterAdded?.();
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'There was an error adding your chapter. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) return <File className="w-4 h-4 text-red-500" />;
    if (fileName.endsWith('.epub')) return <Book className="w-4 h-4 text-blue-500" />;
    if (fileName.endsWith('.txt')) return <FileText className="w-4 h-4 text-green-500" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:shadow-typing transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" />
          Add Chapter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Add New Chapter
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Chapter Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Chapter Title
            </Label>
            <Input
              id="title"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              placeholder="Enter chapter title..."
              className="bg-input border-border focus:border-primary"
              required
            />
          </div>

          {/* Upload Method Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Content Source</Label>
            <div className="grid grid-cols-2 gap-3">
              <Card 
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  uploadMethod === 'text' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => setUploadMethod('text')}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5" />
                  <div>
                    <h4 className="font-medium">Paste Text</h4>
                    <p className="text-xs text-muted-foreground">Enter text directly</p>
                  </div>
                </div>
              </Card>
              <Card 
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  uploadMethod === 'file' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:bg-muted/50'
                }`}
                onClick={() => setUploadMethod('file')}
              >
                <div className="flex items-center space-x-3">
                  <Upload className="w-5 h-5" />
                  <div>
                    <h4 className="font-medium">Upload File</h4>
                    <p className="text-xs text-muted-foreground">PDF, EPUB, or TXT</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Content Input */}
          {uploadMethod === 'text' ? (
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium">
                Chapter Content
              </Label>
              <Textarea
                id="content"
                value={chapterText}
                onChange={(e) => setChapterText(e.target.value)}
                placeholder="Paste your chapter content here..."
                className="min-h-[200px] bg-input border-border focus:border-primary resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                {chapterText.length > 0 && `${chapterText.split(/\s+/).length} words`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="file" className="text-sm font-medium">
                Upload File
              </Label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, EPUB, or TXT files only
                  </p>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.epub,.txt,text/plain,application/pdf,application/epub+zip"
                    className="hidden"
                  />
                  <Label 
                    htmlFor="file" 
                    className="inline-block mt-3 px-4 py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer hover:bg-secondary/80"
                  >
                    Choose File
                  </Label>
                </div>

                {selectedFile && (
                  <Card className="p-3 bg-accent/5 border-accent/20">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(selectedFile.name)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !chapterTitle || (uploadMethod === 'text' ? !chapterText : !selectedFile)}
              className="bg-gradient-primary hover:shadow-typing transition-all duration-300"
            >
              {isLoading ? 'Adding...' : 'Add Chapter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChapterDialog;