import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Admin notification email function
async function sendAdminNotification(userEmail: string, queuePosition: number, propertyType: string) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const adminEmail = "wheeljack2019@gmail.com";
  
  console.log(`[EMAIL] Starting admin notification for: ${userEmail}, position: ${queuePosition}`);
  
  if (!resendApiKey) {
    console.log("[EMAIL ERROR] RESEND_API_KEY not configured. Skipping admin notification.");
    return { success: false, error: "Email service not configured" };
  }
  
  console.log(`[EMAIL] RESEND_API_KEY found, sending to admin: ${adminEmail}`);

  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New AGENT Waitlist Signup</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 30px; background: linear-gradient(135deg, #0F1A2F 0%, #1a237e 100%);">
                    <h1 style="margin: 0; color: #00F5FF; font-size: 24px; font-weight: 700;">🎉 New AGENT Waitlist Signup</h1>
                    <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px;">A new user has joined the waitlist!</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <div style="background: #f8f9fa; border-left: 4px solid #00F5FF; padding: 20px; margin-bottom: 20px; border-radius: 4px;">
                      <h3 style="margin: 0 0 15px; color: #0F1A2F; font-size: 18px;">User Details</h3>
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #666; font-size: 14px; font-weight: 600; width: 180px;">Email:</td>
                          <td style="color: #0F1A2F; font-size: 14px; font-weight: 500;">${userEmail}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px; font-weight: 600;">Queue Position:</td>
                          <td style="color: #00F5FF; font-size: 16px; font-weight: 700;">#${queuePosition}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px; font-weight: 600;">Property Interest:</td>
                          <td style="color: #0F1A2F; font-size: 14px;">${propertyType}</td>
                        </tr>
                        <tr>
                          <td style="color: #666; font-size: 14px; font-weight: 600;">Timestamp:</td>
                          <td style="color: #666; font-size: 13px;">${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC</td>
                        </tr>
                      </table>
                    </div>
                    
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 4px; margin-top: 20px;">
                      <p style="margin: 0; color: #1565c0; font-size: 14px;">
                        <strong>💡 Quick Stats:</strong> Total signups: ${queuePosition}
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 30px; background: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
                    <p style="margin: 0; color: #666; font-size: 12px;">
                      This is an automated notification from AGENT waitlist system.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const emailPayload = {
      from: "AGENT Notifications <onboarding@resend.dev>",
      to: adminEmail,
      subject: `🔔 New Waitlist Signup: ${userEmail} (#${queuePosition})`,
      html: adminEmailHtml,
    };
    
    console.log(`[EMAIL] Sending admin notification request to Resend API...`);
    
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const data = await response.json();
    
    console.log(`[EMAIL] Resend API response status: ${response.status}`);
    console.log(`[EMAIL] Resend API response data:`, JSON.stringify(data));

    if (!response.ok) {
      console.log(`[EMAIL ERROR] Admin notification failed for ${userEmail}:`, JSON.stringify(data));
      return { success: false, error: data };
    }

    console.log(`[EMAIL SUCCESS] Admin notification sent to ${adminEmail} for signup: ${userEmail}`);
    return { success: true, data };
  } catch (error) {
    console.log(`[EMAIL EXCEPTION] Admin notification exception for ${userEmail}:`, error.message);
    console.log(`[EMAIL EXCEPTION] Stack trace:`, error.stack);
    return { success: false, error: error.message };
  }
}

