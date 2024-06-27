exports.postVerifyUserParamsCheck = (req, res, next) => {
    if (req.body.phone) {
        next();
    } else {
        res
            .status(400)
            .send({ status: "Failure", message: "Phone is not Provided" });
    }
}