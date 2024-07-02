exports.postVerifyUserParamsCheck = (req, res, next) => {
    if (req.body.phone) {
        next();
    } else {
        res
            .status(400)
            .send({ status: "Failure", message: "Phone is not Provided" });
    }
}

exports.getPricingsForCityParamsCheck = (req, res, next) => {
    if (req.query.city) {
        next();
    } else {
        res
            .status(400)
            .send({ status: "Failure", message: "City is not Provided" });
    }
}