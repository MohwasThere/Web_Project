export const buildWelcomeEmail = (name: string) => ({
  subject: "Welcome to Signalist",
  html: `<h2>Welcome to Signalist, ${name}!</h2><p>Your account is ready. Start exploring market insights and AI predictions.</p>`,
});

export const buildPasswordResetEmail = (resetUrl: string) => ({
  subject: "Reset your Signalist password",
  html: `<h2>Password reset request</h2><p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
});
