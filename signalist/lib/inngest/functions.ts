import { inngest } from "@/lib/inngest/client";

import { buildWelcomeEmail } from "@/lib/email/templates";
import { mailTransporter } from "@/lib/email/transporter";
import { env } from "@/lib/env";
import { z } from "zod";

const userRegisteredDataSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const sendWelcomeEmail = inngest.createFunction(
  {
    id: "send-welcome-email",
    triggers: [{ event: "user/registered" }],
  },
  async ({ event }) => {
    const data = userRegisteredDataSchema.parse(event.data);
    const payload = buildWelcomeEmail(data.name);

    await mailTransporter.sendMail({
      from: env.SMTP_FROM,
      to: data.email,
      subject: payload.subject,
      html: payload.html,
    });

    return { sent: true };
  }
);

export const resetPredictionQuota = inngest.createFunction(
  {
    id: "reset-prediction-quota",
    triggers: [{ cron: "TZ=UTC 0 0 * * *" }],
  },
  async () => {
    return { resetAt: new Date().toISOString() };
  }
);
