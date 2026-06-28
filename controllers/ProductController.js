const Product = require("../models/Product")
const NewsLetter = require("../models/NewsLetter")

const fs = require("fs")
const mailer = require("../middleware/mailer")


async function createRecord(req, res) {
    try {
        let data = new Product(req.body)
        if (req.files)
            data.pic = Array.from(req.files).map(x => x.path)
        await data.save()

        let finalData = await Product.findOne({ _id: data._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])

        let emails = await NewsLetter.find()

        emails.forEach(item => {
            mailer.sendMail(
                {
                    from: process.env.MAILSENDER,
                    to: item.email,
                    subject: `See Our New Arrivals : Team ${process.env.SITE_NAME}`,
                    html:
                        `
                             <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">

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
                                            🚀 New Products Have Arrived
                                        </h2>

                                        <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">
                                            Hello,
                                        </p>

                                        <p style="margin:0 0 20px;color:#4b5563;font-size:16px;line-height:1.7;">
                                            We're excited to announce new additions to our collection. As a valued newsletter subscriber, you're among the first to know.
                                        </p>

                                        <!-- Featured Product -->
                                        <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">

                                            <p style="margin:0 0 16px;color:#111827;font-size:18px;font-weight:bold;text-align:center;">
                                                Featured Product
                                            </p>

                                            <div style="text-align:center;margin-bottom:20px;">
                                                <img
                                                    src="${process.env.SITE_URL}/${data.pic[0]}"
                                                    alt="Product Name"
                                                    style="max-width:100%;height:auto;border-radius:8px;"
                                                />
                                            </div>

                                            <p style="margin:0 0 10px;color:#111827;font-size:18px;font-weight:bold;">
                                                ${data.name}
                                            </p>

                                            <p style="margin:0 0 12px;color:#111827;font-size:16px;">
                                                <strong>Base Price:</strong> ₹${data.basePrice}
                                            </p>
                                            <p style="margin:0 0 12px;color:#111827;font-size:16px;">
                                                <strong>Discount:</strong> ₹${data.discount}
                                            </p>
                                            <p style="margin:0 0 12px;color:#111827;font-size:16px;">
                                                <strong>Final Price:</strong> ₹${data.finalPrice}
                                            </p>

                                            <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.7;">
                                                ${data.description}
                                            </p>

                                        </div>


                                        <!-- CTA -->
                                        <div style="text-align:center;margin:30px 0;">
                                            <a
                                                href="${process.env.SITE_URL}/product/${data._id}"
                                                style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;padding:14px 32px;font-size:16px;font-weight:bold;border-radius:8px;"
                                            >
                                                View Product
                                            </a>
                                        </div>

                                        <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.7;">
                                            Don't miss out—explore this product and discover what's new at ${process.env.SITE_NAME}.
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
        })

        res.send({
            status: "Done",
            data: finalData
        })
    } catch (error) {
        console.log(error)
        if (req.files) {
            try {
                Arrray.from(req.files).forEach(x => fs.unlinkSync(x.path))
            } catch (error) { }
        }
        let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: errorMessage
        })


    }
}

async function getRecord(req, res) {
    try {
        let data = await Product.find().sort({ _id: -1 })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
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
        let data = await Product.findOne({ _id: req.params._id })
            .populate("maincategory", ["name"])
            .populate("subcategory", ["name"])
            .populate("brand", ["name"])
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
        let data = await Product.findOne({ _id: req.params._id })


        if (data) {
            
            data.name = req.body.name ?? data.name
            data.maincategory = req.body.maincategory ?? data.maincategory
            data.subcategory = req.body.subcategory ?? data.subcategory
            data.brand = req.body.brand ?? data.brand
            data.Product = req.body.Product ?? data.Product
            data.color = req.body.color ?? data.color
            data.size = req.body.size ?? data.size
            data.basePrice = req.body.basePrice ?? data.basePrice
            data.discount = req.body.discount ?? data.discount
            data.finalPrice = req.body.finalPrice ?? data.finalPrice
            data.stock = req.body.stock ?? data.stock
            data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity
            data.description = req.body.description ?? data.description
            data.status = req.body.status ?? data.status
            await data.save()

            if (req.body.oldPics?.length === 0 && req.files?.length === 0) {
                res.send({
                    status: "Fail",
                    reason: "Please Upload Atleast One Image Or Keep Atleast One Image In Old Pic"
                })
            }

            else if (req.body.oldPics && req.body.oldPics?.length !== 0 && req.files?.length === 0) {
                data.pic.forEach(x => {
                    if (!req.body.oldPics.includes(x)) {
                        try {
                            fs.unlinkSync(x)
                        } catch (error) {
                        }
                    }
                })
                data.pic = req.body.oldPics
                await data.save()
            }

            else if (req.files?.length) {
                let oldPics = []
                if (req.body.oldPics) {
                    oldPics = req.body.oldPics.split(',')
                }
                data.pic.forEach(x => {
                    if (!oldPics.includes(x)) {
                        try {
                            fs.unlinkSync(x)
                        } catch (error) { }
                    }
                })
                data.pic = oldPics.concat(Array.from(req.files).map(x => x.path))
                await data.save()
            }
            let finalData = await Product.findOne({ _id: req.params._id })
                .populate("maincategory", ["name"])
                .populate("subcategory", ["name"])
                .populate("brand", ["name"])
            res.send({
                status: "Done",
                data: finalData
            })



        }
        else {
            res.status(404).send({
                status: "Fail",
                reason: "Record Not Found"
            })
        }

    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path)
        }
        console.log(error)
        let errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: errorMessage
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Product.findOne({ _id: req.params._id })
        if (data) {
            try {
                data.pic.forEach(x => fs.unlinkSync(x))
            } catch (error) { }
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