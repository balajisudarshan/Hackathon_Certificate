const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendCertificateEmail = async (to, certId, organization) => {
  const mailOptions = {
    from: `Certificate App<${process.env.EMAIL_USER}>`,
    to: to,
    subject: `Your Certificate is Issued `,
    html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #e0e6ed; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
    
    <div style="background-color: #0056b3; height: 10px;"></div>

    <div style="padding: 40px; text-align: center;">
        <h1 style="color: #003366; margin-bottom: 20px;">Congratulations!</h1>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            Your certificate has been issued successfully.
        </p>

        <div style="background-color: #f0f7ff; border-radius: 6px; padding: 15px; margin: 25px 0; border: 1px dashed #0056b3;">
            <p style="margin: 0; color: #0056b3; font-weight: bold; font-size: 14px;">
                Certificate ID: <span style="color: #333;">${certId}</span>
            </p>
        </div>

        <p style="color: #4a5568; font-size: 14px; margin-bottom: 30px;">
            You can download your certificate from the attachment below or by clicking the button.
        </p>

        <a href="${process.env.BASE_URL}/view/${certId}" 
           style="display: inline-block; background-color: #0056b3; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; transition: background-color 0.3s ease;">
            View / Download Certificate
        </a>
    </div>

    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e0e6ed;">
        <p style="margin: 0; font-size: 12px; color: #94a3b8;">
            © ${new Date().getFullYear()} ${organization}. All rights reserved.
        </p>
    </div>
</div>
        `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendCertificateEmail;
