# 🎯 ADMIN DASHBOARD GUIDE

## 🔐 Access the Dashboard

Visit: `/?dashboard=true`

**Admin Email:**
- **Email:** `odulanaprogress@gmail.com`

*No password required - simply enter your authorized admin email to access the dashboard.*

---

## 🌟 Dashboard Features

### 1. **View All Users**
- See complete list of all waitlist members
- View queue position, email, property type, and join date
- Real-time count of total users and spots remaining

### 2. **Send Individual Messages** 📧
Click the mail icon (✉️) next to any user to:
- Compose a custom subject line
- Write a personalized message
- Send branded email directly to the user

### 3. **Edit User Information** ✏️
Click the edit icon (📝) next to any user to:
- Update their email address
- Change their property type preference
- Save changes instantly

### 4. **Delete Users** 🗑️
Click the delete icon (🗑️) next to any user to:
- Remove them from the waitlist
- Automatically update the user count
- Confirmation prompt prevents accidental deletions

### 5. **Refresh Data** 🔄
- Click the "Refresh" button to update the user list
- Auto-loads on login

### 6. **Secure Logout** 🚪
- Click "Logout" to end your session
- Session stored securely in browser

---

## 📊 Quick Stats

The dashboard displays:
- **Total Users:** Current waitlist count
- **Spots Left:** Remaining slots out of 200
- **User Details:** Email, property interest, join date, position

---

## 💡 Tips

1. **Bulk Operations:** For sending emails to all users, use the original admin panel at `/?admin=true`
2. **Message Templates:** Pre-filled message templates help you communicate quickly
3. **Data Safety:** All changes are instant - deleted users cannot be recovered
4. **Session Security:** Your login session expires when you close the browser

---

## 🛠️ Troubleshooting

**Can't login?**
- Verify you're using the correct email: `odulanaprogress@gmail.com`
- Email is case-insensitive but must match exactly
- Clear browser cache if issues persist
- Ensure you're visiting `/?dashboard=true`

**Messages not sending?**
- Ensure RESEND_API_KEY is configured in Supabase
- Check console logs for detailed error messages
- Verify internet connection

**Users not showing?**
- Click the "Refresh" button
- Check if waitlist has any signups
- Verify backend connection

---

## 🎨 Pages Overview

| Route | Purpose |
|-------|---------|
| `/` | Public waitlist signup page |
| `/?admin=true` | Basic stats + bulk email sending |
| `/?dashboard=true` | **Full admin dashboard (YOU ARE HERE)** |
| `/?test-email=true` | Email diagnostic tool |

---

## 🔒 Security Notes

- Admin email is hardcoded for security (email-only authentication)
- Sessions are browser-based (sessionStorage)
- No passwords required or stored
- All email operations are server-side
- Only authorized email addresses can access the dashboard

---

**Need Help?** Contact the development team or check the server logs for detailed error information.
