import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Loader2, Users, RefreshCw, LogOut, Mail, Edit, Trash2, Send, Eye, Lock, 
  Download, Search, Filter, MailOpen, TrendingUp, Calendar, Clock, 
  MapPin, CheckCircle, XCircle, AlertCircle, MoreVertical, Activity
} from 'lucide-react';
import { dataService, type WaitlistUser, type DatabaseStats } from '../services/localDataService';
import { toast } from 'sonner@2.0.3';

interface LocalWaitlistUser {
  email: string;
  propertyType: string;
  timestamp: string;
  queuePosition: number;
}

interface LocalDatabaseStats {
  database: {
    totalUsers: number;
    storedCount: number;
    isInSync: boolean;
    lastUpdated: string;
  };
  growth: {
    last24h: number;
    last7days: number;
    last30days: number;
    dailyAverage: number;
  };
  timeline: {
    firstSignup: string | null;
    lastSignup: string | null;
    totalDays: number;
  };
  capacity: {
    total: number;
    used: number;
    remaining: number;
    percentageFull: number;
  };
  propertyTypes: Record<string, number>;
  metadata: {
    serverTime: string;
    timezone: string;
  };
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [users, setUsers] = useState<WaitlistUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards'); // Default to cards for mobile
  
  // Database statistics
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // New: Filter by date

