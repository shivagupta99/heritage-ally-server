const Setting = require("../models/Setting")
async function createRecord(req, res) {
    try {
        let data = await Setting.findOne()
        if (data) {
            data.siteName = req.body.siteName ?? data.siteName
            data.map1 = req.body.map1 ?? data.map1
            data.map2 = req.body.map2 ?? data.map2
            data.address = req.body.address ?? data.address
            data.email = req.body.email ?? data.email
            data.phone = req.body.phone ?? data.phone
            data.facebook = req.body.facebook ?? data.facebook
            data.twitter = req.body.twitter ?? data.twitter
            data.linkedin = req.body.linkedin ?? data.linkedin
            data.instagram = req.body.instagram ?? data.instagram
            data.youtube = req.body.youtube ?? data.youtube
            data.privacyPolicy = req.body.privacyPolicy ?? data.privacyPolicy
            data.termsConditions = req.body.termsConditions ?? data.termsConditions
            data.refundPolicy = req.body.refundPolicy ?? data.refundPolicy

        }
        else {
            data = new Setting(req.body)
        }
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

async function getRecord(req, res) {
    try {
        let data = await Setting.find().sort({ _id: -1 })
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


module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
}