# 📧 Email System Troubleshooting Guide

## 🔍 Problem: Welcome Emails Not Sending to New Signups

If new waitlist signups are **NOT receiving welcome emails**, follow this checklist:

---

## ✅ Step 1: Verify RESEND_API_KEY is Set

### Check in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/settings/functions
2. Look for **Environment Variables** section
3. Verify `RESEND_API_KEY` is listed
4. It should show: `re_xxxxx...` (starts with "re_")

### If NOT Set:

1. Go to Resend Dashboard: https://resend.com/api-keys
2. Create a new API key (or copy existing one)
3. In Supabase Dashboard → Settings → Edge Functions → Environment Variables
4. Click **Add Environment Variable**
5. Name: `RESEND_API_KEY`
6. Value: Paste your Resend API key
7. Click **Save**
8. **IMPORTANT:** Redeploy your Edge Function after adding the key

---

## ✅ Step 2: Redeploy Edge Function

The Edge Function code was updated to add the bulk email feature. You MUST redeploy for it to work.

### How to Redeploy:

1. **Open Server Code**
   - File: `/supabase/functions/server/index.tsx`
   - Select ALL code (Ctrl+A / Cmd+A)
   - Copy (Ctrl+C / Cmd+C)

2. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions
   - Click on your function (e.g., "server" or "make-server-5fa32778")

3. **Paste New Code**
   - Click **Edit** button
   - Select all existing code
   - Paste your copied code
   - Click **Deploy** button (bottom right)

4. **Wait for Deployment**
   - Watch for "Deployment successful" message
   - Usually takes 10-30 seconds

5. **Verify Deployment**
   - Go to your waitlist page: `/`
   - Open browser console (F12)
   - Look for: "✅ System Status: ALL SYSTEMS OPERATIONAL"
   - Should show: "✅ Email System: Active (Welcome emails enabled)"

---

## ✅ Step 3: Test Email System

### Test in Browser Console

1. Open your waitlist page: `/`
2. Press F12 (open browser console)
3. Look for startup messages