// Welcome email function - Sent immediately after registration
async function sendWelcomeEmail(email: string, queuePosition: number, propertyType: string) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  
  console.log(`[EMAIL] Starting welcome email for: ${email}, position: ${queuePosition}`);
  
  if (!resendApiKey) {
    console.log("[EMAIL ERROR] RESEND_API_KEY not configured. Skipping welcome email.");
    return { success: false, error: "Email service not configured" };
  }
  
  console.log(`[EMAIL] RESEND_API_KEY found, sending welcome email to: ${email}`);

  const welcomeEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Agent! 🚀</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0F1A2F;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0F1A2F; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a237e 0%, #0F1A2F 100%); border-radius: 20px; overflow: hidden; border: 2px solid rgba(0, 245, 255, 0.3); box-shadow: 0 20px 60px rgba(0, 245, 255, 0.2);">
                <!-- Header with Rocket -->
                <tr>
                  <td style="padding: 50px 40px 40px; text-align: center; background: linear-gradient(180deg, rgba(0, 245, 255, 0.15) 0%, rgba(0, 245, 255, 0.05) 100%);">
                    <div style="font-size: 60px; margin-bottom: 20px; animation: bounce 2s infinite;">🚀</div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0, 245, 255, 0.3);">Welcome to Agent!</h1>
                    <p style="margin: 15px 0 0; color: rgba(255, 255, 255, 0.8); font-size: 18px; font-weight: 500;">You're #${queuePosition} on our exclusive waitlist</p>
                  </td>
                </tr>
                
                <!-- Warm Welcome Message -->
                <tr>
                  <td style="padding: 40px 40px 30px;">
                    <div style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 30px; margin-bottom: 30px; backdrop-filter: blur(10px);">
                      <h2 style="margin: 0 0 15px; color: #ffffff; font-size: 24px; font-weight: 600; text-align: center;">🎉 A Warm Welcome to You!</h2>
                      <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.8; margin: 0; text-align: center;">
                        We're absolutely thrilled to have you join us on this exciting journey! Thank you for choosing Agent as your trusted partner in finding the perfect home.
                      </p>
                    </div>

                    <!-- Brief Introduction Section -->
                    <div style="margin-bottom: 30px;">
                      <h3 style="color: #00F5FF; font-size: 22px; margin: 0 0 20px; font-weight: 600; text-align: center;">
                        🏠 What Makes Agent Special
                      </h3>
                      
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 15px; background: rgba(0, 245, 255, 0.08); border-radius: 12px; margin-bottom: 12px; border: 1px solid rgba(0, 245, 255, 0.2);">
                            <div style="display: flex; align-items: flex-start;">
                              <div style="background: rgba(0, 245, 255, 0.2); border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                                <span style="font-size: 24px;">📍</span>
                              </div>
                              <div>
                                <strong style="color: #ffffff; font-size: 16px; display: block; margin-bottom: 6px;">Location-First Search</strong>
                                <span style="color: rgba(255, 255, 255, 0.8); font-size: 14px; line-height: 1.6;">Navigate by State → Local Government Area → Community to find apartments exactly where you want to live.</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; background: rgba(0, 245, 255, 0.08); border-radius: 12px; margin-bottom: 12px; border: 1px solid rgba(0, 245, 255, 0.2);">
                            <div style="display: flex; align-items: flex-start;">
                              <div style="background: rgba(0, 245, 255, 0.2); border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                                <span style="font-size: 24px;">✅</span>
                              </div>
                              <div>
                                <strong style="color: #ffffff; font-size: 16px; display: block; margin-bottom: 6px;">Professional Vetting</strong>
                                <span style="color: rgba(255, 255, 255, 0.8); font-size: 14px; line-height: 1.6;">Every property comes with complete videos, 3D models, and thorough inspections. No surprises.</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; background: rgba(0, 245, 255, 0.08); border-radius: 12px; border: 1px solid rgba(0, 245, 255, 0.2);">
                            <div style="display: flex; align-items: flex-start;">
                              <div style="background: rgba(0, 245, 255, 0.2); border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                                <span style="font-size: 24px;">🛡️</span>
                              </div>
                              <div>
                                <strong style="color: #ffffff; font-size: 16px; display: block; margin-bottom: 6px;">Escrow Protection</strong>
                                <span style="color: rgba(255, 255, 255, 0.8); font-size: 14px; line-height: 1.6;">Your money is held safely until property delivery. Complete peace of mind with legal protection.</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- Your Interest Box -->
                    <div style="background: linear-gradient(135deg, rgba(0, 245, 255, 0.15) 0%, rgba(0, 245, 255, 0.05) 100%); border: 2px solid rgba(0, 245, 255, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 30px; text-align: center;">
                      <p style="color: rgba(255, 255, 255, 0.7); font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Your Interest</p>
                      <p style="color: #00F5FF; font-size: 18px; font-weight: 600; margin: 0;">${propertyType}</p>
                    </div>

                    <!-- Call-to-Action: Priority Support -->
                    <div style="background: linear-gradient(135deg, #00F5FF 0%, #00d4ff 100%); border-radius: 16px; padding: 30px; text-align: center; box-shadow: 0 10px 30px rgba(0, 245, 255, 0.3); margin-bottom: 30px;">
                      <h3 style="margin: 0 0 15px; color: #0F1A2F; font-size: 22px; font-weight: 700;">🌟 Need Priority Support?</h3>
                      <p style="margin: 0 0 20px; color: #0F1A2F; font-size: 15px; line-height: 1.6; opacity: 0.9;">
                        As a valued waitlist member, you have access to our priority support team. Have questions? We're here to help you every step of the way!
                      </p>
                      <a href="mailto:support@agent.com?subject=Priority Support Request - Waitlist Member %23${queuePosition}" style="display: inline-block; background: #0F1A2F; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(15, 26, 47, 0.4);">
                        Contact Priority Support →
                      </a>
                    </div>

                    <!-- What's Next -->
                    <div style="background: rgba(255, 255, 255, 0.05); border-left: 4px solid #00F5FF; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                      <h4 style="margin: 0 0 12px; color: #00F5FF; font-size: 18px; font-weight: 600;">🗓️ What Happens Next?</h4>
                      <ul style="margin: 0; padding-left: 20px; color: rgba(255, 255, 255, 0.85); font-size: 14px; line-height: 1.8;">
                        <li style="margin-bottom: 8px;">You'll receive exclusive updates as we approach our launch in 3 months</li>
                        <li style="margin-bottom: 8px;">Early access to vetted properties before the general public</li>
                        <li style="margin-bottom: 8px;">Special launch pricing reserved exclusively for waitlist members</li>
                        <li>Behind-the-scenes insights into how we're revolutionizing apartment hunting</li>
                      </ul>
                    </div>

                    <!-- Closing Message -->
                    <p style="color: rgba(255, 255, 255, 0.9); font-size: 15px; line-height: 1.7; margin: 0; text-align: center;">
                      We're building something truly special, and <strong style="color: #00F5FF;">you're now part of this journey</strong>. Get ready to buy properties from your couch with complete confidence! 🏡
                    </p>
                  </td>
                </tr>

                <!-- Social Media Footer -->
                <tr>
                  <td style="padding: 30px 40px; background: rgba(0, 0, 0, 0.3); text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    <p style="margin: 0 0 15px; color: rgba(255, 255, 255, 0.7); font-size: 14px; font-weight: 500;">
                      Follow us for exclusive updates
                    </p>
                    <div style="margin-bottom: 20px;">
                      <a href="https://www.instagram.com/agen.t1236" style="display: inline-block; margin: 0 8px; color: #00F5FF; text-decoration: none; font-size: 13px;">Instagram</a>
                      <span style="color: rgba(255, 255, 255, 0.3);">•</span>
                      <a href="https://www.facebook.com/share/1CLgC5cai7/" style="display: inline-block; margin: 0 8px; color: #00F5FF; text-decoration: none; font-size: 13px;">Facebook</a>
                      <span style="color: rgba(255, 255, 255, 0.3);">•</span>
                      <a href="https://x.com/Agent_tech1" style="display: inline-block; margin: 0 8px; color: #00F5FF; text-decoration: none; font-size: 13px;">Twitter</a>
                      <span style="color: rgba(255, 255, 255, 0.3);">•</span>
                      <a href="https://youtube.com/@agent-f1c9h" style="display: inline-block; margin: 0 8px; color: #00F5FF; text-decoration: none; font-size: 13px;">YouTube</a>
                    </div>
                    <p style="margin: 0 0 10px; color: rgba(255, 255, 255, 0.5); font-size: 12px;">
                      © 2025 AGENT. All rights reserved.<br>
                      The future of apartment hunting starts here.
                    </p>
                    <p style="margin: 0; color: rgba(255, 255, 255, 0.4); font-size: 11px;">
                      You're receiving this because you joined the Agent waitlist.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const emailPayload = {
      from: "Agent Team <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to Agent! 🚀",
      html: welcomeEmailHtml,
    };
    
    console.log(`[EMAIL] Sending welcome email request to Resend API for: ${email}...`);
    
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const data = await response.json();
    
    console.log(`[EMAIL] Resend API response status for ${email}: ${response.status}`);
    console.log(`[EMAIL] Resend API response data for ${email}:`, JSON.stringify(data));

    if (!response.ok) {
      console.log(`[EMAIL ERROR] Welcome email failed for ${email}:`, JSON.stringify(data));
      return { success: false, error: data };
    }

    console.log(`[EMAIL SUCCESS] Welcome email sent successfully to ${email}`);
    return { success: true, data };
  } catch (error) {
    console.log(`[EMAIL EXCEPTION] Welcome email exception for ${email}:`, error.message);
    console.log(`[EMAIL EXCEPTION] Stack trace:`, error.stack);
    return { success: false, error: error.message };
  }
}

