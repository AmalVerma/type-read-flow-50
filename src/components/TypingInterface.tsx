import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeElapsed: number;
}

interface TypingInterfaceProps {
  text: string;
  onChunkComplete?: (stats: TypingStats) => void;
  chunkProgress?: number;
  totalChunks?: number;
}

const TypingInterface: React.FC<TypingInterfaceProps> = ({
  text,
  onChunkComplete,
  chunkProgress = 1,
  totalChunks = 1,
}) => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    timeElapsed: 0,
  });
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Calculate current stats
  const calculateStats = useCallback((input: string, startTime: number) => {
    const now = Date.now();
    const timeElapsed = (now - startTime) / 1000; // in seconds
    const timeElapsedMinutes = timeElapsed / 60;

    let correctChars = 0;
    let incorrectChars = 0;

    for (let i = 0; i < input.length; i++) {
      if (i < text.length && input[i] === text[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    const totalChars = input.length;
    const accuracy = totalChars > 0 ? (correctChars / totalChars) * 100 : 100;
    const wordsTyped = correctChars / 5; // Standard: 5 characters = 1 word
    const wpm = timeElapsedMinutes > 0 ? Math.round(wordsTyped / timeElapsedMinutes) : 0;

    return {
      wpm,
      accuracy: Math.round(accuracy),
      correctChars,
      incorrectChars,
      totalChars,
      timeElapsed,
    };
  }, [text]);

  // Handle input change
  const handleInputChange = (value: string) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Prevent typing beyond text length
    if (value.length > text.length) {
      return;
    }

    setUserInput(value);

    if (startTime) {
      const newStats = calculateStats(value, startTime);
      setStats(newStats);

      // Check if chunk is complete
      if (value === text && !isComplete) {
        setIsComplete(true);
        onChunkComplete?.(newStats);
      }
    }
  };

  // Render character with appropriate styling
  const renderCharacter = (char: string, index: number) => {
    let className = 'typing-text ';
    
    if (index < userInput.length) {
      // Typed character
      if (userInput[index] === char) {
        className += 'text-correct';
      } else {
        className += 'text-incorrect bg-incorrect/20';
      }
    } else if (index === userInput.length) {
      // Current character
      className += 'text-current bg-current/20 animate-pulse';
    } else {
      // Pending character
      className += 'text-pending';
    }

    return (
      <span key={index} className={className}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    );
  };

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Chunk {chunkProgress} of {totalChunks}</span>
          <span>{Math.round((userInput.length / text.length) * 100)}% complete</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(userInput.length / text.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-gradient-surface border-border/50">
          <div className="text-2xl font-bold text-primary">{stats.wpm}</div>
          <div className="text-sm text-muted-foreground">WPM</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-surface border-border/50">
          <div className="text-2xl font-bold text-accent">{stats.accuracy}%</div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-surface border-border/50">
          <div className="text-2xl font-bold text-correct">{stats.correctChars}</div>
          <div className="text-sm text-muted-foreground">Correct</div>
        </Card>
        <Card className="p-4 text-center bg-gradient-surface border-border/50">
          <div className="text-2xl font-bold text-incorrect">{stats.incorrectChars}</div>
          <div className="text-sm text-muted-foreground">Errors</div>
        </Card>
      </div>

      {/* Text Display */}
      <Card className="p-8 bg-gradient-surface border-border/50 shadow-card">
        <div className="typing-text leading-relaxed whitespace-pre-wrap break-words">
          {text.split('').map((char, index) => renderCharacter(char, index))}
        </div>
      </Card>

      {/* Hidden Input */}
      <textarea
        ref={inputRef}
        value={userInput}
        onChange={(e) => handleInputChange(e.target.value)}
        className="sr-only"
        aria-label="Typing input"
        disabled={isComplete}
      />

      {/* Instructions */}
      <div className="text-center text-muted-foreground text-sm">
        {isComplete ? (
          <div className="text-accent font-medium">
            Chunk completed! Great job! 🎉
          </div>
        ) : (
          <div>
            Start typing to begin. Your input is automatically captured.
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingInterface;