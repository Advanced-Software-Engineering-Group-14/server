"use strict";

import lodash from "lodash"

export default {
    ManagerCreated: {
        subject: lodash.template("Manager Account Created"),
        message: lodash.template("Dear ${user.name},\n\nYour user account has been created with\nemail: ${user.email} \npassword: ${password}\n\nLog onto https://.com to explore")
    },
    ManagerVerificationCode: {
        subject: lodash.template("Staff Account Verification"),
        message: lodash.template("Dear ${user.name},\n\nYour verification code is ${code}")
    }
}