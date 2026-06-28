const Checkout = require("../models/Checkout")
const { populate } = require("../models/User")
const mailer = require("../middleware/mailer")

const Razorpay = require("razorpay")

//Payment API
async function order(req, res) {
    try {
        const instance = new Razorpay({
            key_id: process.env.RPKEYID,
            key_secret: process.env.RPSECRETKEY,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR"
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.json({ data: order });
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!" });
        console.log(error);
    }
}

async function verifyOrder(req, res) {
    try {
        var check = await Checkout.findOne({ _id: req.body.checkid })
        check.rppid = req.body.razorpay_payment_id
        check.paymentStatus = "Done"
        check.paymentMode = "Net Banking"
        await check.save()
        res.status(200).send({ result: "Done", message: "Payment SuccessFull" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}


async function createRecord(req, res) {
    try {
        let data = new Checkout(req.body)
        await data.save()
        let finalData = await Checkout.findOne({ _id: data._id })
            .populate("user", ["name", "userid"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })

        let products = finalData.products?.map((item) => {
            return `
           <tr>
                <td style="border-bottom:1px solid #eee;">${item.product.name}</td>
                <td style="border-bottom:1px solid #eee;">${item.qty}</td>
                <td style="border-bottom:1px solid #eee;">${item.product?.finalPrice}</td>
            </tr>
           `
        }).join("")

        mailer.sendMail(
            {
                from: process.env.MAILSENDER,
                to: data.deliveryAddress?.email,
                subject: `Order Has Been Placed Successfully ${process.env.SITE_NAME}`,
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

                        <!-- Main Content -->
                        <tr>
                            <td style="padding:40px 30px;">

                                <h2 style="margin:0 0 20px;color:#111827;font-size:24px;">
                                    🎉 Order Confirmed
                                </h2>

                                <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">
                                    Hi ${data.deliveryAddress?.name},
                                </p>

                                <p style="margin:0 0 20px;color:#4b5563;font-size:16px;line-height:1.7;">
                                    Thank you for your order. We've received your purchase and are preparing it for processing.
                                </p>

                                <!-- Success Message -->
                                <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;text-align:center;">
                                    <p style="margin:0;color:#111827;font-size:18px;font-weight:bold;">
                                        ✓ Your Order Has Been Successfully Placed
                                    </p>
                                </div>

                                <!-- Order Details -->
                                <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">

                                    <p style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:bold;">
                                        Order Details
                                    </p>

                                    <p style="margin:0 0 12px;color:#111827;font-size:15px;">
                                        <strong>Order ID:</strong> ${data._id}
                                    </p>

                                    <p style="margin:0 0 12px;color:#111827;font-size:15px;">
                                        <strong>Order Date:</strong> ${new Date(data.createdAt).toLocaleString()}
                                    </p>

                                    <p style="margin:0 0 12px;color:#111827;font-size:15px;">
                                        <strong>Payment Method:</strong> ${data.paymentMode}
                                    </p>

                                    <p style="margin:0 0 12px;color:#111827;font-size:15px;">
                                        <strong>Subtotal:</strong> ₹${data.subTotal}
                                    </p>

                                    <p style="margin:0 0 12px;color:#111827;font-size:15px;">
                                        <strong>Shipping:</strong> ₹${data.shipping}
                                    </p>

                                    <p style="margin:0;color:#111827;font-size:17px;font-weight:bold;">
                                        <strong>Total:</strong> ₹${data.total}
                                    </p>

                                </div>

                                <!-- Order Items -->
                                <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">

                                    <p style="margin:0 0 16px;color:#111827;font-size:16px;font-weight:bold;">
                                        Order Items
                                    </p>

                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">

                                        <tr>
                                            <th align="left" style="padding:10px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;">
                                                Item
                                            </th>

                                            <th align="center" style="padding:10px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;">
                                                Qty
                                            </th>

                                            <th align="right" style="padding:10px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;">
                                                Price
                                            </th>
                                        </tr>

                                        ${products}

                                    </table>

                                </div>

                                <!-- Shipping Address -->
                                <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">

                                    <p style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:bold;">
                                        Shipping Address
                                    </p>

                                    <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.7;">
                                        ${data.deliveryAddress?.address}<br>
                                        ${data.deliveryAddress?.city}, ${data.deliveryAddress?.state} - ${data.deliveryAddress?.pin}<br>
                                        Phone: ${data.deliveryAddress?.phone}
                                    </p>

                                </div>

                                <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">
                                    We'll send another email once your order has been shipped.
                                </p>

                                <!-- CTA -->
                                <div style="text-align:center;margin:30px 0;">
                                    <a
                                        href="${process.env.SITE_URL}/profile"
                                        style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;padding:14px 32px;font-size:16px;font-weight:bold;border-radius:8px;"
                                    >
                                        View My Orders
                                    </a>
                                </div>

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
            data: finalData
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
        let data = await Checkout.find().sort({ _id: -1 })
            .populate("user", ["name", "userid"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
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

async function getUserRecord(req, res) {
    try {
        let data = await Checkout.find({ user: req.params._id }).sort({ _id: -1 })
            .populate("user", ["name", "userid"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
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
        let data = await Checkout.findOne({ _id: req.params._id })
            .populate("user", ["name", "userid"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
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
        let data = await Checkout.findOne({ _id: req.params._id })
            .populate("user", ["name", "userid"])
            .populate({
                path: "products.product",
                select: "name brand finalPrice stockQuantity pic",
                populate: {
                    path: "brand",
                    select: "-_id name"
                },
                options: {
                    slice: {
                        pic: 1
                    }
                }
            })
        if (data) {
            data.orderStatus = req.body.orderStatus ?? data.orderStatus
            data.paymentMode = req.body.paymentMode ?? data.paymentMode
            data.paymentStatus = req.body.paymentStatus ?? data.paymentStatus
            data.rppid = req.body.rppid ?? data.rppid

            await data.save()
            mailer.sendMail(
                {
                    from: process.env.MAILSENDER,
                    to: data.deliveryAddress?.email,
                    subject: `Order Status is Updated ${process.env.SITE_NAME}`,
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
                                        📦 Order Status Updated
                                    </h2>

                                    <p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">
                                        Hi ${data.deliveryAddress?.name},
                                    </p>

                                    <p style="margin:0 0 20px;color:#4b5563;font-size:16px;line-height:1.7;">
                                        We have an update regarding your order.
                                    </p>

                                    <!-- Status -->
                                    <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;text-align:center;">
                                        <p style="margin:0;color:#111827;font-size:18px;font-weight:bold;">
                                            Order Status: ${data.orderStatus}
                                        </p>
                                    </div>

                                    <!-- Order Details -->
                                    <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">

                                        <p style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:bold;">
                                            Order Details
                                        </p>

                                        <p style="margin:0 0 12px;color:#111827;font-size:15px;">
                                            <strong>Order ID:</strong> ${data._id}
                                        </p>

                                        <p style="margin:0;color:#111827;font-size:15px;">
                                            <strong>Current Status:</strong> ${data.orderStatus}
                                        </p>

                                        <p style="margin:0 0 12px;color:#111827;font-size:15px;">
                                            <strong>Updated On:</strong> ${new Date(data.createdAt).toLocaleString()}
                                        </p>

                                    </div>

                                    ${data.trackingUrl
                            ? `
                                    <div style="text-align:center;margin:30px 0;">
                                        <a
                                            href="${process.env.SITE_URL}/profile"
                                            style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;padding:14px 32px;font-size:16px;font-weight:bold;border-radius:8px;"
                                        >
                                            Track Package
                                        </a>
                                    </div>
                                    `
                            : ""
                        }


                                    <!-- Shipping Address -->
                                    <div style="margin:25px 0;padding:20px;background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">

                                        <p style="margin:0 0 12px;color:#111827;font-size:16px;font-weight:bold;">
                                            Shipping Address
                                        </p>

                                        <p style="margin:0;color:#4b5563;font-size:15px;line-height:1.7;">
                                            ${data.deliveryAddress?.address}<br>
                                            ${data.deliveryAddress?.city}, ${data.deliveryAddress?.state} - ${data.deliveryAddress?.pin}<br>
                                            Phone: ${data.deliveryAddress?.phone}
                                        </p>

                                    </div>

                                    <div style="text-align:center;margin:30px 0;">
                                        <a
                                            href="${process.env.SITE_URL}/profile"
                                            style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;padding:14px 32px;font-size:16px;font-weight:bold;border-radius:8px;"
                                        >
                                            View Order
                                        </a>
                                    </div>

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
        }
        else {
            res.status(404).send({
                status: "Fail",
                reason: "Record Not Found"
            })
        }

    } catch (error) {
        res.status(500).send({
            status: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Checkout.findOne({ _id: req.params._id })
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
    deleteRecord, deleteRecord,
    getUserRecord: getUserRecord,
    order:order,
    verifyOrder:verifyOrder
}