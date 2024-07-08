import { IEmailParams } from "../interfaces";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

class EmailService {
  private readonly transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.SMTP_HOST_ADDRESS,
        port: parseInt(process.env.SMTP_PORT || "465"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    );
  }

  async sendEmail({ to, subject, template, context }: IEmailParams) {
    const emailHtml = fs.readFileSync(
      path.resolve(__dirname, `../../../templates/${template}.hbs`),
      "utf8"
    );

    const compiledTemplate = handlebars.compile(emailHtml);
    const htmlToSend = compiledTemplate(context);

    const mailOptions = {
      from: "your-email@example.com",
      to,
      subject,
      html: htmlToSend,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
export default EmailService;
