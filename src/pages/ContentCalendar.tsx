import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Clock, Video, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import { FeatureGate } from '@/components/FeatureGate';

interface ScheduledContent {
  id: string;
  title: string;
  platform: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published';
}

const mockScheduledContent: ScheduledContent[] = [
  {
    id: '1',
    title: 'How to Start a YouTube Channel in 2024',
    platform: 'YouTube',
    scheduledDate: '2024-01-15',
    scheduledTime: '14:00',
    status: 'scheduled',
  },
  {
    id: '2',
    title: '5 Thumbnail Secrets for Higher CTR',
    platform: 'YouTube',
    scheduledDate: '2024-01-18',
    scheduledTime: '16:00',
    status: 'draft',
  },
];

const ContentCalendar: React.FC = () => {
  const [scheduledContent] = useState<ScheduledContent[]>(mockScheduledContent);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-400';
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <FeatureGate featureId="content_calendar">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold">Content Calendar</h1>
            </div>
            <Button variant="premium">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Content
            </Button>
          </div>
          <p className="text-muted-foreground">
            Plan and schedule your content across platforms. Pro feature for serious creators.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>January 2024</CardTitle>
                <CardDescription>Click on a date to schedule content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <button
                      key={day}
                      className={`p-3 rounded-lg hover:bg-primary/10 transition-colors ${
                        [15, 18].includes(day) ? 'bg-primary/20 text-primary font-medium' : ''
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheduledContent.map((content) => (
                  <div
                    key={content.id}
                    className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{content.platform}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(content.status)}`}>
                        {content.status}
                      </span>
                    </div>
                    <p className="font-medium text-sm">{content.title}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{content.scheduledDate} at {content.scheduledTime}</span>
                      <div className="flex gap-2">
                        <button className="hover:text-primary transition-colors">
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button className="hover:text-destructive transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Scheduled', value: '12', icon: Clock },
              { label: 'Published', value: '45', icon: CheckCircle2 },
              { label: 'Drafts', value: '8', icon: Edit3 },
              { label: 'This Week', value: '5', icon: Calendar },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </FeatureGate>
  );
};

export default ContentCalendar;
