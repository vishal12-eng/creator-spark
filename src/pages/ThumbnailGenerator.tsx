import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Image,
  Upload,
  Sparkles,
  Download,
  RefreshCw,
  Youtube,
  Instagram,
  Smile,
  Frown,
  Meh,
  Zap,
  Wand2,
  Settings,
} from 'lucide-react';

const emotions = [
  { id: 'excited', label: 'Excited', icon: Sparkles },
  { id: 'happy', label: 'Happy', icon: Smile },
  { id: 'neutral', label: 'Neutral', icon: Meh },
  { id: 'shocked', label: 'Shocked', icon: Zap },
  { id: 'serious', label: 'Serious', icon: Frown },
];

const platforms = [
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
];

const ThumbnailGenerator: React.FC = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    niche: '',
    emotion: 'excited',
    platform: 'youtube',
    style: '',
  });

  const handleGenerate = async () => {
    if (!formData.title) {
      toast({
        title: 'Title Required',
        description: 'Please enter a video title to generate a thumbnail.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Set a placeholder generated thumbnail
    setGeneratedThumbnail('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1280&h=720&fit=crop');
    setIsGenerating(false);
    
    toast({
      title: 'Thumbnail Generated!',
      description: 'Your high-CTR thumbnail is ready for download.',
    });
  };

  const handleDownload = () => {
    toast({
      title: 'Download Started',
      description: 'Your thumbnail is being downloaded.',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <Image className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold">AI Thumbnail Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Create eye-catching, high-CTR thumbnails with perfect face placement and bold text using advanced AI.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Thumbnail Settings
              </CardTitle>
              <CardDescription>
                Configure your thumbnail generation preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Video Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., How I Made $10K in 30 Days"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Niche */}
              <div className="space-y-2">
                <Label htmlFor="niche">Niche / Category</Label>
                <Input
                  id="niche"
                  placeholder="e.g., Finance, Gaming, Tech"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                />
              </div>

              {/* Platform Selection */}
              <div className="space-y-2">
                <Label>Platform</Label>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => setFormData({ ...formData, platform: platform.id })}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        formData.platform === platform.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <platform.icon className={`w-5 h-5 ${formData.platform === platform.id ? 'text-primary' : ''}`} />
                      <span className="font-medium">{platform.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emotion Selection */}
              <div className="space-y-2">
                <Label>Emotion / Vibe</Label>
                <div className="grid grid-cols-5 gap-2">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.id}
                      onClick={() => setFormData({ ...formData, emotion: emotion.id })}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        formData.emotion === emotion.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <emotion.icon className={`w-5 h-5 ${formData.emotion === emotion.id ? 'text-primary' : ''}`} />
                      <span className="text-xs font-medium">{emotion.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Instructions */}
              <div className="space-y-2">
                <Label htmlFor="style">Style Instructions (Optional)</Label>
                <Textarea
                  id="style"
                  placeholder="e.g., Bold red text, my face on the left, money graphics..."
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Upload Reference */}
              <div className="space-y-2">
                <Label>Upload Reference (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drop your image here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                variant="premium"
                size="lg"
                className="w-full"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Thumbnail
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Preview
              </CardTitle>
              <CardDescription>
                Your generated thumbnail will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Thumbnail Preview */}
              <div className="aspect-video rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">AI is creating your thumbnail...</p>
                  </div>
                ) : generatedThumbnail ? (
                  <img
                    src={generatedThumbnail}
                    alt="Generated thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Image className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Your thumbnail will appear here</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {generatedThumbnail && (
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download 4K
                  </Button>
                </div>
              )}

              {generatedThumbnail && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleGenerate}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate with same settings
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ThumbnailGenerator;
