import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Upload, Play } from 'lucide-react';
import TypingInterface from './TypingInterface';

interface Chunk {
  id: number;
  text: string;
  wordCount: number;
}

interface Chapter {
  id: number;
  title: string;
  chunks: Chunk[];
}

interface TextManagerProps {
  onProgressUpdate?: (progress: any) => void;
}

// Sample text for demonstration
const sampleText = `In the world of continuous typing, every keystroke matters. The art of combining reading and typing creates a unique learning experience that enhances both comprehension and muscle memory. As you progress through each chunk of text, your fingers learn the patterns while your mind absorbs the content. This synergy between reading and typing transforms the traditional approach to both activities, creating something entirely new and engaging.

The beauty of this method lies in its simplicity and effectiveness. Rather than separating reading and typing into distinct activities, we merge them into one fluid experience. Each word becomes a stepping stone, each sentence a milestone, and each paragraph a chapter in your journey toward mastery.

Research has shown that active engagement with text through typing significantly improves retention and understanding. When you type what you read, you're not just passively consuming information – you're actively participating in the learning process. Your brain forms stronger neural pathways, creating lasting memories that pure reading alone cannot achieve.

Welcome to the future of reading and typing practice. Welcome to a world where every character typed brings you closer to both literary appreciation and typing mastery.`;

const TextManager: React.FC<TextManagerProps> = ({ onProgressUpdate }) => {
  const [currentMode, setCurrentMode] = useState<'home' | 'typing'>('home');
  const [currentChapter] = useState<Chapter>({
    id: 1,
    title: 'Getting Started with Tovel',
    chunks: chunkText(sampleText, 40)
  });
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [userText, setUserText] = useState('');

  // Function to split text into chunks of at least 40 words
  function chunkText(text: string, minWords: number): Chunk[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks: Chunk[] = [];
    let currentChunk = '';
    let chunkId = 0;

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      const testChunk = currentChunk + (currentChunk ? '. ' : '') + trimmedSentence + '.';
      const wordCount = testChunk.split(/\s+/).length;

      if (wordCount >= minWords && currentChunk) {
        // Complete current chunk
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

    // Add remaining text as final chunk
    if (currentChunk.trim()) {
      chunks.push({
        id: chunkId++,
        text: currentChunk.trim(),
        wordCount: currentChunk.split(/\s+/).length
      });
    }

    return chunks;
  }

  const handleChunkComplete = useCallback((stats: any) => {
    onProgressUpdate?.({
      chapter: currentChapter.id,
      chunkNumber: currentChunkIndex + 1,
      totalChunks: currentChapter.chunks.length,
      ...stats
    });

    // Move to next chunk after a delay
    setTimeout(() => {
      if (currentChunkIndex < currentChapter.chunks.length - 1) {
        setCurrentChunkIndex(prev => prev + 1);
      } else {
        // Chapter completed
        alert('Chapter completed! 🎉');
        setCurrentMode('home');
        setCurrentChunkIndex(0);
      }
    }, 2000);
  }, [currentChapter, currentChunkIndex, onProgressUpdate]);

  const handleStartTyping = () => {
    setCurrentMode('typing');
    setCurrentChunkIndex(0);
  };

  const handleCustomText = () => {
    if (userText.trim()) {
      const customChapter: Chapter = {
        id: 999,
        title: 'Custom Text',
        chunks: chunkText(userText, 40)
      };
      // For now, we'll just start with the sample text
      // In the full implementation, we'd handle custom text here
      handleStartTyping();
    }
  };

  if (currentMode === 'typing') {
    const currentChunk = currentChapter.chunks[currentChunkIndex];
    
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              {currentChapter.title}
            </h1>
            <p className="text-muted-foreground">
              Chunk {currentChunkIndex + 1} of {currentChapter.chunks.length}
            </p>
          </div>

          <TypingInterface
            text={currentChunk.text}
            onChunkComplete={handleChunkComplete}
            chunkProgress={currentChunkIndex + 1}
            totalChunks={currentChapter.chunks.length}
          />

          {/* Navigation to Dashboard */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
              className="border-border hover:bg-secondary mr-4"
            >
              Browse Library
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentMode('home')}
              className="border-border hover:bg-secondary"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Tovel
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Continuous Typing Reader
          </p>
          <p className="text-lg text-pending max-w-2xl mx-auto">
            Master typing while reading through your favorite books, textbooks, and articles. 
            Experience seamless progression with real-time feedback and detailed analytics.
          </p>
        </div>

        {/* Navigation to Dashboard */}
        <div className="text-center mb-8">
          <Button 
            onClick={() => window.location.href = '/dashboard'}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            size="lg"
          >
            Browse Your Library
          </Button>
        </div>

        {/* Main Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Sample Text */}
          <Card className="p-8 bg-gradient-surface border-border/50 shadow-card hover:shadow-glow transition-all duration-300">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center shadow-typing">
                <FileText className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Start Reading</h2>
              <p className="text-muted-foreground">
                Begin with our sample text to experience the Tovel typing method.
              </p>
              <Button 
                onClick={handleStartTyping}
                className="w-full bg-gradient-primary hover:shadow-typing transition-all duration-300"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Typing
              </Button>
            </div>
          </Card>

          {/* Custom Text */}
          <Card className="p-8 bg-gradient-surface border-border/50 shadow-card hover:shadow-glow transition-all duration-300">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-accent rounded-full flex items-center justify-center shadow-typing">
                <Upload className="w-8 h-8 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Custom Text</h2>
              <p className="text-muted-foreground">
                Paste your own text or upload files to practice with your content.
              </p>
              <div className="space-y-3">
                <textarea
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  placeholder="Paste your text here..."
                  className="w-full h-32 p-3 bg-input border border-border rounded-md text-foreground resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button 
                  onClick={handleCustomText}
                  variant="outline"
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                  size="lg"
                  disabled={!userText.trim()}
                >
                  Use Custom Text
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="text-4xl">⚡</div>
            <h3 className="font-semibold text-foreground">Real-time Feedback</h3>
            <p className="text-sm text-muted-foreground">
              Instant visual feedback for every keystroke
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl">📊</div>
            <h3 className="font-semibold text-foreground">Detailed Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Track WPM, accuracy, and progress over time
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl">🌊</div>
            <h3 className="font-semibold text-foreground">Continuous Flow</h3>
            <p className="text-sm text-muted-foreground">
              Seamless transitions between chunks and chapters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextManager;