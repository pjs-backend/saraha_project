import nodemailer from 'nodemailer';
import { EventEmitter } from 'node:events';

export const emitter = new EventEmitter();

export const sendEmail = async ({
    to,
    cc = process.env.USER_EMAIL,
    subject,
    content,
    attachments = []
}) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from: process.env.USER_EMAIL,
        to,
        cc,
        subject,
        html: content,
        attachments
    });

    console.log('info', info);
    return info;
};

emitter.on('sendEmail', (data) => {
    console.log('The sending Email event is started');
    console.log(data);
    sendEmail(data);
});
