import { projectId, publicAnonKey } from './supabase/info';

// Server configuration with automatic URL detection
class ServerConfig {
  private baseUrl: string | null = null;
  private isDetecting: boolean = false;
  private detectionPromise: Promise<string | null> | null = null;

  // Possible URL patterns to test
  private readonly urlPatterns = [
    // Try without prefix first (Supabase adds function name automatically)
    ``,
    
    // Current deployed URL with prefix
    `/make-server-5fa32778`,
    
    // Legacy URL
    `/make-server-af7c4673`,
    
    // If function is named differently
    `/agent-server`,
    `/server`,
    `/agent`,
  ];

  async detectServerUrl(): Promise<string | null> {
    // If already detected, return cached result
    if (this.baseUrl) {
      return this.baseUrl;
    }

    // If detection is in progress, wait for it
    if (this.detectionPromise) {
      return this.detectionPromise;
    }

    // Start new detection
    this.isDetecting = true;
    this.detectionPromise = this._performDetection();
    
    const result = await this.detectionPromise;
    this.isDetecting = false;
    
    return result;
  }

  private async _performDetection(): Promise<string | null> {
    console.log('🔍 Detecting Edge Function URL...');

    for (const pattern of this.urlPatterns) {
      const testUrl = `https://${projectId}.supabase.co/functions/v1${pattern}/health`;
      
      try {
        console.log(`Testing: ${testUrl}`);
        
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'ok') {
            console.log(`✅ Found working URL: ${testUrl}`);
            this.baseUrl = `https://${projectId}.supabase.co/functions/v1${pattern}`;
            return this.baseUrl;
          }
        }
      } catch (error) {
        console.log(`❌ Failed: ${testUrl}`);
      }
    }

    console.log('❌ No working URL found');
    return null;
  }

  getBaseUrl(): string | null {
    return this.baseUrl;
  }

  isConnected(): boolean {
    return this.baseUrl !== null;
  }

  // Make an API call with automatic URL detection
  async fetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
    // Ensure we have a base URL
    if (!this.baseUrl) {
      await this.detectServerUrl();
    }

    // If still no URL, throw error
    if (!this.baseUrl) {
      throw new Error('Edge Function not available. Please deploy it in Supabase Dashboard.');
    }

    // Add authorization header if not present
    const headers = {
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    };

    // Make the request
    return fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
  }
}

// Export singleton instance
export const serverConfig = new ServerConfig();

// Convenience function for making server calls
export async function fetchServer(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return serverConfig.fetch(endpoint, options);
}

// Check if server is available
export async function isServerAvailable(): Promise<boolean> {
  const url = await serverConfig.detectServerUrl();
  return url !== null;
}

// Get the detected base URL (for display purposes)
export function getServerUrl(): string | null {
  return serverConfig.getBaseUrl();
}
