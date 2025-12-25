import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Loader2, TrendingUp, TrendingDown, AlertTriangle, 
  Lightbulb, Zap, Users, DollarSign, BarChart3, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface NicheAnalysisResult {
  competitionLevel: string;
  competitionScore: number;
  growthOpportunity: string;
  growthScore: number;
  monetizationPotential: string;
  monetizationScore: number;
  topCompetitors: string[];
  subNiches: string[];
  contentGaps: string[];
  trendingTopics: string[];
  recommendations: string[];
}

const platforms = [
  { value: 'YouTube', label: 'YouTube' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Twitter', label: 'Twitter/X' },
];

const NicheAnalyzer = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [niche, setNiche] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<NicheAnalysisResult | null>(null);

  const analyzeNiche = async () => {
    if (!niche.trim()) {
      toast({ title: 'Please enter a niche', variant: 'destructive' });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-niche', {
        body: { niche, platform },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      if (data.success && data.result) {
        const analysisResult = data.result as NicheAnalysisResult;
        setResult(analysisResult);

        // Save to database
        if (session?.user) {
          await supabase.from('niche_analyses').insert({
            user_id: session.user.id,
            niche,
            platform,
            competition_level: analysisResult.competitionLevel,
            competition_score: analysisResult.competitionScore,
            growth_opportunity: analysisResult.growthOpportunity,
            growth_score: analysisResult.growthScore,
            monetization_potential: analysisResult.monetizationPotential,
            monetization_score: analysisResult.monetizationScore,
            top_competitors: analysisResult.topCompetitors,
            sub_niches: analysisResult.subNiches,
            content_gaps: analysisResult.contentGaps,
            trending_topics: analysisResult.trendingTopics,
            recommendations: analysisResult.recommendations,
          });
        }

        toast({ title: 'Analysis complete!', description: 'Check your niche report below' });
      }
    } catch (error) {
      console.error('Error analyzing niche:', error);
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
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCompetitionColor = (score: number) => {
    // Lower competition = better (green)
    if (score <= 40) return 'text-green-500';
    if (score <= 70) return 'text-yellow-500';
    return 'text-red-500';
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
          <Target className="h-8 w-8 text-primary" />
          Niche Competition Analyzer
        </h1>
        <p className="text-muted-foreground">
          Analyze competition, growth opportunity, and find untapped sub-niches in your market
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
              <BarChart3 className="h-5 w-5 text-primary" />
              Analyze Your Niche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Niche */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Niche / Topic *</label>
                <Input
                  placeholder="e.g., Personal Finance, Gaming, Cooking..."
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                />
              </div>

              {/* Platform */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform</label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Analyze Button */}
            <Button
              onClick={analyzeNiche}
              disabled={isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing Market...
                </>
              ) : (
                <>
                  <Target className="h-5 w-5 mr-2" />
                  Analyze Niche
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
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Users className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Competition</p>
                    <p className={`text-xl font-bold ${getCompetitionColor(result.competitionScore)}`}>
                      {result.competitionLevel}
                    </p>
                  </div>
                </div>
                <Progress value={result.competitionScore} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {result.competitionScore <= 40 ? 'Great opportunity!' : 
                   result.competitionScore <= 70 ? 'Moderate competition' : 'Highly competitive'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Growth Potential</p>
                    <p className={`text-xl font-bold ${getScoreColor(result.growthScore)}`}>
                      {result.growthScore}%
                    </p>
                  </div>
                </div>
                <Progress value={result.growthScore} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {result.growthOpportunity}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monetization</p>
                    <p className={`text-xl font-bold ${getScoreColor(result.monetizationScore)}`}>
                      {result.monetizationScore}%
                    </p>
                  </div>
                </div>
                <Progress value={result.monetizationScore} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {result.monetizationPotential}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Competitor Analysis */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Top Competitor Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {result.topCompetitors.map((competitor, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <span>{competitor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sub-Niches */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Less Competitive Sub-Niches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.subNiches.map((subNiche, index) => (
                  <div key={index} className="p-3 bg-yellow-500/10 rounded-lg flex items-center gap-2">
                    <Target className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm">{subNiche}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Gaps */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Content Gaps to Fill
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.contentGaps.map((gap, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg">
                  <Zap className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>{gap}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.trendingTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                    {index + 1}
                  </div>
                  <span>{rec}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default NicheAnalyzer;