// Confirmation email function using Resend (kept for backward compatibility)
async function sendConfirmationEmail(email: string, queuePosition: number, propertyType: string) {
  // This now calls the welcome email function
  return sendWelcomeEmail(email, queuePosition, propertyType);
}

// Enable CORS first - MUST be before other middleware
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Enable logger
app.use('*', logger(console.log));

// Health check endpoint (no prefix needed - Supabase adds it)
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Health check WITH prefix (for backward compatibility)
app.get("/make-server-5fa32778/health", (c) => {
  return c.json({ status: "ok" });
});

// Diagnostic endpoint - check email configuration (no prefix)
app.get("/diagnostic", (c) => {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      RESEND_API_KEY: resendApiKey ? `✅ Set (${resendApiKey.substring(0, 8)}...)` : "❌ NOT SET",
      SUPABASE_URL: supabaseUrl ? "✅ Set" : "❌ NOT SET",
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey ? "✅ Set" : "❌ NOT SET",
    },
    status: {
      emailServiceConfigured: !!resendApiKey,
      readyToSendEmails: !!resendApiKey,
    },
    message: resendApiKey 
      ? "✅ Email service is configured and ready - All emails will be sent automatically" 
      : "❌ RESEND_API_KEY is not set. Add it to Supabase environment variables.",
    emailSettings: {
      adminEmail: "wheeljack2019@gmail.com",
      fromEmail: "onboarding@resend.dev",
      welcomeEmailEnabled: !!resendApiKey,
      adminNotificationEnabled: !!resendApiKey,
    }
  };
  
  console.log("[DIAGNOSTIC] ✅ Email system check complete:", {
    configured: !!resendApiKey,
    timestamp: diagnostics.timestamp
  });
  
  return c.json(diagnostics);
});

