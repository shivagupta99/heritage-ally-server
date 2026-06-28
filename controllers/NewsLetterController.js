const NewsLetter = require("../models/NewsLetter")
const mailer = require("../middleware/mailer")


async function createRecord(req, res) {
    try {
        var data = new NewsLetter(req.body)
        await data.save()
        mailer.sendMail(
            {
                from: process.env.MAILSENDER,
                to: data.email,
                subject: `Subscription Confirmed : Team ${process.env.SITE_NAME}`,
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
                                                🎉 Subscription Confirmed
                                            </h2>

                                            <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">
                                                Thank you for subscribing to the ${process.env.SITE_NAME} newsletter.
                                            </p>

                                            <p style="margin:0 0 20px;color:#4b5563;font-size:16px;line-height:1.7;">
                                                You'll now receive updates about new products, special offers, promotions, and important announcements directly in your inbox.
                                            </p>

                                            <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;text-align:center;">
                                                <p style="margin:0;color:#111827;font-size:18px;font-weight:bold;">
                                                    ✓ Newsletter Subscription Successful
                                                </p>
                                            </div>

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

        res.send({
            status: "Done",
            data: data
        })
    } catch (error) {
        // console.log(error)
        if (error.keyValue) {
            res.send({
                status: "Done",
                data: data
            })
        }
        else {
            res.status(500).send({
                status: "Fail",
                reason: "Internal Server Error"
            })
        }

    }
}

async function getRecord(req, res) {
    try {
        let data = await NewsLetter.find().sort({ _id: -1 })
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
        let data = await NewsLetter.findOne({ _id: req.params._id })
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
        let data = await NewsLetter.findOne({ _id: req.params._id })
        if (data) {
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
        let errorMessage = {}
        if (error.keyValue)
            errorMessage = "NewsLetter With This Name Is Already Exist"
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
        let data = await NewsLetter.findOne({ _id: req.params._id })
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