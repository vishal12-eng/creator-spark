import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Youtube, Instagram, Copy, Check, Loader2, Lightbulb, Hash, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface VideoIdea {
  id: string;
  title: string;
  hook: string;
  description: string;
  hashtags: string[];
  outline: string[];
}

const VideoIdeas = () => {
  const { toast } = useToast();
  const [niche, setNiche] = useState('');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'instagram'>('youtube');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateIdeas = async () => {
    if (!niche.trim()) {
      toast({ title: 'Please enter a niche', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockIdeas: VideoIdea[] = [
      {
        id: '1',
        title: `${platform === 'youtube' ? '🔥' : '📱'} ${niche} Secret That Nobody Talks About`,
        hook: `"I discovered something about ${niche} that changed everything..."`,
        description: `In this video, I reveal the hidden truth about ${niche} that most creators miss. This single insight helped me grow faster than ever before.`,
        hashtags: [`#${niche.replace(/\s+/g, '')}`, '#GrowthHacking', '#CreatorTips', '#ViralContent', '#ContentCreation'],
        outline: ['Hook with surprising statement', 'Share personal story', 'Reveal the secret', 'Show proof/results', 'Call to action']
      },
      {
        id: '2',
        title: `I Tried ${niche} For 30 Days - Here's What Happened`,
        hook: `"Day 1 vs Day 30... you won't believe the difference"`,
        description: `A complete 30-day journey documenting my experience with ${niche}. Real results, real struggles, and everything I learned along the way.`,
        hashtags: [`#${niche.replace(/\s+/g, '')}`, '#30DayChallenge', '#Transformation', '#Journey', '#Results'],
        outline: ['Before state', 'Daily highlights montage', 'Biggest challenges', 'Final results reveal', 'Key takeaways']
      },
      {
        id: '3',
        title: `Stop Doing ${niche} Wrong (Do This Instead)`,
        hook: `"90% of people make this mistake with ${niche}..."`,
        description: `The biggest mistakes I see beginners make in ${niche} and the simple fixes that will transform your results immediately.`,
        hashtags: [`#${niche.replace(/\s+/g, '')}`, '#Mistakes', '#ProTips', '#Tutorial', '#HowTo'],
        outline: ['Common mistake #1', 'Why it hurts you', 'The fix', 'Common mistake #2', 'Action steps']
      },
    ];

    setIdeas(mockIdeas);
    setIsGenerating(false);
    toast({ title: 'Ideas generated!', description: '3 viral video ideas ready for you' });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Lightbulb className="h-8 w-8 text-primary" />
          Video Ideas Generator
        </h1>
        <p className="text-muted-foreground">
          Generate viral video ideas, SEO-optimized titles, hooks, and content outlines
        </p>
      </motion.div>

      {/* Generator Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate Ideas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Platform Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={platform === 'youtube' ? 'default' : 'outline'}
                  onClick={() => setPlatform('youtube')}
                  className="flex-1"
                >
                  <Youtube className="h-4 w-4 mr-2" />
                  YouTube
                </Button>
                <Button
                  type="button"
                  variant={platform === 'instagram' ? 'default' : 'outline'}
                  onClick={() => setPlatform('instagram')}
                  className="flex-1"
                >
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
              </div>
            </div>

            {/* Niche Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Niche *</label>
              <Input
                placeholder="e.g., Tech Reviews, Fitness, Cooking, Gaming..."
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>

            {/* Topic Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Specific Topic (Optional)</label>
              <Textarea
                placeholder="Any specific topic or trend you want to cover?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateIdeas}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Ideas...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Generate Viral Ideas
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generated Ideas */}
      {ideas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold">Generated Ideas</h2>
          
          <div className="grid gap-4">
            {ideas.map((idea, index) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 space-y-4">
                    {/* Title */}
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-primary">{idea.title}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(idea.title, `title-${idea.id}`)}
                      >
                        {copiedId === `title-${idea.id}` ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Hook */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Zap className="h-4 w-4" /> Hook
                      </p>
                      <p className="text-foreground italic">{idea.hook}</p>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Description
                      </p>
                      <p className="text-muted-foreground">{idea.description}</p>
                    </div>

                    {/* Hashtags */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Hash className="h-4 w-4" /> Hashtags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {idea.hashtags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Outline */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Video Outline</p>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        {idea.outline.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Copy All Button */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => copyToClipboard(
                        `Title: ${idea.title}\n\nHook: ${idea.hook}\n\nDescription: ${idea.description}\n\nHashtags: ${idea.hashtags.join(' ')}\n\nOutline:\n${idea.outline.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
                        `all-${idea.id}`
                      )}
                    >
                      {copiedId === `all-${idea.id}` ? (
                        <>
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy All
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VideoIdeas;
