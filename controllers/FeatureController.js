const Feature = require("../models/Feature")
async function createRecord(req, res) {
    try {
        let data = new Feature(req.body)
        await data.save()
        res.send({
            status: "Done",
            data: data
        })
    } catch (error) {
        console.log(error)
        let errorMessage = {}
        if (error.keyValue)
            errorMessage = "Feature With This Name Is Already Exist"
        else
            errorMessage = Object.fromEntries(Object.keys(error.errors).map(key => [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: errorMessage
        })


    }
}

async function getRecord(req, res) {
    try {
        let data = await Feature.find().sort({ _id: -1 })
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
        let data = await Feature.findOne({ _id: req.params._id })
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
        let data = await Feature.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.icon = req.body.icon ?? data.icon
            data.shortDescription = req.body.shortDescription ?? data.shortDescription
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
            errorMessage = "Feature With This Name Is Already Exist"
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
        let data = await Feature.findOne({ _id: req.params._id })
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
    deleteRecord,deleteRecord
}