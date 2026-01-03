import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Layers, Play, Pause, Download, Zap, FileText, Image, Hash, Loader2 } from 'lucide-react';
import { FeatureGate } from '@/components/FeatureGate';
import { Progress } from '@/components/ui/progress';

interface BatchJob {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: string;
}

const BatchGeneration: React.FC = () => {
  const [topics, setTopics] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['titles', 'descriptions']);
  const [isRunning, setIsRunning] = useState(false);
  const [jobs, setJobs] = useState<BatchJob[]>([]);

  const generationTypes = [
    { id: 'titles', label: 'Video Titles', icon: FileText, tokens: 1 },
    { id: 'descriptions', label: 'Descriptions', icon: FileText, tokens: 2 },
    { id: 'thumbnails', label: 'Thumbnail Ideas', icon: Image, tokens: 3 },
    { id: 'hashtags', label: 'Hashtags', icon: Hash, tokens: 1 },
    { id: 'scripts', label: 'Video Scripts', icon: FileText, tokens: 5 },
  ];

  const toggleType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
  };

  const handleStartBatch = async () => {
    if (!topics.trim() || selectedTypes.length === 0) return;

    const topicList = topics.split('\n').filter((t) => t.trim());
    const newJobs: BatchJob[] = topicList.flatMap((topic, i) =>
      selectedTypes.map((type, j) => ({
        id: `${i}-${j}`,
        type: `${type}: ${topic.trim()}`,
        status: 'pending' as const,
        progress: 0,
      }))
    );

    setJobs(newJobs);
    setIsRunning(true);

    // Simulate batch processing
    for (let i = 0; i < newJobs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setJobs((prev) =>
        prev.map((job, idx) =>
          idx === i
            ? { ...job, status: 'completed', progress: 100, result: 'Generated successfully!' }
            : idx === i + 1
            ? { ...job, status: 'processing', progress: 50 }
            : job
        )
      );
    }

    setIsRunning(false);
  };

  const totalTokens = selectedTypes.reduce((acc, type) => {
    const config = generationTypes.find((t) => t.id === type);
    return acc + (config?.tokens || 0);
  }, 0) * topics.split('\n').filter((t) => t.trim()).length;

  return (
    <FeatureGate featureId="batch_generation">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold">Batch Generation</h1>
          </div>
          <p className="text-muted-foreground">
            Generate multiple pieces of content at once. Pro feature for maximum productivity.
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
                <CardTitle>Batch Configuration</CardTitle>
                <CardDescription>Enter multiple topics and select generation types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Topics (one per line)</Label>
                  <Textarea
                    placeholder="How to grow on YouTube&#10;Best camera for beginners&#10;Content ideas for 2024"
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                    rows={6}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Generation Types</Label>
                  <div className="space-y-2">
                    {generationTypes.map((type) => (
                      <div
                        key={type.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={type.id}
                            checked={selectedTypes.includes(type.id)}
                            onCheckedChange={() => toggleType(type.id)}
                          />
                          <label htmlFor={type.id} className="flex items-center gap-2 cursor-pointer">
                            <type.icon className="w-4 h-4 text-muted-foreground" />
                            {type.label}
                          </label>
                        </div>
                        <span className="text-xs text-muted-foreground">{type.tokens} tokens each</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
                  <span className="text-sm">Estimated Token Usage</span>
                  <span className="font-bold text-primary">{totalTokens} tokens</span>
                </div>

                <Button
                  variant="premium"
                  size="lg"
                  className="w-full"
                  onClick={handleStartBatch}
                  disabled={isRunning || !topics.trim() || selectedTypes.length === 0}
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Batch...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Start Batch Generation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress & Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Batch Progress</span>
                  {jobs.length > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {jobs.filter((j) => j.status === 'completed').length}/{jobs.length} completed
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Layers className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Configure your batch and start generation</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-3 rounded-lg border border-border/50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate flex-1">{job.type}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              job.status === 'completed'
                                ? 'bg-green-500/20 text-green-400'
                                : job.status === 'processing'
                                ? 'bg-blue-500/20 text-blue-400'
                                : job.status === 'failed'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                        {job.status === 'processing' && (
                          <Progress value={job.progress} className="h-1" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {jobs.filter((j) => j.status === 'completed').length === jobs.length && jobs.length > 0 && (
                  <Button variant="outline" className="w-full mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download All Results
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </FeatureGate>
  );
};

export default BatchGeneration;
