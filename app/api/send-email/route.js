import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Use app password for Gmail
  },
});

export async function POST(request) {
  try {
    const { categoryName, spent, budget } = await request.json();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "raiarvind661@gmail.com", // Send to yourself, or you can make this configurable
      subject: `🚨 Budget Alert: ${categoryName} Budget Exceeded!`,
      html: `
        <h2>Budget Alert</h2>
        <p>Your budget for <strong>${categoryName}</strong> has been exceeded!</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
          <p><strong>Budget:</strong> $${budget.toFixed(2)}</p>
          <p><strong>Spent:</strong> $${spent.toFixed(2)}</p>
          <p><strong>Over by:</strong> $${(spent - budget).toFixed(2)}</p>
        </div>
        <p>Please review your expenses and adjust your budget if necessary.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email' },
      { status: 500 }
    );
  }
} 