import nodemailer from 'nodemailer';
import config from '../config';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: config.mail.email,
        pass: config.mail.password,
    },
}, {
    from: `${config.mail.name} <${config.mail.sender}>`,
});

export default transporter;