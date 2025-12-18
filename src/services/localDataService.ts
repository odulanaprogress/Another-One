/**
 * Local Data Service
 * 
 * This service manages all data storage using localStorage.
 * It can be easily replaced with a backend API (like an email service)
 * by updating the methods in this file.
 * 
 * To integrate with an email service backend:
 * 1. Replace localStorage calls with fetch() calls to your API
 * 2. Update the submitToWaitlist method to call your email API
 * 3. Keep the same interface so no component changes are needed
 */

export interface WaitlistUser {
  email: string;
  propertyType: string;
  timestamp: string;
  queuePosition: number;
  id: string;
}

export interface DatabaseStats {
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

const STORAGE_KEY = 'agent_waitlist_users';
const ADMIN_EMAIL = 'odulanaprogress@gmail.com';

class LocalDataService {
  // Get all users from localStorage
  private getUsers(): WaitlistUser[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  // Save users to localStorage
  private saveUsers(users: WaitlistUser[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Generate a simple unique ID
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Check if user is admin
  isAdmin(email: string): boolean {
    return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  }

  // Submit to waitlist
  async submitToWaitlist(email: string, propertyType: string): Promise<{
    success: boolean;
    queuePosition?: number;
    alreadyExists?: boolean;
    error?: string;
  }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = this.getUsers();
    
    // Check if email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return {
        success: false,
        alreadyExists: true,
        error: "You're already on the waitlist!"
      };
    }

    // Create new user
    const newUser: WaitlistUser = {
      id: this.generateId(),
      email,
      propertyType,
      timestamp: new Date().toISOString(),
      queuePosition: users.length + 1
    };

    users.push(newUser);
    this.saveUsers(users);

    // TODO: When integrating email service, call your email API here
    // Example:
    // await fetch('https://your-email-api.com/send-welcome', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, propertyType })
    // });

    console.log('📧 Welcome email would be sent to:', email);
    console.log('💡 To integrate email: Update submitToWaitlist() in localDataService.ts');

    return {
      success: true,
      queuePosition: newUser.queuePosition
    };
  }

  // Get waitlist count
  async getWaitlistCount(): Promise<{
    total: number;
    spotsLeft: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const users = this.getUsers();
    const total = users.length;
    const spotsLeft = Math.max(0, 500 - total); // Assuming 500 total spots

    return { total, spotsLeft };
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<WaitlistUser[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.getUsers();
  }

  // Get database stats
  async getDatabaseStats(): Promise<DatabaseStats> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const users = this.getUsers();
    const now = new Date();
    
    // Calculate time-based statistics
    const last24h = users.filter(u => {
      const userDate = new Date(u.timestamp);
      return (now.getTime() - userDate.getTime()) < 24 * 60 * 60 * 1000;
    }).length;

    const last7days = users.filter(u => {
      const userDate = new Date(u.timestamp);
      return (now.getTime() - userDate.getTime()) < 7 * 24 * 60 * 60 * 1000;
    }).length;

    const last30days = users.filter(u => {
      const userDate = new Date(u.timestamp);
      return (now.getTime() - userDate.getTime()) < 30 * 24 * 60 * 60 * 1000;
    }).length;

    // Calculate property type distribution
    const propertyTypes: Record<string, number> = {};
    users.forEach(u => {
      propertyTypes[u.propertyType] = (propertyTypes[u.propertyType] || 0) + 1;
    });

    // Calculate timeline
    const timestamps = users.map(u => new Date(u.timestamp).getTime());
    const firstSignup = timestamps.length > 0 ? new Date(Math.min(...timestamps)).toISOString() : null;
    const lastSignup = timestamps.length > 0 ? new Date(Math.max(...timestamps)).toISOString() : null;
    const totalDays = firstSignup 
      ? Math.ceil((now.getTime() - new Date(firstSignup).getTime()) / (24 * 60 * 60 * 1000))
      : 0;

    const dailyAverage = totalDays > 0 ? Math.round(users.length / totalDays * 10) / 10 : 0;

    const totalCapacity = 500;

    return {
      database: {
        totalUsers: users.length,
        storedCount: users.length,
        isInSync: true,
        lastUpdated: now.toISOString()
      },
      growth: {
        last24h,
        last7days,
        last30days,
        dailyAverage
      },
      timeline: {
        firstSignup,
        lastSignup,
        totalDays
      },
      capacity: {
        total: totalCapacity,
        used: users.length,
        remaining: totalCapacity - users.length,
        percentageFull: Math.round((users.length / totalCapacity) * 100)
      },
      propertyTypes,
      metadata: {
        serverTime: now.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };
  }

  // Update user (admin only)
  async updateUser(oldEmail: string, newEmail: string, propertyType: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === oldEmail.toLowerCase());
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Check if new email already exists (if email is being changed)
    if (oldEmail.toLowerCase() !== newEmail.toLowerCase()) {
      const emailExists = users.some(u => u.email.toLowerCase() === newEmail.toLowerCase());
      if (emailExists) {
        return {
          success: false,
          error: 'Email already exists'
        };
      }
    }

    users[userIndex].email = newEmail;
    users[userIndex].propertyType = propertyType;
    this.saveUsers(users);

    return { success: true };
  }

  // Delete user (admin only)
  async deleteUser(email: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const users = this.getUsers();
    const filteredUsers = users.filter(u => u.email.toLowerCase() !== email.toLowerCase());
    
    if (filteredUsers.length === users.length) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Recalculate queue positions
    filteredUsers.forEach((user, index) => {
      user.queuePosition = index + 1;
    });

    this.saveUsers(filteredUsers);
    return { success: true };
  }

  // Send message (placeholder - integrate with email service)
  async sendMessage(email: string, subject: string, body: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // TODO: Integrate with your email service API
    // Example:
    // const response = await fetch('https://your-email-api.com/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ to: email, subject, body })
    // });
    
    console.log('📧 Email would be sent:');
    console.log('To:', email);
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('💡 To integrate email: Update sendMessage() in localDataService.ts');

    return { success: true };
  }

  // Send bulk message (placeholder - integrate with email service)
  async sendBulkMessage(subject: string, body: string): Promise<{
    success: boolean;
    sent?: number;
    error?: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = this.getUsers();
    
    // TODO: Integrate with your email service API for bulk sending
    // Example:
    // const response = await fetch('https://your-email-api.com/send-bulk', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     recipients: users.map(u => u.email),
    //     subject,
    //     body
    //   })
    // });
    
    console.log('📧 Bulk email would be sent to', users.length, 'users');
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('💡 To integrate email: Update sendBulkMessage() in localDataService.ts');

    return {
      success: true,
      sent: users.length
    };
  }

  // Export users data
  exportUsers(): void {
    const users = this.getUsers();
    const dataStr = JSON.stringify(users, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-waitlist-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export as CSV
  exportUsersCSV(): void {
    const users = this.getUsers();
    
    // Create CSV header
    const headers = ['Queue Position', 'Email', 'Property Type', 'Signup Date'];
    const csvContent = [
      headers.join(','),
      ...users.map(u => [
        u.queuePosition,
        u.email,
        `"${u.propertyType}"`,
        new Date(u.timestamp).toLocaleString()
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Clear all data (admin only - use with caution!)
  async clearAllData(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Export singleton instance
export const dataService = new LocalDataService();
