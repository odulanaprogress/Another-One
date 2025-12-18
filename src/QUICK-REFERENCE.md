# 🚀 AGENT Platform - Quick Reference

## 📍 URLs

| Page | URL | Description |
|------|-----|-------------|
| **Main Waitlist** | `/` | Public waitlist signup page |
| **Admin Dashboard** | `/?admin=true` | Manage waitlist entries |

## 🔌 API Endpoints

Base URL: `https://eiruzugttnsoabegmjwp.supabase.co/functions/v1/make-server-5fa32778`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/diagnostic` | GET | System status |
| `/waitlist` | POST | Join waitlist |
| `/waitlist/count` | GET | Get signup count |
| `/waitlist/all` | GET | Get all entries (admin) |
| `/waitlist/resend-welcome` | POST | Bulk send welcome emails to existing signups |

## 🎨 Brand Colors

```css
Deep Navy:    #0F1A2F  /* Primary background */
Electric Cyan: #00F5FF  /* Accent color */
White:        #FFFFFF  /* Text */
```

## 📧 Email Configuration

**Admin Email:** `wheeljack2019@gmail.com`  
**From Email:** `onboarding@resend.dev`

Environment variable: `RESEND_API_KEY`

## 🗂️ Key Files

```
/App.tsx                      → Main app entry point
/components/AgentWaitlist.tsx → Waitlist landing page
/components/WaitlistAdmin.tsx → Admin dashboard
/supabase/functions/server/   → Backend Edge Function
/utils/serverConfig.ts        → Smart server connection
/styles/globals.css           → Design system
```

## 🔍 Console Commands

Open browser console (F12) to see:
- ✅ System status on page load
- 🔍 Connection diagnostics
- 📧 Email system status
- 🎯 Available pages

## 📊 Database Structure

KV Store keys:
```
waitlist:{email}  → Individual signup data
waitlist:count    → Total signup count
```

Data format:
```json
{
  "email": "user@example.com",
  "propertyType": "Student Housing",
  "timestamp": "2025-01-15T10:30:00Z",
  "queuePosition": 42
}
```

## 🎯 Launch Timeline

- **Now - Month 2:** Build waitlist momentum
- **Month 3:** Final prep & property vetting  
- **Launch Day:** Activate main platform

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Signups not working | Check console for errors |
| Emails not sending | Verify `RESEND_API_KEY` is set |
| Admin empty | Make a test signup first |
| Connection failed | Edge Function needs deployment |

## 📱 Social Media

Instagram: [@agen.t1236](https://www.instagram.com/agen.t1236?igsh=MTd6d2VrNHQxNjRs)

Update in: `/components/AgentWaitlist.tsx` (line 44)

## 💎 Design Features

- Glassmorphism UI with blur effects
- Smooth Motion animations
- Mobile-responsive layout
- Luxury serif headlines (Playfair Display)
- Modern body text (Inter)

---

**Your platform is LIVE! 🚀**

Start promoting and watch the signups roll in!
