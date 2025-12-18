import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Loader2, Users, RefreshCw, ArrowLeft, Mail, Send } from 'lucide-react';
import { fetchServer } from '../utils/serverConfig';
import { toast } from 'sonner@2.0.3';

interface WaitlistEntry {
  email: string;
  propertyType: string;
  timestamp: string;
  queuePosition: number;
}

interface WaitlistAdminProps {
  onBack?: () => void;
}

export default function WaitlistAdmin({ onBack }: WaitlistAdminProps) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [isSendingEmails, setIsSendingEmails] = useState(false);

  const fetchWaitlist = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetchServer('/waitlist/all');

      if (!response.ok) {
        throw new Error('Failed to fetch waitlist');
      }

      const data = await response.json();
      setEntries(data.entries);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching waitlist:', error);
      setError('Failed to load waitlist entries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBulkEmailSend = async () => {
    if (!confirm(`Send welcome emails to all ${total} existing waitlist members?\n\nThis will send a personalized welcome email to everyone who has already signed up.`)) {
      return;
    }

    setIsSendingEmails(true);

    try {
      const response = await fetchServer('/waitlist/resend-welcome', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send emails');
      }

      toast.success('Welcome Emails Sent!', {
        description: `Successfully sent ${data.sent} emails! ${data.failed > 0 ? `(${data.failed} failed)` : ''}`,
      });

      console.log('Bulk email result:', data);
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      toast.error('Failed to Send Emails', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSendingEmails(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1A2F] via-[#1a237e] to-[#0F1A2F] p-6">
      <div className="container mx-auto max-w-6xl">
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                {onBack && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="text-white hover:bg-white/10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                )}
                <CardTitle className="text-3xl text-white">AGENT Waitlist Admin</CardTitle>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleBulkEmailSend}
                  disabled={isSendingEmails || total === 0}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  title="Send welcome emails to all existing waitlist members"
                >
                  {isSendingEmails ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isSendingEmails ? `Sending to ${total}...` : 'Send Welcome Emails'}
                </Button>
                <Button
                  onClick={fetchWaitlist}
                  disabled={isLoading}
                  className="bg-[#00F5FF] hover:bg-[#00F5FF]/90 text-[#0F1A2F]"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#00F5FF]" />
                <span className="text-white">
                  Total Signups: <span className="font-bold text-[#00F5FF]">{total}</span>
                </span>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {Math.max(0, 200 - total)} spots left
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#00F5FF]" />
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No waitlist entries yet. Share your waitlist page to start collecting signups!
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-white/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-white/5 border-white/20 hover:bg-white/5">
                        <TableHead className="text-[#00F5FF]">#</TableHead>
                        <TableHead className="text-[#00F5FF]">Email</TableHead>
                        <TableHead className="text-[#00F5FF]">Property Type</TableHead>
                        <TableHead className="text-[#00F5FF]">Joined Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry) => (
                        <TableRow
                          key={entry.queuePosition}
                          className="border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <TableCell className="text-white font-semibold">
                            #{entry.queuePosition}
                          </TableCell>
                          <TableCell className="text-white font-mono text-sm">
                            {entry.email}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-[#00F5FF]/20 text-[#00F5FF] border-[#00F5FF]/30">
                              {entry.propertyType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300 text-sm">
                            {formatDate(entry.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-300 mb-2">
                        <span className="font-semibold text-white">💡 Tip:</span> Select and copy the table data above to paste into a spreadsheet.
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="font-semibold text-white">📧 Email:</span> Click "Send Welcome Emails" to send personalized welcome emails to all existing members.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
