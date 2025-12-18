import { useState, useEffect } from 'react';
import AgentWaitlist from './components/AgentWaitlist';
import WaitlistAdmin from './components/WaitlistAdmin';
import AdminDashboard from './components/AdminDashboard';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Check URL parameters and handle routing
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isAdminRoute = urlParams.get('admin') === 'true';
    const isAdminDashboardRoute = urlParams.get('dashboard') === 'true';
    
    setShowAdmin(isAdminRoute);
    setShowAdminDashboard(isAdminDashboardRoute);
  }, []);

  // Set viewport meta tag for better mobile compatibility
  useEffect(() => {
    // Ensure viewport meta tag exists with proper zoom settings
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes'
    );

    // Show startup message
    console.log('%c🏠 AGENT', 'font-size: 24px; font-weight: bold; color: #00F5FF; text-shadow: 0 0 10px rgba(0,245,255,0.5)');
    console.log('%cRevolutionizing apartment hunting with location-first search', 'font-size: 12px; color: #888; font-style: italic');
    console.log('');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00F5FF');
    console.log('%c✅ Frontend Mode: ACTIVE', 'color: #10b981; font-weight: bold');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00F5FF');
    console.log('✅ Data: Local Storage');
    console.log('💡 Ready for Email Integration');
    console.log('');
    console.log('%cAvailable Pages:', 'font-weight: bold; color: #00F5FF');
    console.log('  • Main Waitlist: /');
    console.log('  • Admin Stats: /?admin=true');
    console.log('  • Admin Dashboard: /?dashboard=true');
    console.log('');
    console.log('%c📧 Email Integration:', 'font-weight: bold; color: #00F5FF');
    console.log('  • Edit /services/localDataService.ts');
    console.log('  • Replace localStorage calls with your email API');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #00F5FF');
  }, []);
  
  return (
    <>
      {showAdminDashboard ? (
        <AdminDashboard />
      ) : showAdmin ? (
        <WaitlistAdmin onBack={() => setShowAdmin(false)} />
      ) : (
        <AgentWaitlist />
      )}
      <Toaster />
    </>
  );
}