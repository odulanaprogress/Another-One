# 🏠 AGENT - Location-First Rental Platform

**Revolutionizing apartment hunting with precision location search, professional vetting, and escrow protection.**

## 🎯 About AGENT

AGENT is a luxury rental platform launching in 3 months that transforms how people find apartments. Unlike traditional listings, AGENT lets users search with surgical precision: **State → Local Government Area → Community**.

### 🌟 Key Features

- **🎯 Precise Location Search** - Filter by State, LGA, and Community for pinpoint accuracy
- **✅ 100% Vetted Rentals** - Every property professionally inspected with 4K videos and 3D tours
- **🔒 Escrow Protection** - Your money held securely until property delivery with legal protection
- **🚀 Seamless Relocation** - Perfect for interstate moves with virtual tours and expert support
- **💎 Luxury Experience** - Glassmorphism design with deep navy (#0F1A2F) and electric cyan (#00F5FF)

### 💰 Business Model

- Transparent **15% service fee** for comprehensive vetting and escrow protection
- Professional property inspection and verification before listing
- Legal contract review and dispute resolution
- 24/7 customer support

---

## 🚀 Current Platform Status

This is the **waitlist platform** that captures early adopters before the main launch. It includes:

✅ **Main Waitlist Page** - Beautiful glassmorphism landing page with signup  
✅ **Admin Dashboard** - Manage waitlist entries and track signups  
✅ **Email Confirmation** - Automated welcome emails via Resend API  
✅ **Full Backend** - Supabase Edge Functions with database storage  
✅ **Mobile Optimized** - Responsive design for all devices

---

## 📱 Using the Platform

### For Visitors

**Main Waitlist Page:** `/`
- Join the waitlist by entering your email
- Select your property interest (student housing, luxury apartments, etc.)
- Get instant position in queue
- Receive confirmation email

### For Admins

**Admin Dashboard:** `/?admin=true`
- View all waitlist entries
- See signup statistics and growth
- Export data
- **Send welcome emails to existing signups** (bulk resend feature)
- Track email delivery status

---

## 🛠️ Technical Architecture

### Frontend
- **React** with TypeScript
- **Tailwind CSS v4** with custom glassmorphism theme
- **Motion (Framer Motion)** for animations
- **ShadcN UI** components
- **Sonner** for toast notifications

### Backend
- **Supabase Edge Functions** (Hono server)
- **PostgreSQL** database with KV store
- **Resend API** for email delivery
- **Escrow architecture** ready for payments

### Key Files

```
/App.tsx                           # Main application entry
/components/AgentWaitlist.tsx      # Main waitlist page
/components/WaitlistAdmin.tsx      # Admin dashboard
/supabase/functions/server/        # Edge Function backend
/utils/serverConfig.ts             # Smart server connection
```

---

## 🔧 Configuration

### Environment Variables (Set in Supabase Dashboard)

Your platform is already configured with:

- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key
- `RESEND_API_KEY` - Email service key (optional)

### Edge Function Endpoint

Your deployed function:
```
https://eiruzugttnsoabegmjwp.supabase.co/functions/v1/make-server-5fa32778
```

Routes:
- `/make-server-5fa32778/health` - Health check
- `/make-server-5fa32778/diagnostic` - System diagnostics
- `/make-server-5fa32778/waitlist` - Join waitlist (POST)
- `/make-server-5fa32778/waitlist/count` - Get count
- `/make-server-5fa32778/waitlist/all` - Get all entries (admin)

---

## 📧 Email System

### Welcome Email (Sent on Signup)

Personalized email to each new signup with:
- Welcome message highlighting AGENT's unique value
- Their position in the waitlist queue
- What to expect before launch
- Social media links

### Admin Notifications

Optional email to `wheeljack2019@gmail.com` for every new signup with:
- User details
- Queue position
- Timestamp

### Email Status

Check browser console on page load to see email system status:
- ✅ Active = Emails sending automatically
- ⚠️ Disabled = Signups work, but emails not sent

---

## 📊 Data Storage

All waitlist data is stored in Supabase's KV table:

```typescript
// Data structure
{
  email: string,
  propertyType: string,
  timestamp: ISO string,
  queuePosition: number
}
```

Keys:
- `waitlist:{email}` - Individual user data
- `waitlist:count` - Total signup count

---

## 🎨 Design System

### Colors

- **Deep Navy:** `#0F1A2F` - Primary background
- **Electric Cyan:** `#00F5FF` - Accent color
- **White:** `#FFFFFF` - Text and highlights

### Typography

- **Headlines:** Playfair Display (serif)
- **Body:** Inter (sans-serif)
- **Code/Mono:** Geist Mono

### Theme

Luxury glassmorphism with:
- Frosted glass panels
- Subtle blur effects
- Glowing cyan accents
- Smooth animations

---

## 🚀 Launch Checklist

Before launching in 3 months:

### Pre-Launch (Now - Month 2)
- [x] Waitlist platform live
- [x] Email automation working
- [ ] Reach 1000+ waitlist signups
- [ ] Social media presence established
- [ ] Property vetting process finalized

### Month 3 (Launch Prep)
- [ ] Main platform development complete
- [ ] Payment/escrow integration tested
- [ ] Legal framework finalized
- [ ] First 10 properties vetted and ready
- [ ] Customer support team trained

### Launch Day
- [ ] Migrate waitlist users to main platform
- [ ] Send launch announcement emails
- [ ] Activate property listings
- [ ] Enable booking and payments
- [ ] Monitor system performance

---

## 🔐 Security

- All API keys stored as environment variables
- Service role key never exposed to frontend
- CORS configured for production domain
- SQL injection protected via KV store
- Email validation on all inputs

---

## 📈 Analytics & Growth

Track your waitlist growth:

1. **Check current count**: Open admin dashboard
2. **Monitor email deliveries**: Check console logs
3. **Export data**: Use admin dashboard export feature
4. **Growth metrics**: Daily signup rate, property type breakdown

---

## 🆘 Support & Troubleshooting

### Common Issues

**Signups not working?**
- Check browser console for errors
- Verify Edge Function is deployed
- Test with: Browser Console → Should show "System Status: OPERATIONAL"

**Emails not sending?**
- Emails are optional - signups still work
- Check `RESEND_API_KEY` is set in Supabase
- Verify console shows "Email System: Active"

**Admin dashboard empty?**
- Make at least one signup first
- Hard refresh the page (Ctrl+Shift+R)
- Check console for connection errors

### Getting Help

If you encounter issues:
1. Check browser console (F12) for error messages
2. Visit Supabase Dashboard → Edge Functions → Logs
3. Test the health endpoint directly in browser

---

## 📱 Social Media Links

Currently configured:
- Instagram: [@agen.t1236](https://www.instagram.com/agen.t1236?igsh=MTd6d2VrNHQxNjRs)

Update social links in `/components/AgentWaitlist.tsx` (line 44+)

---

## 🎯 Next Steps

1. **Promote your waitlist** - Share on social media
2. **Gather feedback** - Survey early signups
3. **Refine messaging** - A/B test headlines
4. **Build community** - Engage with waitlist members
5. **Prepare for launch** - Develop main platform

---

## 📄 License

Proprietary - AGENT Platform © 2025

---

## 🙏 Built With

- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Resend](https://resend.com/)
- [ShadcN UI](https://ui.shadcn.com/)
- [Motion](https://motion.dev/)

---

**Ready to revolutionize rental housing?** 🚀

Your platform is live and ready to capture those early adopters. Start promoting your waitlist and build momentum for launch!