// Diagnostic endpoint WITH prefix (for backward compatibility)
app.get("/make-server-5fa32778/diagnostic", (c) => {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      RESEND_API_KEY: resendApiKey ? `✅ Set (${resendApiKey.substring(0, 8)}...)` : "❌ NOT SET",
      SUPABASE_URL: supabaseUrl ? "✅ Set" : "❌ NOT SET",
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey ? "✅ Set" : "❌ NOT SET",
    },
    status: {
      emailServiceConfigured: !!resendApiKey,
      readyToSendEmails: !!resendApiKey,
    },
    message: resendApiKey 
      ? "✅ Email service is configured and ready - All emails will be sent automatically" 
      : "❌ RESEND_API_KEY is not set. Add it to Supabase environment variables.",
    emailSettings: {
      adminEmail: "wheeljack2019@gmail.com",
      fromEmail: "onboarding@resend.dev",
      welcomeEmailEnabled: !!resendApiKey,
      adminNotificationEnabled: !!resendApiKey,
    }
  };
  
  console.log("[DIAGNOSTIC] ✅ Email system check complete:", {
    configured: !!resendApiKey,
    timestamp: diagnostics.timestamp
  });
  
  return c.json(diagnostics);
});

// Email verification handler - verify Resend API connection
const verifyEmailHandler = async (c: any) => {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  
  if (!resendApiKey) {
    return c.json({
      success: false,
      error: "RESEND_API_KEY not configured",
      message: "Email service cannot be verified without API key",
      timestamp: new Date().toISOString()
    }, 400);
  }

  try {
    // Verify API key by making a test request to Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Agent Team <onboarding@resend.dev>",
        to: "test@resend.dev", // Resend's test email
        subject: "AGENT Email System Verification",
        html: "<p>This is a verification test from AGENT platform.</p>",
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("[EMAIL VERIFY] ✅ Resend API connection successful");
      return c.json({
        success: true,
        message: "✅ Email service is working correctly",
        verified: true,
        apiStatus: "connected",
        resendResponse: data,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log("[EMAIL VERIFY] ❌ Resend API error:", data);
      return c.json({
        success: false,
        error: data,
        message: "Email service configured but API returned an error",
        apiStatus: "error",
        timestamp: new Date().toISOString()
      }, response.status);
    }
  } catch (error) {
    console.log("[EMAIL VERIFY] ❌ Exception:", error.message);
    return c.json({
      success: false,
      error: error.message,
      message: "Failed to verify email service connection",
      apiStatus: "failed",
      timestamp: new Date().toISOString()
    }, 500);
  }
};

// Register verify-email endpoint (both with and without prefix)
app.get("/verify-email", verifyEmailHandler);
app.get("/make-server-5fa32778/verify-email", verifyEmailHandler);

// Email test endpoint - for debugging email functionality (no prefix)
app.post("/test-email", async (c) => {
  try {
    const body = await c.req.json();
    const { email, type } = body;

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    console.log(`[TEST-EMAIL] Testing ${type || 'welcome'} email to: ${email}`);

    let result;
    if (type === "admin") {
      result = await sendAdminNotification(email, 999, "Test Property Type");
    } else {
      result = await sendWelcomeEmail(email, 999, "Test Property Type");
    }

    console.log(`[TEST-EMAIL] Result:`, JSON.stringify(result));

    return c.json({
      success: result.success,
      message: result.success 
        ? `Test ${type || 'welcome'} email sent successfully to ${email}` 
        : `Failed to send test email`,
      details: result,
    });
  } catch (error) {
    console.log(`[TEST-EMAIL] Exception:`, error.message);
    return c.json(
      { 
        error: "Failed to send test email",
        details: error.message 
      },
      500
    );
  }
});

// Email test endpoint WITH prefix (for backward compatibility)
app.post("/make-server-5fa32778/test-email", async (c) => {
  try {
    const body = await c.req.json();
    const { email, type } = body;

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    console.log(`[TEST-EMAIL] Testing ${type || 'welcome'} email to: ${email}`);

    let result;
    if (type === "admin") {
      result = await sendAdminNotification(email, 999, "Test Property Type");
    } else {
      result = await sendWelcomeEmail(email, 999, "Test Property Type");
    }

    console.log(`[TEST-EMAIL] Result:`, JSON.stringify(result));

    return c.json({
      success: result.success,
      message: result.success 
        ? `Test ${type || 'welcome'} email sent successfully to ${email}` 
        : `Failed to send test email`,
      details: result,
    });
  } catch (error) {
    console.log(`[TEST-EMAIL] Exception:`, error.message);
    return c.json(
      { 
        error: "Failed to send test email",
        details: error.message 
      },
      500
    );
  }
});

// Waitlist signup handler
const waitlistSignupHandler = async (c: any) => {
  try {
    const body = await c.req.json();
    const { email, propertyType } = body;

    // Validate input
    if (!email || !propertyType) {
      console.log("Waitlist signup error: Missing email or propertyType");
      return c.json(
        { error: "Email and property type are required" },
        400
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log(`Waitlist signup error: Invalid email format - ${email}`);
      return c.json(
        { error: "Invalid email format" },
        400
      );
    }

    const waitlistKey = `waitlist:${email.toLowerCase()}`;

    // Check if email already exists
    const existing = await kv.get(waitlistKey);
    if (existing) {
      console.log(`Waitlist signup: Email already exists - ${email}`);
      return c.json(
        { error: "Email already registered", alreadyExists: true },
        409
      );
    }

    // Get current waitlist count to assign queue position
    const countKey = "waitlist:count";
    const currentCount = (await kv.get(countKey)) || 0;
    const queuePosition = currentCount + 1;

    // Store waitlist entry
    const waitlistEntry = {
      email: email.toLowerCase(),
      propertyType,
      timestamp: new Date().toISOString(),
      queuePosition,
    };

    await kv.set(waitlistKey, waitlistEntry);
    await kv.set(countKey, queuePosition);

    console.log(`[WAITLIST] Signup successful: ${email} - Position #${queuePosition}`);

    // Send confirmation email (non-blocking)
    console.log(`[WAITLIST] Initiating welcome email send for ${email}...`);
    sendConfirmationEmail(email.toLowerCase(), queuePosition, propertyType)
      .then((result) => {
        if (result.success) {
          console.log(`[WAITLIST] ✅ Welcome email sent successfully to ${email}`);
        } else {
          console.log(`[WAITLIST] ❌ Failed to send welcome email to ${email}:`, JSON.stringify(result.error));
        }
      })
      .catch((error) => {
        console.log(`[WAITLIST] ❌ Welcome email exception for ${email}:`, error.message);
        console.log(`[WAITLIST] Exception details:`, error);
      });

    // Send notification to admin email (non-blocking)
    console.log(`[WAITLIST] Initiating admin notification for ${email}...`);
    sendAdminNotification(email.toLowerCase(), queuePosition, propertyType)
      .then((result) => {
        if (result.success) {
          console.log(`[WAITLIST] ✅ Admin notification sent for signup: ${email}`);
        } else {
          console.log(`[WAITLIST] ❌ Failed to send admin notification for ${email}:`, JSON.stringify(result.error));
        }
      })
      .catch((error) => {
        console.log(`[WAITLIST] ❌ Admin notification exception for ${email}:`, error.message);
        console.log(`[WAITLIST] Exception details:`, error);
      });

    return c.json({
      success: true,
      message: "Successfully joined waitlist",
      queuePosition,
    });
  } catch (error) {
    console.log(`Waitlist signup error: ${error.message}`, error);
    return c.json(
      { error: "Failed to process signup. Please try again." },
      500
    );
  }
};

// Register waitlist signup endpoint (both with and without prefix)
app.post("/waitlist", waitlistSignupHandler);
app.post("/make-server-5fa32778/waitlist", waitlistSignupHandler);

// Get waitlist count handler
const waitlistCountHandler = async (c: any) => {
  try {
    const countKey = "waitlist:count";
    const count = (await kv.get(countKey)) || 0;
    
    return c.json({
      count,
      spotsLeft: Math.max(0, 200 - count),
    });
  } catch (error) {
    console.log(`Waitlist count error: ${error.message}`, error);
    return c.json(
      { error: "Failed to fetch count" },
      500
    );
  }
};

//Register waitlist count endpoint (both with and without prefix)
app.get("/waitlist/count", waitlistCountHandler);
app.get("/make-server-5fa32778/waitlist/count", waitlistCountHandler);

// Get all waitlist entries handler (admin endpoint)
const waitlistAllHandler = async (c: any) => {
  try {
    const entries = await kv.getByPrefix("waitlist:");
    
    // Filter out the count entry and sort by queue position
    const waitlistEntries = entries
      .filter((entry) => entry.key !== "waitlist:count")
      .map((entry) => entry.value)
      .sort((a, b) => a.queuePosition - b.queuePosition);
    
    return c.json({
      total: waitlistEntries.length,
      entries: waitlistEntries,
    });
  } catch (error) {
    console.log(`Waitlist fetch all error: ${error.message}`, error);
    return c.json(
      { error: "Failed to fetch waitlist entries" },
      500
    );
  }
};

// Register waitlist all endpoint (both with and without prefix)
app.get("/waitlist/all", waitlistAllHandler);
app.get("/make-server-5fa32778/waitlist/all", waitlistAllHandler);

// Bulk resend welcome emails handler
const bulkResendHandler = async (c: any) => {
  try {
    console.log('[BULK-EMAIL] Starting bulk welcome email resend...');
    
    // Get all waitlist entries
    const entries = await kv.getByPrefix("waitlist:");
    
    // Filter out the count entry
    const waitlistEntries = entries
      .filter((entry) => entry.key !== "waitlist:count")
      .map((entry) => entry.value);
    
    console.log(`[BULK-EMAIL] Found ${waitlistEntries.length} waitlist entries`);
    
    if (waitlistEntries.length === 0) {
      return c.json({
        success: true,
        message: "No waitlist entries found",
        sent: 0,
        failed: 0,
      });
    }
    
    // Send emails with a small delay between each to avoid rate limiting
    const results = {
      sent: 0,
      failed: 0,
      errors: [],
    };
    
    for (const entry of waitlistEntries) {
      try {
        console.log(`[BULK-EMAIL] Sending to ${entry.email} (position #${entry.queuePosition})...`);
        
        const result = await sendWelcomeEmail(
          entry.email,
          entry.queuePosition,
          entry.propertyType || 'General Interest'
        );
        
        if (result.success) {
          results.sent++;
          console.log(`[BULK-EMAIL] ✅ Sent to ${entry.email}`);
        } else {
          results.failed++;
          results.errors.push({
            email: entry.email,
            error: result.error,
          });
          console.log(`[BULK-EMAIL] ❌ Failed to send to ${entry.email}:`, result.error);
        }
        
        // Small delay to avoid rate limiting (100ms between emails)
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        results.failed++;
        results.errors.push({
          email: entry.email,
          error: error.message,
        });
        console.log(`[BULK-EMAIL] ❌ Exception for ${entry.email}:`, error.message);
      }
    }
    
    console.log(`[BULK-EMAIL] Complete! Sent: ${results.sent}, Failed: ${results.failed}`);
    
    return c.json({
      success: true,
      message: `Welcome emails sent to ${results.sent} users`,
      total: waitlistEntries.length,
      sent: results.sent,
      failed: results.failed,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
    
  } catch (error) {
    console.log(`[BULK-EMAIL] Exception:`, error.message);
    return c.json(
      { 
        success: false,
        error: "Failed to send bulk emails",
        details: error.message 
      },
      500
    );
  }
};

// Register bulk resend endpoint (both with and without prefix)
app.post("/waitlist/resend-welcome", bulkResendHandler);
app.post("/make-server-5fa32778/waitlist/resend-welcome", bulkResendHandler);

// ==================== ADMIN ROUTES ====================

// Admin: Send custom message to a user
const sendCustomMessageHandler = async (c: any) => {
  try {
    const body = await c.req.json();
    const { email, subject, message } = body;

    if (!email || !subject || !message) {
      return c.json(
        { error: "Email, subject, and message are required" },
        400
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      return c.json(
        { error: "Email service not configured" },
        500
      );
    }

    console.log(`[ADMIN-MESSAGE] Sending custom message to: ${email}`);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0F1A2F;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0F1A2F; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a237e 0%, #0F1A2F 100%); border-radius: 20px; overflow: hidden; border: 2px solid rgba(0, 245, 255, 0.3);">
                  <tr>
                    <td style="padding: 40px; text-align: center; background: linear-gradient(180deg, rgba(0, 245, 255, 0.15) 0%, rgba(0, 245, 255, 0.05) 100%);">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${subject}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px;">
                      <div style="color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.8; white-space: pre-wrap;">
                        ${message.replace(/\n/g, '<br>')}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px 40px; background: rgba(0, 0, 0, 0.3); text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                      <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 12px;">
                        © 2025 AGENT. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "AGENT Team <onboarding@resend.dev>",
        to: email,
        subject: subject,
        html: emailHtml,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log(`[ADMIN-MESSAGE] Failed to send to ${email}:`, data);
      return c.json({ error: "Failed to send message", details: data }, response.status);
    }

    console.log(`[ADMIN-MESSAGE] Successfully sent to ${email}`);
    return c.json({ success: true, message: "Message sent successfully" });

  } catch (error) {
    console.log(`[ADMIN-MESSAGE] Exception:`, error.message);
    return c.json(
      { error: "Failed to send message", details: error.message },
      500
    );
  }
};

app.post("/admin/send-message", sendCustomMessageHandler);
app.post("/make-server-5fa32778/admin/send-message", sendCustomMessageHandler);

// Admin: Update user information
const updateUserHandler = async (c: any) => {
  try {
    const body = await c.req.json();
    const { originalEmail, newEmail, propertyType } = body;

    if (!originalEmail || !newEmail) {
      return c.json(
        { error: "Original email and new email are required" },
        400
      );
    }

    const originalKey = `waitlist:${originalEmail.toLowerCase()}`;
    const newKey = `waitlist:${newEmail.toLowerCase()}`;

    // Get existing entry
    const existing = await kv.get(originalKey);
    if (!existing) {
      return c.json(
        { error: "User not found" },
        404
      );
    }

    // If email is changing, check if new email already exists
    if (originalEmail.toLowerCase() !== newEmail.toLowerCase()) {
      const emailExists = await kv.get(newKey);
      if (emailExists) {
        return c.json(
          { error: "New email already exists in waitlist" },
          409
        );
      }
    }

    // Update the entry
    const updatedEntry = {
      ...existing,
      email: newEmail.toLowerCase(),
      propertyType: propertyType || existing.propertyType,
    };

    // If email changed, delete old key and create new one
    if (originalEmail.toLowerCase() !== newEmail.toLowerCase()) {
      await kv.del(originalKey);
      await kv.set(newKey, updatedEntry);
    } else {
      await kv.set(originalKey, updatedEntry);
    }

    console.log(`[ADMIN-UPDATE] Updated user: ${originalEmail} -> ${newEmail}`);
    return c.json({ 
      success: true, 
      message: "User updated successfully",
      user: updatedEntry 
    });

  } catch (error) {
    console.log(`[ADMIN-UPDATE] Exception:`, error.message);
    return c.json(
      { error: "Failed to update user", details: error.message },
      500
    );
  }
};

app.put("/admin/update-user", updateUserHandler);
app.put("/make-server-5fa32778/admin/update-user", updateUserHandler);

// Admin: Delete user
const deleteUserHandler = async (c: any) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json(
        { error: "Email is required" },
        400
      );
    }

    const waitlistKey = `waitlist:${email.toLowerCase()}`;

    // Check if user exists
    const existing = await kv.get(waitlistKey);
    if (!existing) {
      return c.json(
        { error: "User not found" },
        404
      );
    }

    // Delete the user
    await kv.del(waitlistKey);

    // Update the count
    const countKey = "waitlist:count";
    const currentCount = (await kv.get(countKey)) || 0;
    await kv.set(countKey, Math.max(0, currentCount - 1));

    console.log(`[ADMIN-DELETE] Deleted user: ${email}`);
    return c.json({ 
      success: true, 
      message: "User deleted successfully" 
    });

  } catch (error) {
    console.log(`[ADMIN-DELETE] Exception:`, error.message);
    return c.json(
      { error: "Failed to delete user", details: error.message },
      500
    );
  }
};

app.delete("/admin/delete-user", deleteUserHandler);
app.delete("/make-server-5fa32778/admin/delete-user", deleteUserHandler);

// Admin: Get comprehensive database statistics
const getStatsHandler = async (c: any) => {
  try {
    console.log('[ADMIN-STATS] Fetching database statistics...');
    
    // Get all waitlist entries
    const entries = await kv.getByPrefix("waitlist:");
    
    // Filter out the count entry
    const waitlistEntries = entries
      .filter((entry) => entry.key !== "waitlist:count")
      .map((entry) => entry.value);
    
    // Get the stored count
    const storedCount = (await kv.get("waitlist:count")) || 0;
    
    // Calculate actual count from entries
    const actualCount = waitlistEntries.length;
    
    // Calculate time-based statistics
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const last24h = waitlistEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate > oneDayAgo;
    }).length;
    
    const last7days = waitlistEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate > sevenDaysAgo;
    }).length;
    
    const last30days = waitlistEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate > thirtyDaysAgo;
    }).length;
    
    // Property type breakdown
    const propertyTypeStats: Record<string, number> = {};
    waitlistEntries.forEach(entry => {
      const type = entry.propertyType || 'Unknown';
      propertyTypeStats[type] = (propertyTypeStats[type] || 0) + 1;
    });
    
    // Get first and last signup dates
    const sortedByDate = [...waitlistEntries].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const firstSignup = sortedByDate[0]?.timestamp || null;
    const lastSignup = sortedByDate[sortedByDate.length - 1]?.timestamp || null;
    
    // Calculate daily average
    let dailyAverage = 0;
    if (firstSignup && actualCount > 0) {
      const daysSinceFirst = Math.max(1, Math.floor((now.getTime() - new Date(firstSignup).getTime()) / (24 * 60 * 60 * 1000)));
      dailyAverage = parseFloat((actualCount / daysSinceFirst).toFixed(2));
    }
    
    const stats = {
      database: {
        totalUsers: actualCount,
        storedCount: storedCount,
        isInSync: actualCount === storedCount,
        lastUpdated: now.toISOString(),
      },
      growth: {
        last24h,
        last7days,
        last30days,
        dailyAverage,
      },
      timeline: {
        firstSignup,
        lastSignup,
        totalDays: firstSignup ? Math.floor((now.getTime() - new Date(firstSignup).getTime()) / (24 * 60 * 60 * 1000)) : 0,
      },
      capacity: {
        total: 200,
        used: actualCount,
        remaining: Math.max(0, 200 - actualCount),
        percentageFull: parseFloat(((actualCount / 200) * 100).toFixed(2)),
      },
      propertyTypes: propertyTypeStats,
      metadata: {
        serverTime: now.toISOString(),
        timezone: 'UTC',
      },
    };
    
    console.log(`[ADMIN-STATS] Statistics compiled: ${actualCount} total users`);
    
    return c.json({
      success: true,
      stats,
    });
    
  } catch (error) {
    console.log(`[ADMIN-STATS] Exception:`, error.message);
    return c.json(
      { 
        success: false,
        error: "Failed to fetch statistics", 
        details: error.message 
      },
      500
    );
  }
};

app.get("/admin/stats", getStatsHandler);
app.get("/make-server-5fa32778/admin/stats", getStatsHandler);

Deno.serve(app.fetch);