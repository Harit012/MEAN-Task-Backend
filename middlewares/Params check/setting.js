exports.patchSettingsParamsCheck = (req,res,next)=>{
    if (req.body.timeOut && req.body.stops) {
        next();
    }
    else{
        res
        .status(400)
        .send({ success: false, error: "no request body recived" });
    }
}