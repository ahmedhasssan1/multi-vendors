import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Sendemaildto } from './dto/email.dto';
import { stringify } from 'querystring';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  private emailTransport() {
    return nodemailer.createTransport({
      host: this.configService.get<string>('EmailHost'),
      port: this.configService.get<number>('emailPort'),
      secure: false,
      auth: {
        user: this.configService.get<string>('emailUser'),
        pass: this.configService.get<string>('emailPassword'),
      },
    });
  }

  async sendEmail(emailDto: Sendemaildto) {
    const { recipient, orderId } = emailDto;
    const transporter = this.emailTransport();

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('emailUser'),
      to: recipient,
      subject: 'Your order confirmation',
      html: `<h1>Thank you for your order!</h1><p>Your order ID is <strong>${orderId}</strong>.</p>`,
      text: `Thank you for your order! Your order ID is ${orderId}.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return 'Email sent successfully';
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
   
  }
   async sendVendorEmail(email:string) {
    
    const transporter = this.emailTransport();

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('emailUser'),
      to: email,
      subject: 'Your order confirmation',
      html: `thanks`,
      text: `have a good day .`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return 'Email sent successfully';
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
   
  }
}
