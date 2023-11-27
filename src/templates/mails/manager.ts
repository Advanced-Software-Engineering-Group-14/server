"use strict";

import lodash from "lodash"

export default {
    ManagerCreated: {
        subject: lodash.template("Manager Account Created"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},\n\nYour manager account has been created with\nEmail: ${user.email} \nPassword: ${password}\nRole: ${user.role}\n\nLog onto https://.com to explore")
    },
    ManagerVerificationCode: {
        subject: lodash.template("Manager Account Verification"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},,\n\nYour verification code is ${code}")
    },
    ManagerLoggedIn: {
        subject: lodash.template("Account Login"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},\n\nWe just detected a recent login into your account. If this was you, you can safely ignore this email, otherwise you should change your password immediately.")
    },
    ManagerAccountSuspended: {
        subject: lodash.template("Account Suspension"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},\n\nYour account has been suspended. Kindly contact your managers to follow up. Until your account is unsuspended, you will not be able to use your account.")
    }
}