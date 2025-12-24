import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Loader2, Sparkles, User, Image, FileText, Target, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface BrandingResult {
  channelNames: string[];
  logoIdeas: string[];
  bannerText: string;
  aboutSection: string;
  nichePositioning: string;
  colorPalette: string[];
  contentPillars: string[];
}

const Branding = () => {
  const { toast } = useToast();
  const [niche, setNiche] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [personality, setPersonality] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<BrandingResult | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const generateBranding = async () => {
    if (!niche.trim()) {
      toast({ title: 'Please enter your niche', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const nicheClean = niche.charAt(0).toUpperCase() + niche.slice(1);
    
    const mockResult: BrandingResult = {
      channelNames: [
        `${nicheClean} Mastery`,
        `The ${nicheClean} Lab`,
        `${nicheClean} Unlocked`,
        `Rise with ${nicheClean}`,
        `${nicheClean} Insider`,
      ],
      logoIdeas: [
        `Minimalist icon representing ${niche} with gradient accent`,
        `Bold typography with a creative twist on the first letter`,
        `Abstract geometric shape symbolizing growth and ${niche}`,
        `Combination mark with initials and a ${niche}-related symbol`,
      ],
      bannerText: `Master ${nicheClean} • Weekly Tips & Tutorials • Join 10K+ Creators`,
      aboutSection: `Welcome to your ultimate resource for ${niche}! 🚀

I'm dedicated to helping you master ${niche} through actionable tips, in-depth tutorials, and real-world strategies that actually work.

What you'll find here:
✅ Weekly ${niche} tutorials and tips
✅ Behind-the-scenes insights
✅ Community challenges and growth strategies
✅ Exclusive content for subscribers

📧 Business inquiries: contact@example.com
🔔 New videos every Tuesday & Friday

#${niche.replace(/\s+/g, '')} #Growth #Creator`,
      nichePositioning: `Position yourself as the "Practical ${nicheClean} Expert" who breaks down complex topics into actionable, beginner-friendly content. Focus on transformation stories and measurable results to build trust and authority.`,
      colorPalette: ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'],
      contentPillars: [
        `${nicheClean} Tutorials & How-Tos`,
        `Industry News & Trends`,
        `Tool Reviews & Comparisons`,
        `Success Stories & Case Studies`,
        `Q&A and Community Spotlights`,
      ],
    };

    setResult(mockResult);
    setIsGenerating(false);
    toast({ title: 'Branding generated!', description: 'Your complete brand kit is ready' });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2000);
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
          <Palette className="h-8 w-8 text-primary" />
          Channel Branding
        </h1>
        <p className="text-muted-foreground">
          Generate a complete brand identity for your channel including name, logo ideas, and positioning
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
              Generate Brand Kit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Niche */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Niche *</label>
              <Input
                placeholder="e.g., Tech Reviews, Fitness, Personal Finance..."
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Input
                placeholder="e.g., Beginners aged 18-35 interested in..."
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />
            </div>

            {/* Personality */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand Personality</label>
              <Textarea
                placeholder="Describe your brand's tone and personality (e.g., professional, friendly, humorous...)"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={generateBranding}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Brand Kit...
                </>
              ) : (
                <>
                  <Palette className="h-5 w-5 mr-2" />
                  Generate Brand Kit
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Channel Names */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Channel Name Ideas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.channelNames.map((name, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <span className="font-medium">{name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(name, `name-${index}`)}
                  >
                    {copiedItem === `name-${index}` ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Logo Ideas */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Logo Concepts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.logoIdeas.map((idea, index) => (
                <div
                  key={index}
                  className="p-3 bg-primary/5 rounded-lg"
                >
                  <span className="text-muted-foreground">💡 {idea}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Suggested Color Palette
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                {result.colorPalette.map((color, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div
                      className="w-16 h-16 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color, `color-${index}`)}
                    />
                    <span className="text-xs font-mono text-muted-foreground">{color}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Banner Text */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Banner Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg">
                <span className="font-semibold text-lg">{result.bannerText}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(result.bannerText, 'banner')}
                >
                  {copiedItem === 'banner' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  About Section
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(result.aboutSection, 'about')}
                >
                  {copiedItem === 'about' ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-primary/5 rounded-lg whitespace-pre-wrap">
                {result.aboutSection}
              </div>
            </CardContent>
          </Card>

          {/* Niche Positioning */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Niche Positioning Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{result.nichePositioning}</p>
            </CardContent>
          </Card>

          {/* Content Pillars */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Content Pillars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {result.contentPillars.map((pillar, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                    <span>{pillar}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Branding;
