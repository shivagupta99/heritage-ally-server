const ContactUs = require("../models/ContactUs")
const mailer = require("../middleware/mailer")


async function createRecord(req, res) {
    try {
        let data = new ContactUs(req.body)
        await data.save()
        mailer.sendMail(
            {
                from: process.env.MAILSENDER,
                to: data.email,
                subject: `Your Query Has Been Received : Team ${process.env.SITE_NAME}`,
                html:
                    `
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">

                        <tr>
                            <td align="center" style="background-color:#111827;padding:30px 20px;">
                                <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;">
                                    ${process.env.SITE_NAME}
                                </h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:40px 30px;">

                                <h2 style="margin:0 0 20px;color:#111827;font-size:24px;">
                                    📩 We've Received Your Message
                                </h2>

                                <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">
                                    Hi ${data.name},
                                </p>

                                <p style="margin:0 0 20px;color:#4b5563;font-size:16px;line-height:1.7;">
                                    Thank you for contacting ${process.env.SITE_NAME}. We have successfully received your Query and our team will review it shortly.
                                </p>

                                <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;text-align:center;">
                                    <p style="margin:0;color:#111827;font-size:18px;font-weight:bold;">
                                        ✓ Your Message Has Been Received
                                    </p>
                                </div>

                                <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">

                                    <p style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:bold;">
                                        Query Details
                                    </p>

                                    <p style="margin:0 0 10px;color:#111827;font-size:15px;">
                                        <strong>Subject:</strong> ${data.subject}
                                    </p>

                                    <p style="margin:0;color:#111827;font-size:15px;">
                                        <strong>Submitted On:</strong> ${new Date(data.createdAt).toLocaleString()}
                                    </p>

                                </div>

                                <p style="margin:0;color:#4b5563;font-size:16px;line-height:1.7;">
                                    We aim to respond as soon as possible. If your Query is urgent, please contact us using the details below.
                                </p>

                            </td>
                        </tr>

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
        mailer.sendMail(
            {
                from: process.env.MAILSENDER,
                to: process.env.MAILSENDER,
                subject: `New ContactUs Query Has Been Received : Team ${process.env.SITE_NAME}`,
                html:
                   `
                   <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">

                        <p style="margin:0 0 16px;color:#111827;font-size:16px;font-weight:bold;">
                            New Contact Query
                        </p>

                        <p style="margin:0 0 10px;color:#111827;font-size:15px;">
                            <strong>Name:</strong> ${data.name}
                        </p>

                        <p style="margin:0 0 10px;color:#111827;font-size:15px;">
                            <strong>Email:</strong> ${data.email}
                        </p>

                        <p style="margin:0 0 10px;color:#111827;font-size:15px;">
                            <strong>Subject:</strong> ${data.subject}
                        </p>

                        <p style="margin:0 0 10px;color:#111827;font-size:15px;">
                            <strong>Submitted On:</strong> ${new Date(data.createdAt).toLocaleString()}
                        </p>

                        <p style="margin:0 0 10px;color:#111827;font-size:15px;">
                            <strong>Message:</strong>
                        </p>

                        <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.7;">
                            ${data.message}
                        </p>

                    </div>

                    <div style="text-align:center;margin:30px 0;">
                        <a
                            href="${process.env.SITE_URL}/admin/contactus/show/${data._id}"
                            style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;padding:14px 32px;font-size:16px;font-weight:bold;border-radius:8px;"
                        >
                            Open Admin Panel
                        </a>
                    </div>
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
        console.log(error)
        let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: errorMessage
        })


    }
}

async function getRecord(req, res) {
    try {
        let data = await ContactUs.find().sort({ _id: -1 })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
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
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            data.status = req.body.status ?? data.status
            await data.save()
            mailer.sendMail(
            {
                from: process.env.MAILSENDER,
                to: data.email,
                subject: `Your Query Has Been Resolved : Team ${process.env.SITE_NAME}`,
                html:
                   `
                   <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;text-align:center;">
                            <p style="margin:0;color:#111827;font-size:18px;font-weight:bold;">
                                ✓ Your Query Has Been Resolved
                            </p>
                        </div>

                        <p style="margin:0 0 20px;color:#4b5563;font-size:16px;line-height:1.7;">
                            We're pleased to inform you that your Query has been reviewed and resolved by our support team. If you have any additional questions or need further assistance, please don't hesitate to contact us.
                        </p>

                        <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">

                            <p style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:bold;">
                                Query Details
                            </p>

                            <p style="margin:0 0 10px;color:#111827;font-size:15px;">
                                <strong>Query ID:</strong> ${data._id}
                            </p>

                            <p style="margin:0;color:#111827;font-size:15px;">
                                <strong>Resolved On:</strong> ${new Date(data.updatedAt).toLocaleString()}
                            </p>

                            <p style="margin:0 0 10px;color:#111827;font-size:15px;">
                                <strong>Subject:</strong> ${data.subject}
                            </p>

                            <p style="margin:0;color:#111827;font-size:15px;">
                                <strong>Status:</strong> Resolved
                            </p>

                        </div>

                       <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">

                            <p style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:bold;">
                                Need Further Assistance?
                            </p>

                            <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.7;">
                                If you still have any questions or believe your issue has not been fully resolved, please contact our support team. We're always happy to help.
                            </p>

                        </div>
                        <div style="text-align:center;margin:30px 0;">
                            <a
                                href="${process.env.SITE_URL}/contactus"
                                style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;padding:14px 32px;font-size:16px;font-weight:bold;border-radius:8px;"
                            >
                                Contact Support
                            </a>
                        </div>
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
        }
        else {
            res.status(404).send({
                status: "Fail",
                reason: "Record Not Found"
            })
        }

    } catch (error) {
        let errorMessage = {}
        if (error.keyValue)
            errorMessage = "ContactUs With This Name Is Already Exist"
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
        let data = await ContactUs.findOne({ _id: req.params._id })
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

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord, deleteRecord
}