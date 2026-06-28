const TestimonialRouter = require("express").Router()
const { authBuyer,authPublic } = require("../middleware/auth")

const {
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
} = require("../controllers/TestimonialController")

TestimonialRouter.post("", authBuyer, createRecord)
TestimonialRouter.get("/", authPublic, getRecord)
TestimonialRouter.get("/:_id", authBuyer, getSingleRecord)
TestimonialRouter.put("/:_id", authBuyer, updateRecord)
TestimonialRouter.delete("/:_id", authBuyer, deleteRecord)



module.exports = TestimonialRouter