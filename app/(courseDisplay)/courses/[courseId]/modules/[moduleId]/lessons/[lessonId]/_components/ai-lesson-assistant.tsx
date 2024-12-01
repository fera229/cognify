'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesSquare, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIResponse {
  response: string;
  errors?: Array<{ message: string }>;
}

export default function AILessonAssistant() {
  const [prompt, setPrompt] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      const res = await fetch('/api/ai/lesson-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = (await res.json()) as AIResponse;
      setAiResponse(data.response);
    } catch (error) {
      console.error('AI request failed:', error);
      setAiResponse('Sorry, I was unable to process your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 md:bottom-4 right-4 md:right-4 z-[60]">
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="default"
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
      >
        <MessagesSquare className="h-6 w-6" />
      </Button>

      {/* Chat Interface */}
      {isOpen && (
        <>
          <div className="absolute bottom-16 right-0 w-[320px] md:w-[400px]">
            <X className="ml-auto h-4 w-4" onClick={() => setIsOpen(!isOpen)} />

            <Card className="border shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessagesSquare className="h-5 w-5" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    placeholder="Ask anything about your studies..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[100px] resize-none bg-white"
                    disabled={isLoading}
                  />

                  <div className="flex justify-end gap-2">
                    {(prompt || aiResponse) && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setPrompt('');
                          setAiResponse('');
                        }}
                        disabled={isLoading}
                      >
                        Clear
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isLoading || !prompt.trim()}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Ask AI'
                      )}
                    </Button>
                  </div>
                </form>

                {aiResponse && (
                  <div className="mt-4 p-4  bg-slate-50 rounded-lg">
                    <p className="text-sm overflow-scroll whitespace-pre-wrap">
                      {aiResponse}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
