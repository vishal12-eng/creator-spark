import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { FileVideo, Wand2, Copy, Loader2, Clock, Mic, Target, Sparkles } from 'lucide-react';
import { FeatureGate } from '@/components/FeatureGate';
import { useToast } from '@/hooks/use-toast';

const AdvancedScripting: React.FC = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    topic: '',
    targetLength: '10',
    tone: 'educational',
    pacing: [50],
    includeHooks: true,
    includeCTA: true,
    format: 'youtube-long',
  });

  const handleGenerate = async () => {
    if (!formData.topic) {
      toast({ title: 'Topic required', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    // Simulate generation
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setGeneratedScript(`# ${formData.topic}

## Hook (0:00 - 0:30)
"What if I told you that 90% of creators are making this ONE mistake that's killing their growth?"

[DRAMATIC PAUSE]

"Today, I'm going to show you exactly how to fix it..."

## Introduction (0:30 - 2:00)
Hey everyone, welcome back to the channel! If you're new here, I'm [Your Name], and on this channel, we talk about...

## Main Content (2:00 - 8:00)
### Point 1: The Problem
Most creators don't realize that...

### Point 2: The Solution
Here's what you need to do instead...

### Point 3: Implementation
Let me show you step by step...

## Call to Action (8:00 - 10:00)
If you found this valuable, smash that like button and subscribe for more content like this!

---
*Estimated runtime: ${formData.targetLength} minutes*
*Tone: ${formData.tone}*
*Pacing: ${formData.pacing[0]}% energy*`);
    setIsGenerating(false);

    toast({ title: 'Script generated!', description: 'Your advanced video script is ready.' });
  };

  const copyScript = () => {
    if (generatedScript) {
      navigator.clipboard.writeText(generatedScript);
      toast({ title: 'Copied to clipboard!' });
    }
  };

  return (
    <FeatureGate featureId="advanced_video_scripting">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <FileVideo className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold">Advanced Video Scripting</h1>
          </div>
          <p className="text-muted-foreground">
            Create professional, structured video scripts with advanced AI controls. Pro feature.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Script Configuration
                </CardTitle>
                <CardDescription>Fine-tune every aspect of your video script</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Video Topic *</Label>
                  <Input
                    placeholder="e.g., How to grow on YouTube in 2024"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Target Length (min)
                    </Label>
                    <Select
                      value={formData.targetLength}
                      onValueChange={(v) => setFormData({ ...formData, targetLength: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 minutes (Short)</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="20">20+ minutes (Long)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Tone
                    </Label>
                    <Select
                      value={formData.tone}
                      onValueChange={(v) => setFormData({ ...formData, tone: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="educational">Educational</SelectItem>
                        <SelectItem value="entertaining">Entertaining</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual/Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Format
                  </Label>
                  <Select
                    value={formData.format}
                    onValueChange={(v) => setFormData({ ...formData, format: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube-long">YouTube Long-form</SelectItem>
                      <SelectItem value="youtube-short">YouTube Shorts</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram-reel">Instagram Reel</SelectItem>
                      <SelectItem value="podcast">Podcast Script</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Energy/Pacing: {formData.pacing[0]}%</Label>
                  <Slider
                    value={formData.pacing}
                    onValueChange={(v) => setFormData({ ...formData, pacing: v })}
                    max={100}
                    step={10}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Calm</span>
                    <span>Balanced</span>
                    <span>High Energy</span>
                  </div>
                </div>

                <Button
                  variant="premium"
                  size="lg"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Script...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Advanced Script
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Script</span>
                  {generatedScript && (
                    <Button variant="ghost" size="sm" onClick={copyScript}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">AI is crafting your script...</p>
                  </div>
                ) : generatedScript ? (
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg overflow-auto max-h-[500px]">
                      {generatedScript}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileVideo className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Your script will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </FeatureGate>
  );
};

export default AdvancedScripting;
