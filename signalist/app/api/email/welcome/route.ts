import { NextResponse } from "next/server";
import { z } from "zod";

import { buildWelcomeEmail } from "@/lib/email/templates";
import { mailTransporter } from "@/lib/email/transporter";
import { env } from "@/lib/env";

const bodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = bodySchema.parse(await request.json());
    const payload = buildWelcomeEmail(body.name);

    await mailTransporter.sendMail({
      from: `Signalist <${env.SMTP_USER}>`,
      to: body.email,
      subject: payload.subject,
      html: payload.html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send welcome email" },
      { status: 400 }
    );
  }
}