**If emails are configured correctly, you'll see:**
```
🏠 AGENT
Revolutionizing apartment hunting with location-first search

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ System Status: ALL SYSTEMS OPERATIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server: Connected
✅ Database: Ready
✅ Email System: Active (Welcome emails enabled)

Available Pages:
  • Main Waitlist: /
  • Admin Dashboard: /?admin=true
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**If emails are NOT configured:**
```
⚠️  Email System: Disabled (signups still work)
```

### Test the Diagnostic Endpoint

Open this URL in your browser:
```
https://eiruzugttnsoabegmjwp.supabase.co/functions/v1/make-server-5fa32778/diagnostic
```

Look for:
```json
{
  "status": {
    "emailServiceConfigured": true,
    "readyToSendEmails": true
  },
  "message": "✅ Email service is configured and ready..."
}
```

If `emailServiceConfigured` is `false`, the RESEND_API_KEY is not set.

---

## ✅ Step 4: Test Actual Email Sending

### Make a Test Signup

1. Go to your waitlist page: `/`
2. Enter YOUR OWN email address
3. Select a property type
4. Click "Join the Waitlist"
5. Check your email inbox (and spam folder)

### What Should Happen:

**Immediately:**
- Success toast notification appears
- Shows your queue position

**Within 1 minute:**
- You receive welcome email from "AGENT Waitlist <onboarding@resend.dev>"
- Subject: "🚀 Welcome to AGENT - You're #X on the Waitlist!"

**Also:**
- Admin receives notification at wheeljack2019@gmail.com

### If Email Doesn't Arrive:

1. **Check spam folder** - Resend emails sometimes land in spam initially
2. **Check Resend Dashboard** - https://resend.com/emails
   - Look for your email in the list
   - Check delivery status
   - Look for error messages
3. **Check Edge Function Logs**:
   - Supabase Dashboard → Edge Functions → Logs
   - Look for lines like:
     ```
     [WAITLIST] Signup successful: yourmail@example.com
     [WAITLIST] Initiating welcome email send for yourmail@example.com...
     [EMAIL] Starting welcome email for: yourmail@example.com
     [EMAIL SUCCESS] Welcome email sent successfully to yourmail@example.com
     ```

---

## ✅ Step 5: Check Edge Function Logs

### View Logs in Real-Time:

1. Go to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions
2. Click on your function
3. Click **Logs** tab
4. Make a test signup
5. Watch logs appear in real-time

### What to Look For:

**SUCCESS - Emails Working:**
```
[WAITLIST] Signup successful: user@example.com - Position #42
[WAITLIST] Initiating welcome email send for user@example.com...
[EMAIL] Starting welcome email for: user@example.com, position: 42
[EMAIL] RESEND_API_KEY found, sending welcome email to: user@example.com
[EMAIL] Resend API response status for user@example.com: 200
[EMAIL SUCCESS] Welcome email sent successfully to user@example.com
```

**FAILURE - No API Key:**
```
[EMAIL ERROR] RESEND_API_KEY not configured. Skipping welcome email.
```
→ **Solution:** Add RESEND_API_KEY to environment variables and redeploy

**FAILURE - Invalid API Key:**
```
[EMAIL ERROR] Welcome email failed for user@example.com: {"error":"Invalid API key"}
```
→ **Solution:** Check your Resend API key is correct

**FAILURE - Rate Limit:**
```
[EMAIL ERROR] Welcome email failed: {"error":"Rate limit exceeded"}
```
→ **Solution:** Wait or upgrade Resend plan

---

## ✅ Step 6: Test Bulk Email Feature

Once regular emails work, test bulk sending:

1. Go to admin dashboard: `/?admin=true`
2. You should see green "Send Welcome Emails" button
3. Click it
4. Confirm the prompt
5. Watch for success toast

**Check Logs:**
```
[BULK-EMAIL] Starting bulk welcome email resend...
[BULK-EMAIL] Found X waitlist entries
[BULK-EMAIL] Sending to user1@example.com (position #1)...
[BULK-EMAIL] ✅ Sent to user1@example.com
[BULK-EMAIL] Complete! Sent: X, Failed: 0
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Email System: Disabled"

**Cause:** RESEND_API_KEY not set  
**Solution:** 
1. Add RESEND_API_KEY to Supabase environment variables
2. Redeploy Edge Function
3. Hard refresh browser (Ctrl+Shift+R)

### Issue 2: Emails Go to Spam

**Cause:** Sender domain not verified  
**Solution:**
1. Go to Resend Dashboard
2. Add your custom domain
3. Verify DNS records (SPF, DKIM)
4. Warm up sending reputation

### Issue 3: "Send Welcome Emails" Button Missing

**Cause:** Edge Function not redeployed with new code  
**Solution:**
1. Copy latest server code from `/supabase/functions/server/index.tsx`
2. Redeploy in Supabase Dashboard
3. Hard refresh admin page

### Issue 4: Button Disabled (Grayed Out)

**Cause:** No waitlist entries exist  
**Solution:** Make at least one test signup first

### Issue 5: Rate Limit Errors

**Cause:** Sending too many emails too fast (Resend free tier: 100/day, 1/sec)  
**Solution:**
- **Free tier:** Wait 24 hours or upgrade to Pro
- **Pro tier:** Contact Resend support

### Issue 6: Emails Sent But Not Received

**Check:**
1. Spam folder
2. Email address is correct
3. Resend Dashboard shows delivery
4. Check recipient's email provider isn't blocking

---

## 📊 Verification Checklist

Use this checklist to verify everything is working:

- [ ] RESEND_API_KEY is set in Supabase environment variables
- [ ] Edge Function is redeployed with latest code
- [ ] Browser console shows "Email System: Active"
- [ ] Diagnostic endpoint shows `emailServiceConfigured: true`
- [ ] Test signup receives welcome email within 1 minute
- [ ] Admin receives notification email
- [ ] Edge Function logs show successful email sends
- [ ] Bulk email button appears in admin dashboard
- [ ] Bulk email sends successfully to test users
- [ ] Emails don't land in spam folder

---

## 🎯 Quick Test Script

Run this in browser console on your waitlist page:

```javascript
// Test email system status
fetch('https://eiruzugttnsoabegmjwp.supabase.co/functions/v1/make-server-5fa32778/diagnostic', {
  headers: { 'Authorization': 'Bearer ' + 'YOUR_ANON_KEY' }
})
.then(r => r.json())
.then(d => {
  console.log('Email Configured:', d.status.emailServiceConfigured);
  console.log('Ready to Send:', d.status.readyToSendEmails);
  console.log('Message:', d.message);
});
```

Expected output if working:
```
Email Configured: true
Ready to Send: true
Message: ✅ Email service is configured and ready - All emails will be sent automatically
```

---

## 📞 Still Not Working?

If you've tried everything above and emails still aren't sending:

### 1. Check Resend Status
Visit: https://status.resend.com/
(Sometimes Resend has service issues)

### 2. Verify API Key Permissions
- Go to Resend Dashboard
- Check API key has "Send Emails" permission
- Try creating a new API key

### 3. Check Domain Restrictions
- Some Resend plans restrict domains
- Try using "onboarding@resend.dev" (always works)
- Or verify your custom domain

### 4. Review Edge Function Deployment
- Ensure deployment was successful
- Check no compilation errors
- Verify all environment variables loaded

### 5. Test with cURL

```bash
curl -X POST https://eiruzugttnsoabegmjwp.supabase.co/functions/v1/make-server-5fa32778/waitlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"email":"test@example.com","propertyType":"General Interest"}'
```

Check the response for any errors.

---

## ✨ Success Indicators

When everything is working correctly:

✅ Console shows "Email System: Active"  
✅ New signups receive welcome email instantly  
✅ Admin receives notification emails  
✅ Bulk email button works in admin dashboard  
✅ Edge Function logs show successful sends  
✅ Resend Dashboard shows emails as "Delivered"  
✅ Emails land in inbox (not spam)  

---

**Your email system should now be fully operational!** 🚀

If you followed all steps and it's still not working, there may be an issue with your Resend account or API key.
