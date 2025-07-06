import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Default audience ID - you can override this with env variable
const DEFAULT_AUDIENCE_ID =
  process.env.RESEND_AUDIENCE_ID || "785b0781-70ab-44ca-a71d-cdd8b6ba560e";

interface SubscribeRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  audienceId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json();

    // Validate required fields
    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Prepare contact data
    const contactData = {
      email: body.email,
      firstName: body.firstName || "",
      lastName: body.lastName || "",
      unsubscribed: false,
      audienceId: body.audienceId || DEFAULT_AUDIENCE_ID,
    };

    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Newsletter service is not configured" },
        { status: 500 }
      );
    }

    // Create contact in Resend audience
    const contact = await resend.contacts.create(contactData);

    // Send simple thank you email to subscriber
    try {
      await resend.emails.send({
        from: "Abhay Ramesh <newsletter@mail.abhayramesh.com>",
        to: body.email,
        subject: "Welcome to my newsletter! 🎉",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0A0A0A; color: #ffffff;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 28px; font-weight: 700; margin: 0; color: #ffffff;">Thanks for joining! 🙏</h1>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 24px; margin-bottom: 24px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.9);">
                Hey${body.firstName ? ` ${body.firstName}` : ""}! 👋
              </p>
              
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.9);">
                You're now part of my newsletter where I share:
              </p>
              
              <ul style="margin: 0 0 16px 0; padding-left: 20px; color: rgba(255,255,255,0.8);">
                <li style="margin-bottom: 8px;">Development tips and insights</li>
                <li style="margin-bottom: 8px;">Behind-the-scenes from my projects</li>
                <li style="margin-bottom: 8px;">New blog posts and tutorials</li>
              </ul>
              
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: rgba(255,255,255,0.9);">
                Expect quality content, no spam. Promise! ✨
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 32px;">
              <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.6);">
                Best,<br>
                <strong style="color: rgba(255,255,255,0.8);">Abhay Ramesh</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.5);">
                Not interested anymore? <a href="{{unsubscribe_url}}" style="color: rgba(255,255,255,0.7); text-decoration: none;">Unsubscribe here</a>
              </p>
            </div>
          </div>
        `,
        text: `
Thanks for joining my newsletter! 🙏

Hey${body.firstName ? ` ${body.firstName}` : ""}! 👋

You're now part of my newsletter where I share:
- Development tips and insights  
- Behind-the-scenes from my projects
- New blog posts and tutorials

Expect quality content, no spam. Promise! ✨

Best,
Abhay Ramesh

---
Not interested anymore? Unsubscribe here: {{unsubscribe_url}}
        `,
      });
    } catch (emailError) {
      // Log email error but don't fail the subscription
      console.error("Failed to send welcome email:", emailError);
    }

    // Log success for debugging
    console.log("Newsletter subscription successful:", {
      email: body.email,
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
    });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);

    // Handle specific Resend API errors
    if (error?.message?.includes("already exists")) {
      return NextResponse.json(
        { error: "This email is already subscribed to our newsletter" },
        { status: 409 }
      );
    }

    if (error?.message?.includes("invalid_api_key")) {
      return NextResponse.json(
        { error: "Newsletter service configuration error" },
        { status: 500 }
      );
    }

    if (error?.message?.includes("rate_limit_exceeded")) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Failed to subscribe to newsletter. Please try again.",
      },
      { status: 500 }
    );
  }
}
