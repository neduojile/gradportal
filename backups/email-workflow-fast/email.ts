import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.error("Email configuration is missing.");
    return false;
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      subject,
      text,
    });

    if (result.error) {
      console.error("Email request failed:", result.error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
}
