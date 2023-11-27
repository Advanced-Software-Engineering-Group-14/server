"use strict";

import { __sendMail } from "./../../utils/mail"
import { mails as __templates } from "./../../templates"

type SendEmailArgs = {
    args: {
        email: string
        template: string
        data: any
    }
}

export async function sendMail({ args: { email, template, data } }: SendEmailArgs) {
    try {
        __templates[""]
        const subject = __templates[template].subject(data);
        const message = __templates[template].message(data);
        await __sendMail(email, subject, message).then(console.log).catch(console.error);

        return { delivered: 1, status: "ok" };
    }
    catch (err) {
        throw err
    }
}