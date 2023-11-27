import { __setMail } from "../helpers/string"
import transporter from "../mail/transport"

export async function __sendMail(email: string, subject: string, message: string) {
    const mailOptions = {
        subject,
        to: __setMail(email),
        text: message
    }
    try {
        if (!email || !subject || !message) {
            throw new Error("Provide all required fields, email, subject, message")
        }
        await transporter.sendMail(mailOptions)
    } catch (error: any) {
        throw new Error(error)
    }
    
}