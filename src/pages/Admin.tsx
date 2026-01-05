import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  Image, 
  MessageSquare, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  BarChart3,
  Coins,
  Save
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalUsers: number;
  totalThumbnails: number;
  totalBlogPosts: number;
  totalChatMessages: number;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  views: number;
  created_at: string;
  category: string;
}

interface TokenCostSetting {
  id: string;
  feature_id: string;
  feature_name: string;
  token_cost: number;
  description: string | null;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalThumbnails: 0,
    totalBlogPosts: 0,
    totalChatMessages: 0
  });
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [tokenCosts, setTokenCosts] = useState<TokenCostSetting[]>([]);
  const [editingCosts, setEditingCosts] = useState<Record<string, number>>({});
  const [savingCosts, setSavingCosts] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  const checkAdminRole = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });

      if (error) throw error;
      setIsAdmin(data);

      if (data) {
        await Promise.all([fetchStats(), fetchBlogPosts(), fetchTokenCosts()]);
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [profilesRes, thumbnailsRes, blogRes, chatRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('thumbnails').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('chat_messages').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: profilesRes.count || 0,
        totalThumbnails: thumbnailsRes.count || 0,
        totalBlogPosts: blogRes.count || 0,
        totalChatMessages: chatRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, published, views, created_at, category')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const fetchTokenCosts = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_token_costs')
        .select('*')
        .order('feature_name');

      if (error) throw error;
      setTokenCosts(data || []);
      // Initialize editing state
      const initialCosts: Record<string, number> = {};
      (data || []).forEach(tc => {
        initialCosts[tc.id] = tc.token_cost;
      });
      setEditingCosts(initialCosts);
    } catch (error) {
      console.error('Error fetching token costs:', error);
    }
  };

  const saveTokenCosts = async () => {
    setSavingCosts(true);
    try {
      const updates = Object.entries(editingCosts).map(([id, cost]) => 
        supabase
          .from('feature_token_costs')
          .update({ token_cost: cost })
          .eq('id', id)
      );
      
      await Promise.all(updates);
      toast.success('Token costs updated successfully');
      fetchTokenCosts();
    } catch (error) {
      console.error('Error saving token costs:', error);
      toast.error('Failed to update token costs');
    } finally {
      setSavingCosts(false);
    }
  };

  const togglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', postId);

      if (error) throw error;
      
      toast.success(currentStatus ? 'Post unpublished' : 'Post published');
      fetchBlogPosts();
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast.error('Failed to update post');
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      toast.success('Post deleted');
      fetchBlogPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Thumbnails Created', value: stats.totalThumbnails, icon: Image, color: 'from-purple-500 to-purple-600' },
    { label: 'Blog Posts', value: stats.totalBlogPosts, icon: FileText, color: 'from-green-500 to-green-600' },
    { label: 'Chat Messages', value: stats.totalChatMessages, icon: MessageSquare, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Manage your platform</p>
            </div>
          </div>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="blog" className="space-y-6">
          <TabsList>
            <TabsTrigger value="blog" className="gap-2">
              <FileText className="w-4 h-4" />
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="tokens" className="gap-2">
              <Coins className="w-4 h-4" />
              Token Costs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Blog Posts</CardTitle>
                  <CardDescription>Manage your blog content</CardDescription>
                </div>
                <Link to="/admin/blog/new">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Post
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {blogPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No blog posts yet</p>
                    <Link to="/admin/blog/new">
                      <Button variant="outline" className="mt-4">Create your first post</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{post.title}</h3>
                            <Badge variant={post.published ? 'default' : 'secondary'}>
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                            <Badge variant="outline">{post.category}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.views} views
                            </span>
                            <span>
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePublish(post.id, post.published)}
                          >
                            {post.published ? 'Unpublish' : 'Publish'}
                          </Button>
                          <Link to={`/admin/blog/edit/${post.id}`}>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deletePost(post.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tokens">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Token Cost Configuration</CardTitle>
                  <CardDescription>Set the token cost for each AI feature</CardDescription>
                </div>
                <Button onClick={saveTokenCosts} disabled={savingCosts}>
                  <Save className="w-4 h-4 mr-2" />
                  {savingCosts ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokenCosts.map((cost) => (
                    <div
                      key={cost.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{cost.feature_name}</h3>
                        <p className="text-sm text-muted-foreground">{cost.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Coins className="w-4 h-4 text-primary" />
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={editingCosts[cost.id] || cost.token_cost}
                            onChange={(e) => setEditingCosts(prev => ({
                              ...prev,
                              [cost.id]: parseInt(e.target.value) || 1
                            }))}
                            className="w-20 text-center"
                          />
                          <span className="text-sm text-muted-foreground">tokens</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>Overview of platform usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Growth Overview</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">New users this week</span>
                        <span className="font-medium">Coming soon</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Thumbnails this week</span>
                        <span className="font-medium">Coming soon</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Feature Usage</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Most used feature</span>
                        <span className="font-medium">Thumbnail Generator</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">AI Chat sessions</span>
                        <span className="font-medium">{stats.totalChatMessages}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
