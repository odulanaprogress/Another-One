# 📋 DEPLOYMENT CHECKLIST

## Quick Reference - Check These Off!

---

## ☐ STEP 1: Get Resend API Key

**Time: 2 minutes**

- [ ] Go to https://resend.com/
- [ ] Sign up or log in
- [ ] Click "API Keys" in sidebar
- [ ] Click "Create API Key"
- [ ] Name it: `AGENT Waitlist`
- [ ] Copy the key (starts with `re_`)
- [ ] Save it somewhere safe

✅ **Done when:** You have a key that looks like `re_xxxxxxxxxxxxx`

---

## ☐ STEP 2: Deploy Edge Function

**Time: 5 minutes**

### If you DON'T have a function yet:

- [ ] Go to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions
- [ ] Click **"Create a new function"**
- [ ] Function name: `server`
- [ ] Click **"Create function"**

### For everyone (new or existing function):

- [ ] Open `/supabase/functions/server/index.tsx` in this project
- [ ] Select ALL code (Ctrl+A / Cmd+A)
- [ ] Copy (Ctrl+C / Cmd+C)
- [ ] In Supabase, delete all code in editor
- [ ] Paste your code (Ctrl+V / Cmd+V)
- [ ] Click **"Deploy"** button (bottom right)
- [ ] Wait for "Deployment successful" message

✅ **Done when:** Green checkmark appears, says "Deployment successful"

---

## ☐ STEP 3: Add RESEND_API_KEY

**Time: 1 minute**

- [ ] Go to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/settings/functions
- [ ] Scroll to **"Environment Variables"**
- [ ] Click **"Add new environment variable"**
- [ ] Name: `RESEND_API_KEY`
- [ ] Value: Paste your Resend API key from Step 1
- [ ] Click **"Save"**

### CRITICAL: Redeploy after adding key

- [ ] Go back to: https://supabase.com/dashboard/project/eiruzugttnsoabegmjwp/functions
- [ ] Click your function name
- [ ] Click **"Redeploy"** or **"Deploy"** button
- [ ] Wait for success

✅ **Done when:** Variable shows in list, function redeployed

---

## ☐ STEP 4: Test System

**Time: 2 minutes**

### Console Check:

- [ ] Open your waitlist page
- [ ] Press F12 (open console)
- [ ] Look for: `✅ Email System: Active (Welcome emails enabled)`

✅ **Done when:** Console shows "Email System: Active"

---

### Test Signup:

- [ ] Enter YOUR email in waitlist form
- [ ] Select a property type
- [ ] Click "Join the Waitlist"
- [ ] Check your email inbox (within 60 seconds)
- [ ] Should receive welcome email

✅ **Done when:** You receive "Welcome to Agent! 🚀" email

---

### Test Admin Email:

- [ ] Check wheeljack2019@gmail.com inbox
- [ ] Should receive admin notification

✅ **Done when:** Admin receives notification email

---

## ☐ STEP 5: Test Bulk Email

**Time: 1 minute**

- [ ] Go to: `/?admin=true`
- [ ] See green **"Send Welcome Emails"** button at top
- [ ] Click it
- [ ] Confirm popup
- [ ] Wait for success message
- [ ] All existing users receive emails

✅ **Done when:** Success toast appears, emails sent to all users

---

## 🎉 SUCCESS CHECKLIST

You're done when ALL of these are true:

- [ ] ✅ Console shows "Email System: Active"
- [ ] ✅ Test signup received welcome email
- [ ] ✅ Admin received notification email
- [ ] ✅ Bulk email button appears in admin dashboard
- [ ] ✅ Bulk email sent successfully
- [ ] ✅ No errors in Edge Function logs

---

## 🚨 IF SOMETHING ISN'T WORKING

| Problem | Quick Fix | Detailed Help |
|---------|-----------|---------------|
| Console shows "Disabled" | Add RESEND_API_KEY, redeploy | `/ACTION-REQUIRED.md` Step 1 |
| No welcome email | Check spam, wait 1 min | `/EMAIL-TROUBLESHOOTING.md` Step 4 |
| Button missing | Redeploy Edge Function | `/ACTION-REQUIRED.md` Step 2 |
| Button grayed out | Make a signup first | Normal behavior |
| Deployment fails | Copy ALL code, retry | `/STATUS-CHECK.md` Troubleshooting |

---

## 📞 STUCK? CHECK THESE FILES:

1. **`/STATUS-CHECK.md`** - Complete verification of your code
2. **`/ACTION-REQUIRED.md`** - Detailed step-by-step guide
3. **`/QUICK-FIX-GUIDE.md`** - 3-minute quick start
4. **`/EMAIL-TROUBLESHOOTING.md`** - Debug any email issue

---

## ⏱️ TIME ESTIMATE

- Step 1: 2 minutes
- Step 2: 5 minutes
- Step 3: 1 minute
- Step 4: 2 minutes
- Step 5: 1 minute

**Total: ~11 minutes** ⚡

---

## 🎯 YOU'RE ALMOST THERE!

Everything is coded and ready. Just follow these 5 steps and you'll have:

✨ Automatic welcome emails for new signups  
✨ Admin notifications for every signup  
✨ Bulk email sending to existing users  
✨ Professional branded emails  
✨ Full error handling and logging  

**Let's do this!** 🚀
