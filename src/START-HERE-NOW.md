# 🚨 START HERE - EMAIL NOT WORKING

## ⚡ DO THIS IN 30 SECONDS:

### **Go to this page:**
```
/?test-email=true
```

### **Look at the TOP of the page**

You'll see **"System Status"** with one of these:

---

## 📊 WHAT YOU'LL SEE:

### ✅ **Option A: "Email Service: ACTIVE"**

**This means:** API key is set correctly!

**The problem:** Emails going to spam OR Resend free tier restriction

**Fix:**
1. Test must use YOUR Resend verified email
2. Check spam folder thoroughly
3. Check Resend dashboard: https://resend.com/emails

---

### ⚠️ **Option B: "Email Service: NOT CONFIGURED"**

**This means:** RESEND_API_KEY is MISSING!

**Fix (5 minutes):**

1. **Get API Key:**
   - Go to: https://resend.com/api-keys
   - Create account if needed (FREE)
   - Click "Create API Key"
   - Copy it (starts with `re_...`)

2. **Add to Supabase:**
   - Go to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/settings/functions
   - Scroll to "Edge Function Secrets"
   - Click "Add secret"
   - Name: `RESEND_API_KEY`
   - Value: Your API key
   - Click "Save"

3. **Redeploy Function:**
   - Go to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions
   - Find your function
   - Click "..." → "Redeploy"

4. **Test Again:**
   - Go back to `/?test-email=true`
   - Refresh page
   - Should now show "✅ ACTIVE"

---

### ❌ **Option C: "Server Not Connected"**

**This means:** Edge Function not deployed

**Fix:**
- Go to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions
- Make sure function is deployed
- Click "Deploy" if needed

---

## 🎯 AFTER IT SHOWS "✅ ACTIVE":

1. Enter email: `wheeljack2019@gmail.com`
2. Click "Send Test"
3. Wait 2 minutes
4. Check inbox + spam

**Important:** Resend FREE tier only sends to YOUR verified email!

---

## 📧 RESEND FREE TIER RULE:

**You can only send emails TO the email address you used to sign up for Resend!**

So:
- If you signed up to Resend with `wheeljack2019@gmail.com`
- You can ONLY test with `wheeljack2019@gmail.com`
- NOT `+test` or any other email!

To send to other emails, verify your domain in Resend (still free).

---

## ✅ SIMPLE CHECKLIST:

1. [ ] Go to `/?test-email=true`
2. [ ] Check "System Status"
3. [ ] If NOT ACTIVE → Add API key to Supabase
4. [ ] If ACTIVE → Test with YOUR Resend email
5. [ ] Wait 2 minutes
6. [ ] Check spam folder
7. [ ] Check https://resend.com/emails

---

## 🚀 DO THIS NOW:

**Type this in your browser:**
```
/?test-email=true
```

**Then follow what it says at the top!**

The page will tell you exactly what's wrong and how to fix it! 📧✨