  // Message dialog state
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<WaitlistUser | null>(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Bulk email dialog state
  const [bulkEmailDialogOpen, setBulkEmailDialogOpen] = useState(false);
  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkBody, setBulkBody] = useState('');
  const [isSendingBulk, setIsSendingBulk] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<WaitlistUser | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPropertyType, setEditPropertyType] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // View details dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [detailsUser, setDetailsUser] = useState<WaitlistUser | null>(null);

  // Check if already logged in
  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminSession');
    if (adminSession === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch users and stats when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchDatabaseStats();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const ADMIN_EMAIL = 'odulanaprogress@gmail.com';

    if (loginEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      sessionStorage.setItem('adminSession', 'authenticated');
      setIsAuthenticated(true);
      toast.success('Welcome back!', {
        description: 'Successfully logged in to admin dashboard',
      });
    } else {
      setLoginError('Invalid email address');
      toast.error('Login Failed', {
        description: 'Only authorized admin emails can access this dashboard.',
      });
    }

    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminSession');
    setIsAuthenticated(false);
    setUsers([]);
    setTotal(0);
    toast.success('Logged out successfully');
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log('[ADMIN] Fetching users from localStorage...');
      const data = await dataService.getAllUsers();
      console.log('[ADMIN] Retrieved users:', data.length);
      
      setUsers(data);
      setTotal(data.length);
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('[ADMIN] Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDatabaseStats = async () => {
    setIsLoadingStats(true);
    try {
      console.log('[ADMIN] Fetching database stats from localStorage...');
      const data = await dataService.getDatabaseStats();
      console.log('[ADMIN] Stats data:', data);
      
      if (data.success && data.stats) {
        setDbStats(data.stats);
      }
    } catch (error) {
      console.error('[ADMIN] Error fetching database stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleRefreshAll = async () => {
    await Promise.all([fetchUsers(), fetchDatabaseStats()]);
    toast.success('Data refreshed from database');
  };

  // Use database statistics if available, otherwise calculate from loaded users
  const stats = dbStats ? {
    totalUsers: dbStats.database.totalUsers,
    spotsLeft: dbStats.capacity.remaining,
    last24h: dbStats.growth.last24h,
    last7days: dbStats.growth.last7days,
    last30days: dbStats.growth.last30days,
    dailyAverage: dbStats.growth.dailyAverage,
    percentageFull: dbStats.capacity.percentageFull,
    isInSync: dbStats.database.isInSync,
  } : {
    totalUsers: users.length,
    spotsLeft: Math.max(0, 200 - users.length),
    last24h: users.filter(u => {
      const userDate = new Date(u.timestamp);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return userDate > oneDayAgo;
    }).length,
    last7days: users.filter(u => {
      const userDate = new Date(u.timestamp);
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return userDate > sevenDaysAgo;
    }).length,
    last30days: 0,
    dailyAverage: 0,
    percentageFull: 0,
    isInSync: true,
  };

  // Property types for filtering
  const propertyTypes = Array.from(new Set(users.map(u => u.propertyType).filter(Boolean)));

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.queuePosition.toString().includes(searchQuery);
    
    const matchesPropertyType = 
      propertyTypeFilter === 'all' || user.propertyType === propertyTypeFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const userDate = new Date(user.timestamp);
      const now = new Date();
      
      if (dateFilter === 'today') {
        matchesDate = userDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = userDate > weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = userDate > monthAgo;
      }
    }
    
    return matchesSearch && matchesPropertyType && matchesDate;
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return formatDate(timestamp);
  };

  const openMessageDialog = (user: WaitlistUser) => {
    setSelectedUser(user);
    setMessageSubject('');
    setMessageBody('');
    setMessageDialogOpen(true);
  };

  const openDetailsDialog = (user: WaitlistUser) => {
    setDetailsUser(user);
    setDetailsDialogOpen(true);
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !messageSubject || !messageBody) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSendingMessage(true);

    try {
      const response = await dataService.sendMessage(
        selectedUser.email,
        messageSubject,
        messageBody
      );

      if (!response.success) throw new Error('Failed to send message');

      toast.success('Message sent!', {
        description: `Email sent to ${selectedUser.email}`,
      });
      setMessageDialogOpen(false);
      setMessageSubject('');
      setMessageBody('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleSendBulkEmail = async () => {
    if (!bulkSubject || !bulkBody) {
      toast.error('Please fill in subject and message');
      return;
    }

    setIsSendingBulk(true);

    try {
      const response = await dataService.sendBulkMessage(bulkSubject, bulkBody);

      if (!response.success) {
        throw new Error('Failed to send bulk email');
      }

      toast.success('Bulk email complete!', {
        description: `Sent to ${response.sent} users`,
      });
      setBulkEmailDialogOpen(false);
      setBulkSubject('');
      setBulkBody('');
    } catch (error) {
      toast.error('Bulk email failed');
    } finally {
      setIsSendingBulk(false);
    }
  };

  const openEditDialog = (user: WaitlistUser) => {
    setEditUser(user);
    setEditEmail(user.email);
    setEditPropertyType(user.propertyType);
    setEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!editUser || !editEmail) {
      toast.error('Email is required');
      return;
    }

    setIsUpdating(true);

    try {
      const response = await dataService.updateUser(
        editUser.email,
        editEmail,
        editPropertyType
      );

      if (!response.success) {
        throw new Error(response.error || 'Failed to update user');
      }

      toast.success('User updated successfully');
      setEditDialogOpen(false);
      await Promise.all([fetchUsers(), fetchDatabaseStats()]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update user');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async (user: WaitlistUser) => {
    if (!confirm(`Are you sure you want to delete ${user.email}?`)) return;

    try {
      const response = await fetchServer('/admin/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      if (!response.ok) throw new Error('Failed to delete user');

      toast.success('User deleted successfully');
      await Promise.all([fetchUsers(), fetchDatabaseStats()]);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Position', 'Email', 'Property Type', 'Signup Date', 'Time Ago'];
    const rows = filteredUsers.map(user => [
      user.queuePosition,
      user.email,
      user.propertyType,
      formatDateTime(user.timestamp),
      getTimeAgo(user.timestamp),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('CSV exported successfully');
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F1A2F] via-[#1a237e] to-[#0F1A2F] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="space-y-2 text-center p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-[#00F5FF]/20 p-4 rounded-full">
                <Lock className="w-12 h-12 text-[#00F5FF]" />
              </div>
            </div>
            <CardTitle className="text-3xl text-white">Admin Dashboard</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to access the AGENT admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your admin email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-400">
                  Only authorized admin emails can access this dashboard
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-[#0F1A2F]"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Access Dashboard
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1A2F] via-[#1a237e] to-[#0F1A2F]">
      <div className="container mx-auto max-w-7xl p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl md:text-3xl text-white">
                      Admin Dashboard
                    </CardTitle>
                    {dbStats && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/20 rounded-full">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-emerald-400 text-xs font-medium hidden sm:inline">Live</span>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-sm md:text-base text-gray-300">
                    <span className="font-semibold text-[#00F5FF]">{stats.totalUsers} total users</span> from database
                    {lastSyncTime && (
                      <span className="text-gray-400 ml-2">• Synced at {lastSyncTime}</span>
                    )}
                  </CardDescription>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="border border-white/20 text-white hover:bg-white/10 shrink-0"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleRefreshAll}
                  disabled={isLoading || isLoadingStats}
                  size="sm"
                  className="bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-[#0F1A2F]"
                >
                  {(isLoading || isLoadingStats) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 sm:mr-2" />
                  )}
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                  disabled={users.length === 0}
                >
                  <Download className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                
                <Button
                  onClick={() => setBulkEmailDialogOpen(true)}
                  variant="outline"
                  size="sm"
                  className="border-[#00F5FF]/50 text-[#00F5FF] hover:bg-[#00F5FF]/10"
                  disabled={filteredUsers.length === 0}
                >
                  <MailOpen className="w-4 h-4 sm:mr-2" />
                  <span className="hidden xs:inline">Bulk ({filteredUsers.length})</span>
                  <span className="xs:hidden">{filteredUsers.length}</span>
                </Button>

                <div className="hidden md:flex items-center gap-2 ml-auto">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className={viewMode === 'cards' ? 'bg-[#00F5FF] text-[#0F1A2F]' : 'border-white/20 text-white'}
                  >
                    Cards
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className={viewMode === 'table' ? 'bg-[#00F5FF] text-[#0F1A2F]' : 'border-white/20 text-white'}
                  >
                    Table
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#00F5FF]/20 p-2.5 rounded-lg shrink-0">
                  <Users className="w-5 h-5 text-[#00F5FF]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-400 text-xs">Database Users</p>
                  <p className="text-white text-xl md:text-2xl font-bold">{stats.totalUsers}</p>
                  {dbStats && (
                    <p className="text-[#00F5FF] text-xs mt-0.5">
                      {stats.percentageFull.toFixed(1)}% full
                    </p>
                  )}
                </div>
              </div>
              {dbStats && stats.isInSync && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/20 p-2.5 rounded-lg shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-400 text-xs">Spots Remaining</p>
                  <p className="text-white text-xl md:text-2xl font-bold">{stats.spotsLeft}</p>
                  {dbStats && stats.dailyAverage > 0 && (
                    <p className="text-gray-400 text-xs mt-0.5">
                      ~{Math.ceil(stats.spotsLeft / stats.dailyAverage)}d to fill
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2.5 rounded-lg shrink-0">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-400 text-xs">Last 24 Hours</p>
                  <p className="text-white text-xl md:text-2xl font-bold">{stats.last24h}</p>
                  {dbStats && stats.dailyAverage > 0 && (
                    <p className="text-gray-400 text-xs mt-0.5">
                      Avg: {stats.dailyAverage}/day
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2.5 rounded-lg shrink-0">
                  <Activity className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-400 text-xs">Last 7 Days</p>
                  <p className="text-white text-xl md:text-2xl font-bold">{stats.last7days}</p>
                  {dbStats && stats.last30days > 0 && (
                    <p className="text-gray-400 text-xs mt-0.5">
                      30d: {stats.last30days}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Database Overview */}
        {(dbStats || isLoadingStats) && (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#00F5FF]" />
                  Database Overview
                  {isLoadingStats && (
                    <Loader2 className="w-4 h-4 animate-spin text-[#00F5FF]" />
                  )}
                </CardTitle>
                {dbStats && (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    {dbStats.database.isInSync ? 'Synced' : 'Out of Sync'}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {isLoadingStats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[#00F5FF]" />
                </div>
              ) : dbStats ? (
              <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Total in DB</p>
                  <p className="text-white font-bold text-lg">{dbStats.database.totalUsers}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Daily Average</p>
                  <p className="text-white font-bold text-lg">{dbStats.growth.dailyAverage}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Total Days</p>
                  <p className="text-white font-bold text-lg">{dbStats.timeline.totalDays}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Capacity Used</p>
                  <p className="text-white font-bold text-lg">{dbStats.capacity.percentageFull.toFixed(1)}%</p>
                </div>
              </div>
              
              {Object.keys(dbStats.propertyTypes).length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-gray-400 text-xs mb-2">Property Type Breakdown</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(dbStats.propertyTypes).map(([type, count]) => (
                      <Badge 
                        key={type} 
                        className="bg-[#00F5FF]/10 text-[#00F5FF] border-[#00F5FF]/30"
                      >
                        {type}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {dbStats.timeline.firstSignup && (
                    <div>
                      First signup: {new Date(dbStats.timeline.firstSignup).toLocaleDateString()}
                    </div>
                  )}
                  {dbStats.timeline.lastSignup && (
                    <div>
                      Latest signup: {new Date(dbStats.timeline.lastSignup).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              </>
              ) : null}
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by email or position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F1A2F] border-white/20">
                    <SelectItem value="all" className="text-white">All Types</SelectItem>
                    {propertyTypes.map(type => (
                      <SelectItem key={type} value={type} className="text-white">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <Clock className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F1A2F] border-white/20">
                    <SelectItem value="all" className="text-white">All Time</SelectItem>
                    <SelectItem value="today" className="text-white">Today</SelectItem>
                    <SelectItem value="week" className="text-white">Last 7 Days</SelectItem>
                    <SelectItem value="month" className="text-white">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(searchQuery || propertyTypeFilter !== 'all' || dateFilter !== 'all') && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Showing {filteredUsers.length} of {users.length} users
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setPropertyTypeFilter('all');
                      setDateFilter('all');
                    }}
                    className="text-[#00F5FF] hover:text-[#00F5FF]/80 h-auto p-0"
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Users Display */}
        {isLoading ? (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-[#00F5FF]" />
                <p className="text-white">Loading users...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-12">
              <div className="text-center text-gray-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">
                  {searchQuery || propertyTypeFilter !== 'all' || dateFilter !== 'all'
                    ? 'No users match your filters'
                    : 'No users found'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : viewMode === 'cards' ? (
          // Card View (Mobile-First)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.queuePosition} className="bg-white/10 backdrop-blur-xl border-white/20 hover:border-[#00F5FF]/50 transition-all">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#00F5FF]/20 px-2.5 py-1 rounded-lg">
                          <span className="text-[#00F5FF] font-bold text-sm">
                            #{user.queuePosition}
                          </span>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                          Active
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetailsDialog(user)}
                        className="text-gray-400 hover:text-white h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Email */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Email Address</p>
                      <p className="text-white text-sm font-mono break-all">{user.email}</p>
                    </div>

                    {/* Property Type */}
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Property Interest</p>
                      <Badge className="bg-[#00F5FF]/20 text-[#00F5FF] border-[#00F5FF]/30">
                        {user.propertyType}
                      </Badge>
                    </div>

                    {/* Date */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-gray-400 mb-1">Joined</p>
                        <p className="text-white">{formatDate(user.timestamp)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Time Ago</p>
                        <p className="text-white">{getTimeAgo(user.timestamp)}</p>
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => openMessageDialog(user)}
                        className="flex-1 bg-[#00F5FF]/10 hover:bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30"
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(user)}
                        className="text-yellow-400 hover:bg-yellow-400/10 border border-yellow-400/30"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user)}
                        className="text-red-400 hover:bg-red-400/10 border border-red-400/30"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Table View (Desktop)
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-[80px_1fr_150px_150px_150px_120px] gap-4 p-4 bg-white/5 border-b border-white/10 sticky top-0 backdrop-blur-xl">
                    <div className="text-[#00F5FF] text-sm font-semibold">Position</div>
                    <div className="text-[#00F5FF] text-sm font-semibold">Email</div>
                    <div className="text-[#00F5FF] text-sm font-semibold">Property Type</div>
                    <div className="text-[#00F5FF] text-sm font-semibold">Joined Date</div>
                    <div className="text-[#00F5FF] text-sm font-semibold">Time Ago</div>
                    <div className="text-[#00F5FF] text-sm font-semibold text-right">Actions</div>
                  </div>
                  
                  {filteredUsers.map((user) => (
                    <div
                      key={user.queuePosition}
                      className="grid grid-cols-[80px_1fr_150px_150px_150px_120px] gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <div className="text-white font-semibold">#{user.queuePosition}</div>
                      <div className="text-white font-mono text-sm truncate">{user.email}</div>
                      <div>
                        <Badge className="bg-[#00F5FF]/20 text-[#00F5FF] border-[#00F5FF]/30 text-xs">
                          {user.propertyType}
                        </Badge>
                      </div>
                      <div className="text-gray-300 text-sm">{formatDate(user.timestamp)}</div>
                      <div className="text-gray-400 text-sm">{getTimeAgo(user.timestamp)}</div>
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDetailsDialog(user)}
                          className="text-white hover:bg-white/10 h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openMessageDialog(user)}
                          className="text-[#00F5FF] hover:bg-[#00F5FF]/10 h-8 w-8 p-0"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(user)}
                          className="text-yellow-400 hover:bg-yellow-400/10 h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-400 hover:bg-red-400/10 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* User Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="bg-[#0F1A2F] border-white/20 text-white max-w-lg mx-4">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#00F5FF]">User Details</DialogTitle>
              <DialogDescription className="text-gray-300">
                Complete information for this user
              </DialogDescription>
            </DialogHeader>

            {detailsUser && (
              <div className="space-y-4 py-4">
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#00F5FF]/20 px-3 py-1.5 rounded-lg">
                      <span className="text-[#00F5FF] font-bold text-lg">
                        #{detailsUser.queuePosition}
                      </span>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      Active Member
                    </Badge>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Email Address</p>
                      <p className="text-white font-mono break-all">{detailsUser.email}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Property Interest</p>
                      <Badge className="bg-[#00F5FF]/20 text-[#00F5FF] border-[#00F5FF]/30">
                        {detailsUser.propertyType}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Signup Date & Time</p>
                      <p className="text-white">{formatDateTime(detailsUser.timestamp)}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Time Since Signup</p>
                      <p className="text-white">{getTimeAgo(detailsUser.timestamp)}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">Queue Position</p>
                      <p className="text-white">
                        Position #{detailsUser.queuePosition} of {total} total members
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      openMessageDialog(detailsUser);
                    }}
                    className="bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-[#0F1A2F]"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      openEditDialog(detailsUser);
                    }}
                    className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      handleDeleteUser(detailsUser);
                    }}
                    className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Message Dialog */}
        <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
          <DialogContent className="bg-[#0F1A2F] border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl text-[#00F5FF]">Send Message</DialogTitle>
              <DialogDescription className="text-sm text-gray-300 break-all">
                Send email to {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white">Subject</Label>
                <Input
                  id="subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Email subject"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">Message</Label>
                <Textarea
                  id="message"
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="Your message"
                  rows={8}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 resize-none"
                />
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setMessageDialogOpen(false)}
                className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={isSendingMessage}
                className="bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-[#0F1A2F] w-full sm:w-auto"
              >
                {isSendingMessage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Email Dialog */}
        <Dialog open={bulkEmailDialogOpen} onOpenChange={setBulkEmailDialogOpen}>
          <DialogContent className="bg-[#0F1A2F] border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl text-[#00F5FF]">Send Bulk Email</DialogTitle>
              <DialogDescription className="text-sm text-gray-300">
                Send email to {filteredUsers.length} filtered users
              </DialogDescription>
            </DialogHeader>
            
            <Alert className="bg-yellow-500/10 border-yellow-500/20">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <AlertDescription className="text-yellow-400 text-xs md:text-sm">
                This will send an email to {filteredUsers.length} users. Make sure your message is correct.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-subject" className="text-white">Subject</Label>
                <Input
                  id="bulk-subject"
                  value={bulkSubject}
                  onChange={(e) => setBulkSubject(e.target.value)}
                  placeholder="Email subject"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bulk-message" className="text-white">Message</Label>
                <Textarea
                  id="bulk-message"
                  value={bulkBody}
                  onChange={(e) => setBulkBody(e.target.value)}
                  placeholder="Your message to all users..."
                  rows={10}
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 resize-none"
                />
                <p className="text-xs text-gray-400">
                  Recipients: {filteredUsers.length} users
                </p>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setBulkEmailDialogOpen(false)}
                className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
                disabled={isSendingBulk}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendBulkEmail}
                disabled={isSendingBulk}
                className="bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-[#0F1A2F] w-full sm:w-auto"
              >
                {isSendingBulk ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send to {filteredUsers.length} Users
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-[#0F1A2F] border-white/20 text-white max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl text-[#00F5FF]">Edit User</DialogTitle>
              <DialogDescription className="text-sm text-gray-300 break-all">
                Update user information for {editUser?.email}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-white">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-property-type" className="text-white">Property Type</Label>
                <Input
                  id="edit-property-type"
                  value={editPropertyType}
                  onChange={(e) => setEditPropertyType(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateUser}
                disabled={isUpdating}
                className="bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-[#0F1A2F] w-full sm:w-auto"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update User'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
