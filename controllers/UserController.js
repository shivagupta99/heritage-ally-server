var passwordValidator = require('password-validator');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const User = require("../models/User")
const mailer = require("../middleware/mailer")

// Create a schema
const schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase()                              // Must have atleast 1 uppercase letters
    .has().lowercase()                              // Must have atleast 1 lowercase letters
    .has().digits(1)                                // Must have at least 1 digits
    .has().symbols(1)                                // Must have at least 1 special character
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

async function createRecord(req, res) {
    if (schema.validate(req.body.password)) {
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
            if (error) {
                console.log(error)
                res.status(500).send({
                    status: "Fail",
                    reason: "Internal Server Error While Creating Hash"
                })
            }
            else {
                try {
                    let data = new User(req.body)
                    data.password = hash
                    await data.save()
                    mailer.sendMail(
                        {
                            from: process.env.MAILSENDER,
                            to: data.email,
                            subject: `Welcome To ${process.env.SITE_NAME}`,
                            html:
                                `
                               <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">

                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color:#16a34a;padding:30px 20px;">
                            <div style="font-size:48px;line-height:1;">🎉</div>
                            <h1 style="margin:10px 0 0;color:#ffffff;font-size:28px;font-weight:bold;">
                                Welcome to ${process.env.SITE_NAME}
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:40px 30px;">

                            <h2 style="margin:0 0 20px;color:#111827;font-size:24px;">
                                Account Created Successfully
                            </h2>

                            <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">
                                Hi ${data.name},
                            </p>

                            <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">
                                Thank you for signing up with
                                <strong>${process.env.SITE_NAME}</strong>.
                                Your account has been successfully created and is now ready to use.
                            </p>

                            <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">
                                You can now log in and start exploring all the features and services available on our platform.
                            </p>

                            <div style="text-align:center;margin:30px 0;">
                                <a href="${process.env.SITE_URL}/login"
                                style="display:inline-block;background-color:#16a34a;color:#ffffff;text-decoration:none;padding:14px 32px;font-size:16px;font-weight:bold;border-radius:8px;">
                                    Login to Your Account
                                </a>
                            </div>

                            <div style="margin:30px 0;padding:20px;background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;">
                                <p style="margin:0;color:#166534;font-size:16px;font-weight:bold;text-align:center;">
                                    ✓ Registration Completed Successfully
                                </p>
                            </div>

                            <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.7;">
                                If you did not create this account, please contact our support team immediately.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#f9fafb;padding:25px 30px;border-top:1px solid #e5e7eb;">

                            <p style="margin:0 0 8px;color:#111827;font-size:14px;font-weight:bold;">
                                ${process.env.SITE_NAME}
                            </p>

                            <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">
                                Email: ${process.env.SITE_EMAIL}
                            </p>

                            <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">
                                Phone: ${process.env.SITE_PHONE}
                            </p>

                            <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
                                ${process.env.SITE_ADDRESS}
                            </p>

                        </td>
                    </tr>

                </table>   

                        `
                        }, (error) => {
                            if (error)
                                console.log(error)

                        }
                    )
                    res.send({
                        status: "Done",
                        data: data
                    })
                } catch (error) {
                    let errorMessage = {}
                    if (error.keyValue) {
                        error.keyValue.username ? errorMessage.username = "Username Already Taken" : ''
                        error.keyValue.email ? errorMessage.email = "Email Address Already Taken" : ''
                    }

                    else
                        errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
                    res.status(500).send({
                        status: "Fail",
                        reason: errorMessage
                    })


                }
            }
        })
    }
    else {
        res.status(500).send({
            status: "Fail",
            reason: schema.validate(req.body.password, { details: true }).map(x => x.message.replaceAll("string", "Password"))
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 })
        res.send({
            status: "Done",
            data: data
        })

    } catch (error) {
        res.status(500).send({
            status: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            res.send({
                status: "Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                status: "Fail",
                reason: "Record Not Found"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.username = req.body.username ?? data.username
            data.email = req.body.email ?? data.email
            data.email = req.body.email ?? data.email
            data.address = req.body.address ?? data.address
            data.role = req.body.role ?? data.role
            data.status = req.body.status ?? data.status
            await data.save()
            res.send({
                status: "Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                status: "Fail",
                reason: "Record Not Found"
            })
        }

    } catch (error) {
        console.log(error)
        let errorMessage = {}
        if (error.keyValue) {
            error.keyValue.username ? errorMessage.username = "Username Already Taken" : ''
            error.keyValue.email ? errorMessage.email = "Email Address Already Taken" : ''
        }

        else
            errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: errorMessage
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.send({
                status: "Done",
            })
        }
    } catch (error) {
        res.status(404).send({
            status: "Fail",
            reason: "Record Not Found"
        })
    }

}

async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (await bcrypt.compare(req.body.password, data.password)) {
                jwt.sign({ data }, process.env.JWT_USER_KEY,{expiresIn:"15 days"}, (error, token) => {
                    res.send({
                        status: "Done",
                        data: data,
                        token:token
                    })
                })

            }
            else {
                res.status(404).send({
                    status: "Fail",
                    reason: "Invalid Username Or Password"
                })
            }
        }
        else {
            res.status(404).send({
                status: "Fail",
                reason: "Invalid Username Or Password"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            let otp = Number(Math.floor(Math.random() * 1000000).toString().padEnd(6, "1"))
            data.passwordReset = {
                otp: otp,
                date: new Date()
            }
            await data.save()

            mailer.sendMail(
                {
                    from: process.env.MAILSENDER,
                    to: data.email,
                    subject: `OTP for password reset ${process.env.SITE_NAME}`,
                    html:
                        `
                               <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f4;padding:30px 0;">
                                    <tr>
                                        <td align="center">

                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">

                                                <!-- Header -->
                                                <tr>
                                                    <td align="center" style="background-color:#111827;padding:30px 20px;">
                                                        <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
                                                            ${process.env.SITE_NAME}
                                                        </h1>
                                                    </td>
                                                </tr>

                                                <!-- Content -->
                                                <tr>
                                                    <td style="padding:40px 30px;">
                                                        <h2 style="margin:0 0 15px;color:#111827;font-size:24px;">
                                                            Verify Your Account
                                                        </h2>

                                                        <p style="margin:0 0 20px;color:#4b5563;font-size:16px;line-height:1.6;">
                                                            We received a request to verify your identity. Use the One-Time Password (OTP) below to continue.
                                                        </p>

                                                        <div style="text-align:center;margin:35px 0;">
                                                            <span style="display:inline-block;background-color:#f3f4f6;border:2px dashed #d1d5db;padding:18px 35px;font-size:32px;font-weight:bold;letter-spacing:8px;color:#111827;border-radius:10px;">
                                                                ${otp}
                                                            </span>
                                                        </div>

                                                        <p style="margin:0 0 15px;color:#4b5563;font-size:15px;line-height:1.6;">
                                                            This OTP is valid for a limited time. Do not share it with anyone for security reasons.
                                                        </p>

                                                        <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.6;">
                                                            If you did not request this code, you can safely ignore this email.
                                                        </p>
                                                    </td>
                                                </tr>

                                                <!-- Footer -->
                                                <tr>
                                                    <td style="background-color:#f9fafb;padding:25px 30px;border-top:1px solid #e5e7eb;">
                                                        <p style="margin:0 0 8px;color:#111827;font-size:14px;font-weight:bold;">
                                                            ${process.env.SITE_NAME}
                                                        </p>

                                                        <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">
                                                            Email: ${process.env.SITE_EMAIL}
                                                        </p>

                                                        <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">
                                                            Phone: ${process.env.SITE_PHONE}
                                                        </p>

                                                        <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
                                                            ${process.env.SITE_ADDRESS}
                                                        </p>
                                                    </td>
                                                </tr>

                                            </table>

                                        </td>
                                    </tr>
                                </table>

                        `
                }, (error) => {
                    if (error)
                        console.log(error)

                }
            )

            res.send({
                status: "Done",
                message: "OTP has been sent to your registered email address"
            })
        }
        else {
            res.status(404).send({
                status: "Fail",
                reason: "User Not Found"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            console.log(data.passwordReset.otp,req.body.otp)
            if (data.passwordReset.otp == req.body.otp) {
                if (((new Date()) - data.passwordReset.date) < 600000)
                    res.send({
                        status: "Done",
                        message: "OTP has been matched"
                    })
                else {
                    res.status(404).send({
                        status: "Fail",
                        reason: "Otp Expired. Please Try Again"
                    })
                }
            }
            else {
                res.status(404).send({
                    status: "Fail",
                    reason: "Invalid Otp"
                })
            }

        }
        else {
            res.status(404).send({
                status: "Fail",
                reason: "Unauthorized Activity"
            })
        }

    } catch (error) {
        res.status(500).send({
            status: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            if (schema.validate(req.body.password)) {
                bcrypt.hash(req.body.password, 12, async (error, hash) => {
                    if (error) {
                        res.status(500).send({
                            status: "Fail",
                            reason: "Internal Server Error While Creating Hash Password"
                        })
                    }
                    else {
                        try {
                            data.password = hash

                            mailer.sendMail(
                                {
                                    from: process.env.MAILSENDER,
                                    to: data.email,
                                    subject: `Password Has Been Updated Successfully : Team ${process.env.SITE_NAME}`,
                                    html:
                                        `
                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
s
                                    <!-- Header -->
                                    <tr>
                                        <td align="center" style="background-color:#111827;padding:30px 20px;">
                                            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
                                                ${process.env.SITE_NAME}
                                            </h1>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding:40px 30px;">

                                            <h2 style="margin:0 0 20px;color:#111827;font-size:24px;">
                                                Password Updated Successfully
                                            </h2>

                                            <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">
                                                Hi ${data.name},
                                            </p>

                                            <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">
                                                This email confirms that your account password has been successfully updated.
                                            </p>

                                            <div style="margin:30px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;text-align:center;">
                                                <p style="margin:0;color:#111827;font-size:18px;font-weight:bold;">
                                                    ✓ Password Updated Successfully
                                                </p>
                                            </div>

                                            <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">
                                                You can now log in using your new password.
                                            </p>

                                            <div style="text-align:center;margin:30px 0;">
                                                <a href="${process.env.CLIENT_URL}/login"
                                                style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;padding:14px 32px;font-size:16px;font-weight:bold;border-radius:8px;">
                                                    Login to Your Account
                                                </a>
                                            </div>

                                            <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.7;">
                                                If you did not make this change, please contact our support team immediately and secure your account.
                                            </p>
                                            <a href="${process.env.SITE_URL}/forgot-password1" style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;padding:12px 24px;font-size:14px;font-weight:bold;border-radius:6px;"> Reset Password </a>

                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#f9fafb;padding:25px 30px;border-top:1px solid #e5e7eb;">

                                            <p style="margin:0 0 8px;color:#111827;font-size:14px;font-weight:bold;">
                                                ${process.env.SITE_NAME}
                                            </p>

                                            <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">
                                                Email: ${process.env.SITE_EMAIL}
                                            </p>

                                            <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">
                                                Phone: ${process.env.SITE_PHONE}
                                            </p>

                                            <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.5;">
                                                ${process.env.SITE_ADDRESS}
                                            </p>

                                        </td>
                                    </tr>

                                </table>
                        `
                                }, (error) => {
                                    if (error)
                                        console.log(error)

                                }
                            )
                            await data.save()

                            res.send({
                                status: "Done",
                                data: data
                            })
                        } catch (error) {
                            res.status(500).send({
                                status: "Fail",
                                reason: "Internal Server Error"
                            })


                        }
                    }
                })
            }
            else {
                res.status(500).send({
                    status: "Fail",
                    reason: schema.validate(req.body.password, { details: true }).map(x => x.message.replaceAll("string", "Password"))
                })
            }


        }
        else {
            res.status(404).send({
                status: "Fail",
                reason: "Unauthorized Activity"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: "Fail",
            reason: "Internal Server Error"
        })
    }
}



module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord, deleteRecord,
    login: login,
    forgetPassword1: forgetPassword1,
    forgetPassword2: forgetPassword2,
    forgetPassword3: forgetPassword3
}