import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Upload, Loader2, CheckCircle, AlertCircle, TrendingUp, Target, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FeatureGate } from '@/components/FeatureGate';

interface AnalysisResult {
  seoScore: number;
  ctrPotential: number;
  keywordStrength: number;
  hookEffectiveness: number;
  thumbnailReadability: number;
  overallScore: number;
  issues: { type: 'error' | 'warning'; message: string }[];
  improvements: string[];
  optimizedTitle: string;
  optimizedDescription: string;
}

const Analytics = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
    }
  };

  const analyzeContent = async () => {
    if (!title.trim()) {
      toast({ title: 'Please enter a video title', variant: 'destructive' });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-content', {
        body: { title, description, tags },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      if (data.success && data.result) {
        const analysisResult = data.result as AnalysisResult;
        setResult(analysisResult);

        // Save to database
        if (session?.user) {
          await supabase.from('analytics_reports').insert({
            user_id: session.user.id,
            title,
            description,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            seo_score: analysisResult.seoScore,
            ctr_potential: analysisResult.ctrPotential,
            keyword_strength: analysisResult.keywordStrength,
            hook_effectiveness: analysisResult.hookEffectiveness,
            thumbnail_readability: analysisResult.thumbnailReadability,
            overall_score: analysisResult.overallScore,
            issues: analysisResult.issues,
            improvements: analysisResult.improvements,
            optimized_title: analysisResult.optimizedTitle,
            optimized_description: analysisResult.optimizedDescription,
          });
        }

        toast({ title: 'Analysis complete!', description: 'Check your detailed report below' });
      }
    } catch (error) {
      console.error('Error analyzing content:', error);
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <FeatureGate featureId="content_analytics">
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Content Analytics
        </h1>
        <p className="text-muted-foreground">
          Analyze your video content for SEO, CTR potential, and get AI-powered improvements
        </p>
      </motion.div>

      {/* Analysis Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Analyze Your Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Video Title *</label>
              <Input
                placeholder="Enter your video title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Paste your video description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma separated)</label>
              <Input
                placeholder="tag1, tag2, tag3..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            {/* Thumbnail Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Thumbnail (Optional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label htmlFor="thumbnail-upload" className="cursor-pointer">
                  {thumbnailFile ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <CheckCircle className="h-5 w-5" />
                      {thumbnailFile.name}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="h-8 w-8" />
                      <span>Upload thumbnail for analysis</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Analyze Button */}
            <Button
              onClick={analyzeContent}
              disabled={isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing Content...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analyze Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Score */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Overall Score</h3>
                  <p className="text-muted-foreground">Based on SEO, CTR, and content quality</p>
                </div>
                <div className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}>
                  {result.overallScore}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'SEO Score', value: result.seoScore, icon: Search },
              { label: 'CTR Potential', value: result.ctrPotential, icon: Target },
              { label: 'Keyword Strength', value: result.keywordStrength, icon: TrendingUp },
              { label: 'Hook Effectiveness', value: result.hookEffectiveness, icon: FileText },
              { label: 'Thumbnail Readability', value: result.thumbnailReadability, icon: BarChart3 },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <metric.icon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{metric.label}</span>
                      </div>
                      <span className={`font-bold ${getScoreColor(metric.value)}`}>
                        {metric.value}%
                      </span>
                    </div>
                    <Progress value={metric.value} className={`h-2 ${getProgressColor(metric.value)}`} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Issues */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Issues Found
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.issues.map((issue, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    issue.type === 'error' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                  }`}
                >
                  <AlertCircle className={`h-5 w-5 mt-0.5 ${
                    issue.type === 'error' ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                  <span>{issue.message}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Suggested Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10"
                >
                  <CheckCircle className="h-5 w-5 mt-0.5 text-green-500" />
                  <span>{improvement}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Optimized Content */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Optimized Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Optimized Title</label>
                <div className="p-3 bg-primary/10 rounded-lg">
                  {result.optimizedTitle}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Optimized Description</label>
                <div className="p-3 bg-primary/10 rounded-lg whitespace-pre-wrap">
                  {result.optimizedDescription}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
    </FeatureGate>
  );
};

export default Analytics;
