import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Youtube, Instagram, Copy, Check, Loader2, Lightbulb, Hash, FileText, Zap, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface VideoIdea {
  title: string;
  description: string;
  hashtags: string[];
  hook: string;
  viralScore: number;
  bestPostingTime: string;
}

const VideoIdeas = () => {
  const { toast } = useToast();
  const { session } = useAuth();
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
    setIdeas([]);

    try {
      const { data, error } = await supabase.functions.invoke('generate-video-ideas', {
        body: {
          niche: topic ? `${niche} - ${topic}` : niche,
          platform: platform === 'youtube' ? 'YouTube' : 'Instagram',
          count: 5,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.ideas && Array.isArray(data.ideas)) {
        setIdeas(data.ideas);

        // Save to database
        if (session?.user) {
          await supabase.from('video_ideas').insert({
            user_id: session.user.id,
            niche: niche,
            platform: platform,
            ideas: data.ideas,
          });
        }

        toast({ title: 'Ideas generated!', description: `${data.ideas.length} viral video ideas ready for you` });
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to generate ideas',
        variant: 'destructive' 
      });
    } finally {
      setIsGenerating(false);
    }
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
          Generate viral video ideas with AI-powered SEO titles, hooks, and hashtags
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
                  Generating Ideas with AI...
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
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 space-y-4">
                    {/* Title & Viral Score */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-primary">{idea.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">
                            Viral Score: {idea.viralScore}/100
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Best time: {idea.bestPostingTime}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(idea.title, `title-${index}`)}
                      >
                        {copiedId === `title-${index}` ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Hook */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Zap className="h-4 w-4" /> Hook (First 3 seconds)
                      </p>
                      <p className="text-foreground italic bg-muted/50 p-3 rounded-lg">"{idea.hook}"</p>
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
                        {idea.hashtags?.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Copy All Button */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => copyToClipboard(
                        `Title: ${idea.title}\n\nHook: ${idea.hook}\n\nDescription: ${idea.description}\n\nHashtags: ${idea.hashtags?.join(' ')}\n\nViral Score: ${idea.viralScore}/100\nBest Posting Time: ${idea.bestPostingTime}`,
                        `all-${index}`
                      )}
                    >
                      {copiedId === `all-${index}` ? (
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
