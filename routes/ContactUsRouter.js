const ContactUsRouter= require("express").Router()
const{
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
}=require("../controllers/ContactUsController")

ContactUsRouter.post("",createRecord)
ContactUsRouter.get("",getRecord)
ContactUsRouter.get("/:_id",getSingleRecord)
ContactUsRouter.put("/:_id",updateRecord)
ContactUsRouter.delete("/:_id",deleteRecord)



module.exports=ContactUsRouter