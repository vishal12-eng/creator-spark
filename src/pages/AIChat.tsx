import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  'How do I generate a thumbnail?',
  'What makes a good video title?',
  'How can I improve my CTR?',
  'Tips for growing my channel',
  'How to use the analytics feature?',
];

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI Creator Assistant. I'm here to help you grow your YouTube and Instagram channels. I know everything about this platform and can guide you through:\n\n• Creating high-CTR thumbnails\n• Generating viral video ideas\n• Analyzing your content for improvements\n• Building your channel brand\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('thumbnail')) {
      return "Great question about thumbnails! Here's how to use our Thumbnail Generator:\n\n1. Go to **Thumbnail Generator** in the sidebar\n2. Enter your video title and select your niche\n3. Choose an emotion type (curiosity, excitement, etc.)\n4. Optionally upload a reference image\n5. Click 'Generate Thumbnail'\n\n**Pro Tips:**\n• Use contrasting colors for better visibility\n• Include faces when possible (they increase CTR by 38%)\n• Keep text under 5 words\n• Test multiple versions\n\nWould you like me to explain any of these steps in more detail?";
    }
    
    if (lowerMessage.includes('title') || lowerMessage.includes('headline')) {
      return "Video titles are crucial for CTR! Here are my top tips:\n\n**Title Formulas That Work:**\n• \"How I [achieved result] in [timeframe]\"\n• \"[Number] [Topic] Secrets Nobody Tells You\"\n• \"Why [common belief] is Wrong\"\n• \"I Tried [thing] for [time] - Here's What Happened\"\n\n**Best Practices:**\n• Keep it under 60 characters\n• Front-load important keywords\n• Use power words (Ultimate, Secret, Proven)\n• Create curiosity gaps\n• Add numbers when relevant\n\nUse our **Video Ideas** generator to get AI-optimized titles for your niche!";
    }
    
    if (lowerMessage.includes('ctr') || lowerMessage.includes('click')) {
      return "Improving CTR (Click-Through Rate) is key to growth! Here's what works:\n\n**1. Thumbnail Optimization**\n• High contrast, readable text\n• Expressive faces\n• Bright, saturated colors\n\n**2. Title Optimization**\n• Create curiosity\n• Use emotional triggers\n• Promise clear value\n\n**3. Test & Iterate**\n• Use our Analytics tool to analyze your content\n• A/B test thumbnails when possible\n• Check your CTR in YouTube Studio\n\n**Industry Benchmarks:**\n• 2-4% CTR = Average\n• 4-6% CTR = Good\n• 6%+ CTR = Excellent\n\nWant me to analyze a specific video title for you?";
    }
    
    if (lowerMessage.includes('grow') || lowerMessage.includes('growth') || lowerMessage.includes('subscribers')) {
      return "Channel growth is a marathon, not a sprint! Here's my strategic advice:\n\n**Quick Wins:**\n• Optimize existing videos with better titles/thumbnails\n• Post consistently (2-3x per week minimum)\n• Engage with every comment in first hour\n\n**Medium-term Strategy:**\n• Find your unique angle in your niche\n• Create content series that encourage binge-watching\n• Collaborate with similar-sized creators\n\n**Long-term Success:**\n• Build an email list\n• Diversify platforms (YouTube + Instagram)\n• Create evergreen content that ranks\n\n**Use Our Tools:**\n• 🎨 Thumbnail Generator for better CTR\n• 💡 Video Ideas for trending topics\n• 📊 Analytics to find what's working\n• 🎯 Branding for professional presence\n\nWhat specific aspect of growth would you like to focus on?";
    }
    
    if (lowerMessage.includes('analytics') || lowerMessage.includes('analyze')) {
      return "Our Analytics feature helps you understand and improve your content! Here's how:\n\n**How to Use Analytics:**\n1. Go to **Analytics** in the sidebar\n2. Paste your video title, description, and tags\n3. Optionally upload your thumbnail\n4. Click 'Analyze Content'\n\n**What You'll Get:**\n• SEO Score - How well optimized for search\n• CTR Potential - Predicted click performance\n• Keyword Strength - Tag effectiveness\n• Hook Effectiveness - First 5 seconds quality\n• Detailed improvement suggestions\n• Optimized versions of your content\n\nThe AI will identify issues and give you specific fixes. Would you like to try it now?";
    }
    
    if (lowerMessage.includes('brand') || lowerMessage.includes('logo') || lowerMessage.includes('name')) {
      return "Building a strong brand is essential! Our Branding tool can help:\n\n**What You'll Get:**\n• 5 unique channel name suggestions\n• Logo concept ideas\n• Banner text recommendations\n• Complete 'About' section copy\n• Niche positioning strategy\n• Color palette suggestions\n• Content pillar ideas\n\n**Branding Tips:**\n• Keep your name memorable and easy to spell\n• Use consistent colors across all content\n• Create a recognizable intro/outro\n• Develop a signature style or catchphrase\n\nGo to **Branding** in the sidebar to generate your complete brand kit!";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hey there! 👋 Great to chat with you!\n\nI'm here to help you become a better content creator. What would you like to work on today?\n\n• 🎨 Create eye-catching thumbnails\n• 💡 Generate viral video ideas\n• 📊 Analyze your content performance\n• 🎯 Build your channel brand\n• 🚀 Learn growth strategies\n\nJust ask me anything!";
    }
    
    return "That's a great question! While I'm still learning about specific topics, here's what I can help you with right now:\n\n**Platform Features:**\n• **Thumbnail Generator** - Create click-worthy thumbnails\n• **Video Ideas** - Get viral content ideas with SEO titles\n• **Analytics** - Analyze and improve your content\n• **Branding** - Build your complete channel identity\n\n**Growth Topics:**\n• CTR optimization\n• SEO strategies\n• Content planning\n• Audience building\n\nTry asking me about any of these topics, or explore the tools in the sidebar!";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateResponse(userMessage.content),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-6"
      >
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          AI Chat Assistant
        </h1>
        <p className="text-muted-foreground">
          Get help with the platform, content creation tips, and growth strategies
        </p>
      </motion.div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-muted p-4 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Quick questions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about content creation..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={!input.trim() || isLoading}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AIChat;
