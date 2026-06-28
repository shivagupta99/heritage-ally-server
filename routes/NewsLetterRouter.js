const NewsLetterRouter= require("express").Router()
const { authPublic, authAdmin, authSuperAdmin } = require("../middleware/auth")
const{
    createRecord,
    getRecord,
    getSingleRecord,
    updateRecord,
    deleteRecord
}=require("../controllers/NewsLetterController")

NewsLetterRouter.post("",authPublic,createRecord)
NewsLetterRouter.get("",authAdmin,getRecord)
NewsLetterRouter.get("/:_id",authAdmin,getSingleRecord)
NewsLetterRouter.put("/:_id",authAdmin,updateRecord)
NewsLetterRouter.delete("/:_id",authSuperAdmin,deleteRecord)



module.exports=NewsLetterRouter