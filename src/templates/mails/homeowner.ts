"use strict";

import lodash from "lodash"

export default {
    HomeownerCreated: {
        subject: lodash.template("Homeowner Account Created"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},\n\nYour homeowner account has been created with\nEmail: ${user.email} \nPassword: ${password}\nRole: HOMEOWNER\n\nLog onto https://.com to explore")
    },
    HomeownerVerificationCode: {
        subject: lodash.template("Homeowner Account Verification"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},\n\nYour verification code is ${code}")
    },
    HomeownerLoggedIn: {
        subject: lodash.template("Account Login"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},\n\nWe just detected a recent login into your account. If this was you, you can safely ignore this email, otherwise you should change your password immediately.")
    },
    HomeownerAccountSuspended: {
        subject: lodash.template("Account Suspension"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},\n\nYour account has been suspended. Kindly contact your managers to follow up. Until your account is unsuspended, you will not be able to use your account.")
    },
    HomeownerAccountUnSuspended: {
        subject: lodash.template("Account Unsuspended"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},\n\nYour account has been unsuspended. You can now log into your account.")
    },
    HomeownerApproved: {
        subject: lodash.template("Account Approved"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},\n\nYour account has been approved. All features in the application are now available to you.")
    },
    HomeownerRejected: {
        subject: lodash.template("Account Rejected"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},\n\nYour account has been unfortunately rejected. Reasons for this could be that the Wastify Team suspects that you may be a fraudulent account or spam account. \n\nIf this is a mistake, reach out to the managers.")
    },
    PaymentReceipt: {
        subject: lodash.template("Payment Receipt from Wastify"),
        message: lodash.template("Dear ${user.othernames} ${user.surname},\n\nFind below the details of your most recent payment. \n\nPayment Method: ${payment.paymentMethod}\nPayment Type: ${payment.paymentType}  \nReference Type: ${payment.refNumber}  \nPayment Status: ${payment.response} \nTotal Amount: ${payment.totalAmount}")
    }

}