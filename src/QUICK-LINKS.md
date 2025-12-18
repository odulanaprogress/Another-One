# 🔗 **QUICK REFERENCE LINKS**

## 📊 **SUPABASE DASHBOARD**

### **Main Dashboard:**
https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp

### **Edge Functions:**
https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions

### **Edge Function Logs:**
https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions
→ Click your function → Click "Logs" tab

### **Table Editor (Database):**
https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/editor

### **Secrets/Environment Variables:**
https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/settings/functions
→ Look for "Edge Function Secrets"

---

## 📧 **RESEND (EMAIL SERVICE)**

### **Main Dashboard:**
https://resend.com/

### **Email Logs:**
https://resend.com/emails

### **API Keys:**
https://resend.com/api-keys

### **Domains:**
https://resend.com/domains

---

## 🎯 **YOUR AGENT PLATFORM**

### **Main Waitlist Page:**
```
https://your-app.com/
```

### **Admin Dashboard:**
```
https://your-app.com/?admin=true
```

---

## 📚 **DOCUMENTATION FILES**

| File | Purpose | When to Use |
|------|---------|-------------|
| `/SEND-BULK-EMAIL-NOW.md` | Quick steps to send bulk emails | ✅ When ready to send |
| `/BULK-EMAIL-GUIDE.md` | Comprehensive bulk email guide | 📖 For detailed info |
| `/TEST-EMAIL-FIRST.md` | How to test email system | 🧪 Before sending bulk |
| `/QUICK-LINKS.md` | All important links (this file) | 🔗 Quick reference |
| `/STATUS-CHECK.md` | System status diagnostics | 🔍 When debugging |
| `/EMAIL-TROUBLESHOOTING.md` | Email error solutions | 🐛 When emails fail |

---

## 🛠️ **COMMON TASKS**

### **Check if Emails are Sending:**
1. Go to: https://resend.com/emails
2. Look for recent emails
3. Check status (Delivered, Sent, Bounced)

---

### **View Edge Function Logs:**
1. Go to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions
2. Click your function
3. Click "Logs" tab
4. Look for errors or success messages

---

### **Check Database Signups:**
1. Go to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/editor
2. Click `kv_store_af7c4673` table
3. Look for keys starting with `waitlist:entry:`
4. View signup data

---

### **Add/Update Environment Variables:**
1. Go to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/settings/functions
2. Scroll to "Edge Function Secrets"
3. Click "New secret"
4. Add name and value
5. Save

---

### **Redeploy Edge Function:**
1. Go to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions
2. Click your function
3. Click "Code" or "Edit"
4. Paste new code
5. Click "Deploy"
6. Wait for success message

---

## 🧪 **TESTING TOOLS**

### **Temporary Email Services:**
- https://temp-mail.org/
- https://www.guerrillamail.com/
- https://10minutemail.com/

### **Email Testing:**
- https://www.mail-tester.com/ (Check spam score)
- https://mxtoolbox.com/ (Check email deliverability)

---

## 📞 **SUPPORT RESOURCES**

### **Supabase Docs:**
- https://supabase.com/docs
- https://supabase.com/docs/guides/functions

### **Resend Docs:**
- https://resend.com/docs
- https://resend.com/docs/send-with-nodejs

### **Email Deliverability:**
- https://postmarkapp.com/guides/email-deliverability (Guide)
- https://www.mail-tester.com/ (Testing tool)

---

## 🎯 **CURRENT CONFIGURATION**

### **Your Supabase Project:**
- **Project ID:** `eiruzugttnsoabegmjwp`
- **Region:** (Check Supabase dashboard)
- **Table:** `kv_store_af7c4673`

### **Your Email Setup:**
- **From:** `onboarding@resend.dev`
- **Admin Email:** `wheeljack2019@gmail.com`
- **Service:** Resend API

### **Edge Function:**
- **Name:** `server` (or similar)
- **Route Prefix:** `/make-server-5fa32778`
- **Health Check:** `/health` or `/diagnostic`

---

## 🔐 **ENVIRONMENT VARIABLES**

### **Currently Set:**
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `SUPABASE_DB_URL`
- ✅ `RESEND_API_KEY`

### **How to Check:**
Go to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/settings/functions
→ Scroll to "Edge Function Secrets"

---

## 🎨 **DESIGN TOKENS**

### **Brand Colors:**
- **Deep Navy Blue:** `#0F1A2F`
- **Electric Cyan:** `#00F5FF`

### **Fonts:**
- **Primary:** Inter
- **Serif Headlines:** Playfair Display
- **Mono:** Geist Mono

---

## 📈 **LIMITS & QUOTAS**

### **Resend Free Tier:**
- 📧 100 emails/day
- 📧 3,000 emails/month
- 🔗 1 domain
- ⏱️ No send rate limit (but be reasonable)

### **Supabase Free Tier:**
- 💾 500 MB database
- 📊 50,000 monthly active users
- ⚡ 500,000 Edge Function invocations
- 💪 2 GB Edge Function bandwidth

---

## 🚨 **EMERGENCY CONTACTS**

### **If Site Goes Down:**
1. Check Supabase Status: https://status.supabase.com/
2. Check Edge Function logs (link above)
3. Check browser console (F12)

### **If Emails Stop Sending:**
1. Check Resend Dashboard: https://resend.com/emails
2. Check Resend Status: https://resend.com/status
3. Verify RESEND_API_KEY in Supabase secrets

### **If Database Issues:**
1. Check Supabase Dashboard: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp
2. Check Table Editor to see if data exists
3. Check Edge Function logs for errors

---

## 🎯 **QUICK DIAGNOSTICS**

### **Is Everything Working?**

Run this checklist:

1. **Site loads?**
   - Go to `/` - Should see waitlist form
   - ✅ Yes / ❌ No

2. **Admin dashboard loads?**
   - Go to `/?admin=true` - Should see admin panel
   - ✅ Yes / ❌ No

3. **Can sign up?**
   - Try signing up with test email
   - ✅ Yes / ❌ No

4. **Emails sending?**
   - Check Resend: https://resend.com/emails
   - ✅ Yes / ❌ No

5. **Console shows system operational?**
   - Press F12 → Console
   - Should show: "✅ System Status: ALL SYSTEMS OPERATIONAL"
   - ✅ Yes / ❌ No

---

## 📋 **BOOKMARK THESE**

**Most Used:**
1. ⭐ Admin Dashboard: `/?admin=true`
2. ⭐ Resend Emails: https://resend.com/emails
3. ⭐ Edge Function Logs: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions

**For Debugging:**
1. 🔍 Supabase Edge Functions: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions
2. 🔍 Table Editor: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/editor
3. 🔍 Resend Dashboard: https://resend.com/

**For Setup:**
1. ⚙️ Edge Function Secrets: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/settings/functions
2. ⚙️ Resend API Keys: https://resend.com/api-keys

---

## 🎊 **YOU'RE ALL SET!**

**Everything you need is here.** Bookmark this page for quick access to all your important links!

---

**Next Steps:**
1. ✅ Test email system (see `/TEST-EMAIL-FIRST.md`)
2. ✅ Send bulk emails (see `/SEND-BULK-EMAIL-NOW.md`)
3. ✅ Share waitlist link with users
4. ✅ Monitor admin dashboard
5. ✅ Launch in 3 months! 🚀
