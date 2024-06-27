const userModel = require("../../models/user");


exports.postVerifyUserwithPhone = async (req, res) => {
    try{
        let phone = req.body.phone;
        let user = await userModel.findOne({ phone: phone });
        res.status(200).send({ status: "Success", user: user });
    }catch(err){
        res.status(500).send({ status: "Failure", message: "Error From Server" });
    }
}