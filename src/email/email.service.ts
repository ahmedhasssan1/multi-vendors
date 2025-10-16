import { Injectable, Options } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import {ConfigService} from '@nestjs/config'
import { Sendemaildto } from './dto/email.dto';

@Injectable()
export class EmailService {
    constructor(private readonly ConfigService:ConfigService){}


   emailTransport(){
         const transporter=nodemailer.createTransport({
             host: this.ConfigService.get<string>('EmailHost'),
             port: this.ConfigService.get<number>('emailPort'),
             secure: false,
             auth:{ 
                user: this.ConfigService.get<string>('emailUser'),
                pass:this.ConfigService.get<string>('emailPassword') ,
             }

            })
            return transporter;
   }
   async SendEmail(EmailDto:Sendemaildto){
    const {recipienst,subject,html,text}=EmailDto
    const transport=this.emailTransport();
    const Options:nodemailer.SendMailOptions={
        from:this.ConfigService.get<string>('emailUser'),
        to:recipienst   ,
        subject:subject,
        html:html,
        text:text
        
    }
    try{
        await transport.sendMail(Options)
        return 'Email sent successfully';
    }catch(error){
        console.log('errot sending email',error)

    }
   }


}