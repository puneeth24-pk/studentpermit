import nodemailer from 'nodemailer';

// Microsoft Outlook / Office365 SMTP for MITS college emails
export const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,  // e.g. 24691A31J0@mits.ac.in
    pass: process.env.EMAIL_PASS,  // your Outlook password or App Password
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
});

export const sendOTP = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"Student Permit – MITS" <${process.env.EMAIL_USER}>`,
    to,
    subject: '🔑 Student Permit – Password Reset OTP',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background-color:#f0f4ff;font-family:Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8,#3b82f6);padding:32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">🎓 Student Permit</h1>
              <p style="margin:6px 0 0;color:#bfdbfe;font-size:13px;">Madanapalle Institute of Technology and Sciences</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 24px;">
              <p style="margin:0 0 12px;font-size:16px;color:#1e293b;">Hello,</p>
              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.6;">
                We received a request to reset your <strong>Student Permit</strong> account password. Use the OTP below to proceed.
              </p>
              <!-- OTP Box -->
              <div style="background:#f0f9ff;border:2px solid #bfdbfe;border-radius:10px;padding:24px;text-align:center;margin:0 0 24px;">
                <p style="margin:0 0 6px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Your One-Time Password</p>
                <p style="margin:0;font-size:40px;font-weight:800;letter-spacing:10px;color:#1d4ed8;">${otp}</p>
              </div>
              <p style="margin:0 0 8px;font-size:13px;color:#94a3b8;">
                ⏱ This OTP expires in <strong>10 minutes</strong>.
              </p>
              <p style="margin:0;font-size:13px;color:#94a3b8;">
                🔒 If you did not request this, please ignore this email. Your account is safe.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">Developed by <strong style="color:#64748b;">CSE AI Dept – MITS</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
