import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Image, Lightbulb, Trash2, Eye, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Thumbnail {
  id: string;
  title: string;
  style: string;
  image_url: string | null;
  created_at: string;
}

interface VideoIdeaRecord {
  id: string;
  niche: string;
  platform: string;
  ideas: any;
  created_at: string;
}

const History = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [videoIdeas, setVideoIdeas] = useState<VideoIdeaRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      loadHistory();
    }
  }, [session]);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      // Load thumbnails
      const { data: thumbData, error: thumbError } = await supabase
        .from('thumbnails')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (thumbError) throw thumbError;
      setThumbnails(thumbData || []);

      // Load video ideas
      const { data: ideasData, error: ideasError } = await supabase
        .from('video_ideas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (ideasError) throw ideasError;
      setVideoIdeas(ideasData || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteThumbnail = async (id: string) => {
    try {
      const { error } = await supabase.from('thumbnails').delete().eq('id', id);
      if (error) throw error;
      setThumbnails(prev => prev.filter(t => t.id !== id));
      toast({ title: 'Thumbnail deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const deleteVideoIdea = async (id: string) => {
    try {
      const { error } = await supabase.from('video_ideas').delete().eq('id', id);
      if (error) throw error;
      setVideoIdeas(prev => prev.filter(v => v.id !== id));
      toast({ title: 'Video ideas deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <HistoryIcon className="h-8 w-8 text-primary" />
          Generation History
        </h1>
        <p className="text-muted-foreground">
          View and manage your previously generated content
        </p>
      </motion.div>

      <Tabs defaultValue="thumbnails" className="space-y-6">
        <TabsList>
          <TabsTrigger value="thumbnails" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Thumbnails ({thumbnails.length})
          </TabsTrigger>
          <TabsTrigger value="ideas" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Video Ideas ({videoIdeas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="thumbnails">
          {thumbnails.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-2">No thumbnails yet</h3>
                <p className="text-muted-foreground text-sm">
                  Generate your first thumbnail to see it here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {thumbnails.map((thumbnail, index) => (
                <motion.div
                  key={thumbnail.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative">
                      {thumbnail.image_url ? (
                        <img
                          src={thumbnail.image_url}
                          alt={thumbnail.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Image className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium truncate mb-1">{thumbnail.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(thumbnail.created_at), 'MMM d, yyyy')}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => thumbnail.image_url && window.open(thumbnail.image_url, '_blank')}
                          disabled={!thumbnail.image_url}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteThumbnail(thumbnail.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ideas">
          {videoIdeas.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Lightbulb className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-2">No video ideas yet</h3>
                <p className="text-muted-foreground text-sm">
                  Generate your first video ideas to see them here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {videoIdeas.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-primary" />
                          {record.niche} - {record.platform}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(record.created_at), 'MMM d, yyyy')}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteVideoIdea(record.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Array.isArray(record.ideas) && record.ideas.slice(0, 3).map((idea: any, i: number) => (
                          <div key={i} className="p-3 bg-muted/50 rounded-lg">
                            <p className="font-medium text-sm">{idea.title}</p>
                            {idea.viralScore && (
                              <span className="text-xs text-green-500">
                                Viral Score: {idea.viralScore}/100
                              </span>
                            )}
                          </div>
                        ))}
                        {Array.isArray(record.ideas) && record.ideas.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{record.ideas.length - 3} more ideas
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;
