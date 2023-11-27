"use strict";

import lodash from "lodash"

export default {
    ManagerCreated: {
        subject: lodash.template("Manager Account Created"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},\n\nYour manager account has been created with\nEmail: ${user.email} \nPassword: ${password}\nRole: ${user.role}\n\nLog onto https://.com to explore")
    },
    ManagerVerificationCode: {
        subject: lodash.template("Staff Account Verification"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},,\n\nYour verification code is ${code}")
    }
}