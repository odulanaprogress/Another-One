import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, Send, CheckCircle, XCircle, AlertTriangle, Server } from 'lucide-react';
import { fetchServer } from '../utils/serverConfig';

export default function EmailDiagnostic() {
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Check system status on mount
  useEffect(() => {
    const checkStatus = async () => {
      setIsLoadingStatus(true);
      try {
        console.log('[DIAGNOSTIC] Checking system status...');
        const response = await fetchServer('/diagnostic');
        const data = await response.json();
        
        console.log('[DIAGNOSTIC] Status:', data);
        setSystemStatus(data);
      } catch (error) {
        console.error('[DIAGNOSTIC] Failed to check status:', error);
        setSystemStatus({ error: error.message });
      } finally {
        setIsLoadingStatus(false);
      }
    };

    checkStatus();
  }, []);

  const testWelcomeEmail = async () => {
    if (!testEmail) {
      setResult({ success: false, message: 'Please enter an email address' });
      return;
    }

    setIsTesting(true);
    setResult(null);

    try {
      console.log('[EMAIL-TEST] Sending test welcome email to:', testEmail);
      
      const response = await fetchServer('/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          type: 'welcome'
        }),
      });

      const data = await response.json();
      
      console.log('[EMAIL-TEST] Response:', data);
      
      setResult({
        success: response.ok,
        message: data.message || data.error,
        details: data.details
      });
    } catch (error) {
      console.error('[EMAIL-TEST] Error:', error);
      setResult({
        success: false,
        message: 'Failed to send test email',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const testAdminEmail = async () => {
    setIsTesting(true);
    setResult(null);

    try {
      console.log('[EMAIL-TEST] Sending test admin notification');
      
      const response = await fetchServer('/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          type: 'admin'
        }),
      });

      const data = await response.json();
      
      console.log('[EMAIL-TEST] Response:', data);
      
      setResult({
        success: response.ok,
        message: data.message || data.error,
        details: data.details
      });
    } catch (error) {
      console.error('[EMAIL-TEST] Error:', error);
      setResult({
        success: false,
        message: 'Failed to send test email',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1A2F] via-[#1a237e] to-[#0F1A2F] p-6">
      <div className="container mx-auto max-w-2xl">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center">📧 Email System Diagnostic</CardTitle>
            <p className="text-gray-300 text-center text-sm mt-2">
              Test email delivery and diagnose issues
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* System Status */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Server className="w-5 h-5" />
                System Status
              </h3>
              
              {isLoadingStatus ? (
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-[#00F5FF] animate-spin" />
                    <span className="text-gray-300">Checking system status...</span>
                  </div>
                </div>
              ) : systemStatus?.error ? (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-300 font-semibold mb-2">❌ Server Not Connected</p>
                      <p className="text-sm text-red-200 mb-3">Your Edge Function is not deployed or not responding.</p>
                      <a
                        href="https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Deploy Edge Function Now →
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`border p-4 rounded-lg ${
                  systemStatus?.status?.emailServiceConfigured
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {systemStatus?.status?.emailServiceConfigured ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      )}
                      <span className={systemStatus?.status?.emailServiceConfigured ? 'text-emerald-300 font-semibold' : 'text-yellow-300 font-semibold'}>
                        {systemStatus?.status?.emailServiceConfigured 
                          ? '✅ Email Service: ACTIVE' 
                          : '⚠️ Email Service: NOT CONFIGURED'}
                      </span>
                    </div>
                    
                    {!systemStatus?.status?.emailServiceConfigured && (
                      <div className="bg-yellow-500/20 p-3 rounded">
                        <p className="text-yellow-200 text-sm mb-2">
                          <strong>RESEND_API_KEY is missing!</strong>
                        </p>
                        <p className="text-yellow-100 text-sm mb-3">
                          You need to add your Resend API key to Supabase Edge Function secrets.
                        </p>
                        <a
                          href="https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/settings/functions"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          Add API Key in Supabase →
                        </a>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>Admin Email: <span className="text-[#00F5FF]">{systemStatus?.emailSettings?.adminEmail}</span></div>
                      <div>From Email: <span className="text-[#00F5FF]">{systemStatus?.emailSettings?.fromEmail}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Test Welcome Email */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Test Welcome Email</h3>
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter test email address"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  disabled={isTesting}
                />
                <Button
                  onClick={testWelcomeEmail}
                  disabled={isTesting || !testEmail}
                  className="bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-[#0F1A2F] whitespace-nowrap"
                >
                  {isTesting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Test
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Test Admin Notification */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Test Admin Notification</h3>
              <p className="text-gray-300 text-sm">
                Sends a test notification to wheeljack2019@gmail.com
              </p>
              <Button
                onClick={testAdminEmail}
                disabled={isTesting}
                className="bg-emerald-500 hover:bg-emerald-600 text-white w-full"
              >
                {isTesting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Admin Test
                  </>
                )}
              </Button>
            </div>

            {/* Result Display */}
            {result && (
              <div className={`p-4 rounded-lg border ${
                result.success 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-2 flex-1">
                    <p className={result.success ? 'text-emerald-300' : 'text-red-300'}>
                      {result.message}
                    </p>
                    {result.details && (
                      <pre className="text-xs text-gray-300 bg-black/20 p-3 rounded overflow-x-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    )}
                    {result.error && (
                      <p className="text-sm text-red-300">Error: {result.error}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
              <h4 className="text-blue-300 font-semibold mb-2">📋 What to Do Next</h4>
              {!systemStatus?.status?.emailServiceConfigured ? (
                <div className="space-y-3">
                  <p className="text-yellow-200 font-semibold">⚠️ PROBLEM FOUND: RESEND_API_KEY is missing!</p>
                  <p className="text-sm text-gray-300">Follow these steps to fix:</p>
                  <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                    <li>Go to <a href="https://resend.com/api-keys" target="_blank" className="text-[#00F5FF] underline">Resend Dashboard</a> and copy your API key</li>
                    <li>Go to <a href="https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/settings/functions" target="_blank" className="text-[#00F5FF] underline">Supabase Functions Settings</a></li>
                    <li>Scroll to "Edge Function Secrets"</li>
                    <li>Click "Add Secret"</li>
                    <li>Name: <code className="bg-black/30 px-2 py-1 rounded">RESEND_API_KEY</code></li>
                    <li>Value: Your Resend API key (starts with <code className="bg-black/30 px-2 py-1 rounded">re_</code>)</li>
                    <li>Click "Save"</li>
                    <li>Refresh this page to test again</li>
                  </ol>
                </div>
              ) : (
                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                  <li>✅ Email service is configured and ready!</li>
                  <li>Enter an email you can access</li>
                  <li>Click "Send Test" to send a welcome email</li>
                  <li>Check your inbox and spam folder in 1-2 minutes</li>
                  <li>Also check <a href="https://resend.com/emails" target="_blank" className="text-[#00F5FF] underline">Resend Dashboard</a></li>
                </ul>
              )}
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h4 className="text-white font-semibold">🔗 Quick Links</h4>
              <div className="flex flex-col gap-2">
                <a
                  href="https://resend.com/emails"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00F5FF] hover:underline text-sm"
                >
                  → Resend Email Logs
                </a>
                <a
                  href="https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00F5FF] hover:underline text-sm"
                >
                  → Supabase Edge Function Logs
                </a>
                <a
                  href="/?admin=true"
                  className="text-[#00F5FF] hover:underline text-sm"
                >
                  → Admin Dashboard
                </a>
                <a
                  href="/"
                  className="text-[#00F5FF] hover:underline text-sm"
                >
                  → Back to Waitlist
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Console Logs Notice */}
        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
          <p className="text-yellow-300 text-sm text-center">
            💡 <strong>Tip:</strong> Open the browser console (Press F12) to see detailed logs
          </p>
        </div>
      </div>
    </div>
  );
}
